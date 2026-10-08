/**
 * Désactive les animations d'entrée (état final affiché d'emblée) pour
 * prefers-reduced-motion ET pour les robots / outils de rendu (Googlebot,
 * Lighthouse, navigateurs pilotés) : leurs captures étaient prises pendant le
 * fondu (opacity 0) et sortaient vides. Le contenu est identique, seule
 * l'animation d'entrée est omise.
 */
const CRAWLER_RE = /googlebot|bingbot|google-inspectiontool|lighthouse|chrome-lighthouse|headlesschrome|duckduckbot|yandex|baiduspider|applebot/i;

export const isCrawler = () =>
  typeof navigator !== "undefined" &&
  (CRAWLER_RE.test(navigator.userAgent || "") || navigator.webdriver === true);

export const noMotion = () =>
  typeof window !== "undefined" &&
  ((window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches) ||
    isCrawler());
