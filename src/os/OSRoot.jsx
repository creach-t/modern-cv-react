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

/**
 * Contenu sémantique caché : crawlable + lisible par lecteur d'écran même en mode OS.
 * Le <h1> n'existe qu'ici hors mode studio (le Hero porte déjà le h1 du site).
 */
const SeoContent = ({ withH1 = true }) => (
  <div className="sr-only">
    {withH1 && <h1>Théo Créac'h, développeur web full-stack JavaScript</h1>}
    <p>
      Développeur full-stack React / Node.js basé à Saint-Maur-des-Fossés,
      France. Applications web auto-hébergées (Docker, CI/CD, Traefik).
    </p>
    <h2>Projets</h2>
    <ul>
      <li>
        <a href="/projets/devjobs/">DevJobs, recherche d'offres d'emploi tech</a>
      </li>
      <li>
        <a href="/projets/queens-game/">Queens Game Web, puzzle Queens en ligne</a>
      </li>
      <li>
        <a href="/projets/ocoffee/">O'Coffee, boutique de cafés de spécialité</a>
      </li>
      <li>
        <a href="/projets/zombieland/">ZombieLand, parc d'attractions et billetterie</a>
      </li>
      <li>
        <a href="/projets/makemelearn/">makemelearn, jeu de ferme gratuit en ligne</a>
      </li>
      <li>
        <a href="/projets/vectokid/">VectoKid, éditeur de dessin pour enfants</a>
      </li>
    </ul>
    <h2>Contact</h2>
    <ul>
      <li>
        <a href="mailto:creach.t@gmail.com">creach.t@gmail.com</a>
      </li>
      <li>
        <a href="https://linkedin.com/in/creachtheo">Théo Créac'h sur LinkedIn</a>
      </li>
      <li>
        <a href="https://github.com/creach-t">Théo Créac'h sur GitHub</a>
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
        <Studio />
        <SeoContent withH1={false} />
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
