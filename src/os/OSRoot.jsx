import React, { Suspense, lazy, useEffect, useState } from "react";
import { useOS } from "./osContext";
import { useIsMobile } from "./useIsMobile";
import BootSequence from "./boot/BootSequence";
import Desktop from "./desktop/Desktop";
import MobileShell from "./mobile/MobileShell";
import Studio from "../studio/Studio";

// Mode CV chargé à la demande : il embarque les libs PDF lourdes
// (@react-pdf/renderer, jspdf, html2canvas). Le site par défaut reste léger.
const CVMode = lazy(() => import("./CVMode"));

const CVFallback = () => (
  <div className="grid min-h-[100dvh] place-items-center bg-[#0a0b10] font-mono text-sm text-gray-500">
    loading résumé…
  </div>
);

/** Contenu sémantique caché : crawlable + lisible par lecteur d'écran même en mode OS. */
const SeoContent = () => (
  <div className="sr-only">
    <h1>Théo Créach — Développeur web full-stack JavaScript</h1>
    <p>
      Développeur full-stack React / Node.js basé à Saint-Maur-des-Fossés,
      France. Applications web auto-hébergées (Docker, CI/CD, Traefik).
    </p>
    <h2>Projets</h2>
    <ul>
      <li>
        <a href="http://devjobs.creachtheo.fr">DevJobs — recherche d'emploi tech</a>
      </li>
      <li>
        <a href="https://queens-game.creachtheo.fr">Queens Game Web</a>
      </li>
      <li>
        <a href="https://ocoffee.creachtheo.fr">O'Coffee — e-commerce</a>
      </li>
      <li>
        <a href="https://zombieland.creachtheo.fr">ZombieLand — billetterie</a>
      </li>
    </ul>
    <h2>Contact</h2>
    <ul>
      <li>
        <a href="mailto:creach.t@gmail.com">creach.t@gmail.com</a>
      </li>
      <li>
        <a href="https://linkedin.com/in/creachtheo">LinkedIn</a>
      </li>
      <li>
        <a href="https://github.com/creach-t">GitHub</a>
      </li>
    </ul>
  </div>
);

const OSRoot = () => {
  const { mode } = useOS();
  const isMobile = useIsMobile();
  // Le boot (console) rejoue à chaque entrée dans creachOS.
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    if (mode !== "os") setBooted(false);
  }, [mode]);

  if (mode === "studio") {
    return (
      <>
        <SeoContent />
        <Studio />
      </>
    );
  }

  if (mode === "cv") {
    return (
      <>
        <SeoContent />
        <Suspense fallback={<CVFallback />}>
          <CVMode />
        </Suspense>
      </>
    );
  }

  if (!booted) {
    return (
      <>
        <SeoContent />
        <BootSequence onDone={() => setBooted(true)} />
      </>
    );
  }

  return (
    <>
      <SeoContent />
      {isMobile ? <MobileShell /> : <Desktop />}
    </>
  );
};

export default OSRoot;
