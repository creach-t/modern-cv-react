import { useSyncExternalStore } from "react";

/**
 * Détection centralisée du « tier » de l'appareil pour piloter le niveau
 * d'effets visuels du studio (low / mid / high), + flags dérivés prêts à
 * l'emploi (fx). But : garder l'expérience riche sur les machines capables,
 * dégrader DISCRÈTEMENT sur mobile / bas de gamme (jamais un rendu cassé).
 *
 * Les signaux (mémoire, cœurs, réseau, pointeur, écran, WebGL) sont figés au
 * chargement ; seul prefers-reduced-motion est réévalué en direct (l'utilisateur
 * peut le changer). Le calcul est mémoïsé au niveau module → coût quasi nul,
 * partagé par tous les composants, pas besoin de contexte.
 */

const isBrowser = typeof window !== "undefined";

const mq = (q) =>
  isBrowser && window.matchMedia ? window.matchMedia(q) : { matches: false };

const prefersReducedMotion = () => mq("(prefers-reduced-motion: reduce)").matches;

// Sonde WebGL bon marché : contexte réel + heuristique « GPU logiciel » (SwiftShader,
// llvmpipe…) qu'on refuse pour ne pas ramer sur du rendu CPU.
let webglCache = null;
const detectWebGL = () => {
  if (webglCache !== null) return webglCache;
  if (!isBrowser) return (webglCache = false);
  try {
    const c = document.createElement("canvas");
    const gl =
      c.getContext("webgl") || c.getContext("experimental-webgl");
    if (!gl) return (webglCache = false);
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg
      ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)).toLowerCase()
      : "";
    const software = /swiftshader|llvmpipe|software|basic render/.test(renderer);
    return (webglCache = !software);
  } catch (e) {
    return (webglCache = false);
  }
};

const computeSignals = () => {
  if (!isBrowser) {
    return { tier: "high", reducedMotion: false, coarse: false, webgl: true };
  }

  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4; // Chrome/Android uniquement ; sinon 4
  const conn = navigator.connection || {};
  const saveData = !!conn.saveData;
  const eff = conn.effectiveType || "4g";
  const coarse = mq("(pointer: coarse)").matches;
  const minDim = Math.min(window.screen?.width || 1024, window.screen?.height || 768);
  const webgl = detectWebGL();

  let score = 0;

  if (cores >= 8) score += 2;
  else if (cores >= 4) score += 1;
  else score -= 1; // <= 2 cœurs

  if (mem >= 8) score += 2;
  else if (mem >= 4) score += 1;
  else if (mem <= 2) score -= 2;

  if (coarse) score -= 1;
  if (minDim < 768) score -= 1;

  if (saveData) score -= 3;
  if (eff === "slow-2g" || eff === "2g") score -= 3;
  else if (eff === "3g") score -= 2;

  if (!webgl) score -= 3;

  let tier = score >= 3 ? "high" : score >= 0 ? "mid" : "low";

  // Un appareil tactile ne reçoit jamais le traitement « high » (DPR2 / 8 rouages
  // / 60fps / grain) : garantit un mobile frais, même flagship.
  if (coarse && tier === "high") tier = "mid";
  // Data-saver ou WebGL logiciel/absent : jamais de WebGL, dégradé statique.
  if (saveData || !webgl) tier = "low";

  return { tier, reducedMotion: false, coarse, webgl };
};

let baseCache = null;
const base = () => (baseCache || (baseCache = computeSignals()));

// --- store réactif minimal pour prefers-reduced-motion ---
const subscribe = (cb) => {
  const m = mq("(prefers-reduced-motion: reduce)");
  if (m.addEventListener) m.addEventListener("change", cb);
  else if (m.addListener) m.addListener(cb);
  return () => {
    if (m.removeEventListener) m.removeEventListener("change", cb);
    else if (m.removeListener) m.removeListener(cb);
  };
};

let snapshot = null;
let lastReduced = null;
const getSnapshot = () => {
  const reduced = isBrowser ? prefersReducedMotion() : false;
  if (snapshot && reduced === lastReduced) return snapshot; // stable → pas de re-render
  lastReduced = reduced;
  const b = base();
  const tier = b.tier;
  const high = tier === "high";

  snapshot = {
    tier,
    reducedMotion: reduced,
    coarse: b.coarse,
    webgl: b.webgl,
    fx: {
      // WebGL : monté seulement hors low ; réglages selon tier.
      webgl: tier !== "low",
      gearCount: high ? 8 : 5,
      dprCap: high ? 2 : 1.5,
      antialias: high,
      fpsCap: high ? 60 : 30,
      // Effets composited coûteux : version « live » seulement en high,
      // équivalent statique (dégradé, pas de filter/mix-blend) ailleurs.
      liveGlow: high, // ParallaxGlow : blur + parallax live vs dégradé statique
      scrimBlur: high, // TextScrim : filter blur(40px) vs dégradé nu
      grain: high, // Ambiance (grain plein écran mix-blend)
      navBlur: tier !== "low", // backdrop-blur nav
      splitChars: high, // SplitText lettre-par-lettre vs titre entier
      cursorGlow: high && !b.coarse && !reduced,
      tilt: high, // TiltCard (inerte au tactile de toute façon)
      // Toute animation d'entrée coupée en reduced-motion.
      animate: !reduced,
    },
  };
  return snapshot;
};

/**
 * @returns {{tier:'low'|'mid'|'high', reducedMotion:boolean, coarse:boolean,
 *   webgl:boolean, fx:object}}
 */
export const useDeviceTier = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export default useDeviceTier;
