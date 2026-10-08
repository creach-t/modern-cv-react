// Post-build SEO : prérendu statique (SSG léger) + sitemap.
//
// Exécuté après `react-scripts build` (cf. script "build" du package.json).
// Sans dépendance : Node natif uniquement.
//
//  1. Injecte dans build/index.html un contenu HTML sémantique réel (h1, projets,
//     parcours, compétences) à l'intérieur de <div id="root">. React 18
//     (createRoot) le remplace au montage : aucun risque d'hydratation, mais
//     Google et les crawlers sans JS voient une vraie page.
//  2. Génère des pages statiques : /projets/, /projets/<slug>/ et 404.html.
//  3. Génère sitemap.xml (URL canoniques uniquement, avec <lastmod>).
//  4. Garde-fou : échoue si des fichiers de dev (@vite/client, @react-refresh)
//     se retrouvent dans le build de prod.
//
// Source de contenu : public/data/*.json (+ scripts/seo/site.mjs).

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { SITE, PROJECTS } from "./seo/site.mjs";

const BUILD = "build";
const DATA = "public/data";

const readJson = async (name) =>
  JSON.parse(await readFile(join(DATA, `${name}.json`), "utf8"));

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const abs = (path) => `${SITE.url}${path}`;
const warnings = [];

// ── lastmod : git (dernier commit touchant les sources) → SEO_LASTMOD → repli ──
const lastmod = (paths) => {
  try {
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", ...paths],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
    if (out) return out;
  } catch {
    /* pas de .git (build Docker) */
  }
  return (process.env.SEO_LASTMOD || "").slice(0, 10) || SITE.fallbackLastmod;
};

// ── Données ──
const projectsData = (await readJson("projects")).projects;
const journey = await readJson("journey");
const skills = await readJson("skills");

const CATEGORY = {
  ocoffee: "ShoppingApplication",
  zombieland: "EntertainmentApplication",
  "queens-game": "GameApplication",
  devjobs: "BusinessApplication",
  makemelearn: "GameApplication",
  vectokid: "DesignApplication",
};

const projects = PROJECTS.map((cfg) => {
  const d = cfg.dataId ? projectsData.find((p) => p.id === cfg.dataId) : null;
  if (cfg.dataId && !d) throw new Error(`Projet introuvable : ${cfg.dataId}`);
  const fr = d?.fr;
  const link = (d?.link || cfg.link).replace(/^http:\/\//, "https://");
  return {
    slug: cfg.slug,
    path: `/projets/${cfg.slug}/`,
    title: cfg.title,
    description: cfg.description,
    anchor: cfg.anchor,
    imageAlt: cfg.imageAlt,
    label: fr?.label || cfg.label,
    value: fr?.value || cfg.value,
    summary: fr?.description || cfg.summary,
    paragraphs: fr ? [fr.explanation] : cfg.paragraphs,
    improvements: fr?.improvements || [],
    technologies: d?.technologies || cfg.technologies || [],
    github: d?.github || cfg.github || [],
    imageId: d?.id || null,
    link,
    category: CATEGORY[cfg.slug],
  };
});

// ── Gabarits ──
// Règles partagées [sélecteur, déclarations] : préfixées par .seo-static sur l'accueil.
const RULES = [
  ["a", "color:#a5a6e6"],
  ["a:hover", "color:#fff"],
  [".wrap", "max-width:62rem;margin:0 auto;padding:1.5rem 1.5rem 4rem"],
  [".top", "display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;align-items:center;justify-content:space-between;padding-bottom:1rem;border-bottom:1px solid rgba(255,255,255,.1)"],
  [".top a", "text-decoration:none;font-weight:600"],
  ["nav a", "margin-right:1.25rem;font-weight:500"],
  ["h1", "font-size:clamp(2rem,6vw,3.25rem);line-height:1.1;margin:2rem 0 .5rem;color:#fff"],
  ["h2", "font-size:1.6rem;margin:2.5rem 0 .75rem;color:#fff"],
  ["h3", "font-size:1.2rem;margin:1.5rem 0 .25rem;color:#fff"],
  ["p", "margin:.5rem 0;color:#cbd5e1;max-width:46rem"],
  [".lead", "font-size:1.15rem;color:#e2e8f0"],
  [".tags", "display:flex;flex-wrap:wrap;gap:.5rem;padding:0;list-style:none;margin:1rem 0"],
  [".tags li", "border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);border-radius:.4rem;padding:.15rem .6rem;font-size:.85rem"],
  [".btn", "display:inline-block;background:#6667ab;color:#fff;text-decoration:none;font-weight:600;border-radius:.5rem;padding:.6rem 1.1rem;margin:.5rem .75rem .5rem 0"],
  [".btn:hover", "background:#7a7bc4;color:#fff"],
  ["img", "max-width:100%;height:auto;border-radius:1rem;border:1px solid rgba(255,255,255,.1);display:block;margin:1.5rem 0"],
  ["ul.plain", "padding-left:1.2rem;color:#cbd5e1"],
  [".card", "border-top:1px solid rgba(255,255,255,.1);padding:.75rem 0 1rem"],
  [".crumb", "font-size:.9rem;color:#94a3b8;margin:1.5rem 0 0"],
  ["footer", "margin-top:4rem;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.1);color:#94a3b8;font-size:.9rem"],
];
const rules = (prefix = "") =>
  RULES.map(([sel, decl]) => `${sel.split(",").map((x) => prefix + x).join(",")}{${decl}}`).join("");
const CSS =
  ':root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#05060a;color:#e5e7eb;font:16px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
  rules();
const HOME_CSS =
  ".seo-static{background:#05060a;color:#e5e7eb;min-height:100vh;font:16px/1.65 system-ui,-apple-system,sans-serif}" +
  rules(".seo-static ");

const ldTag = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;

const personRef = { "@id": `${SITE.url}/#person` };

const page = ({ title, description, path, body, jsonld = [], noindex = false }) => `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : `<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${abs(path)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(path)}">
<meta property="og:image" content="${abs(SITE.ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(SITE.ogImageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs(SITE.ogImage)}">
<meta name="twitter:image:alt" content="${esc(SITE.ogImageAlt)}">`}
<meta name="theme-color" content="#05060a">
<link rel="icon" href="/img/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png">
<style>${CSS}</style>
${jsonld.map(ldTag).join("\n")}
</head>
<body>
<div class="wrap">
<div class="top"><a href="/">Théo Créac'h</a>
<nav aria-label="Navigation principale"><a href="/">Accueil</a><a href="/projets/">Projets</a><a href="mailto:creach.t@gmail.com">Contact</a></nav></div>
${body}
<footer><p>Théo Créac'h, développeur web full-stack JavaScript à ${esc(SITE.locality)}. <a href="mailto:creach.t@gmail.com">creach.t@gmail.com</a> · <a href="${SITE.sameAs[0]}">Théo Créac'h sur LinkedIn</a> · <a href="${SITE.sameAs[1]}">Théo Créac'h sur GitHub</a></p></footer>
</div>
</body>
</html>
`;

const breadcrumb = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: abs(path),
  })),
});

const picture = (id, alt, { priority = false } = {}) => {
  const base = `/img/projects/opt/${id}`;
  return `<picture><source type="image/webp" srcset="${base}-480.webp 480w, ${base}-800.webp 800w, ${base}-1200.webp 1200w" sizes="(min-width: 62rem) 62rem, 100vw"><img src="${base}-1200.jpg" alt="${esc(alt)}" width="1200" height="750" ${priority ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}></picture>`;
};

const otherProjects = (current) =>
  `<ul class="plain">${projects
    .filter((p) => p.slug !== current)
    .map(
      (p) =>
        `<li><a href="${p.path}">${esc(p.label)}, ${esc(p.value.toLowerCase())}</a></li>`
    )
    .join("")}</ul>`;

// ── Pages projet ──
const projectPage = (p) => {
  const body = `
<p class="crumb"><a href="/">Accueil</a> › <a href="/projets/">Projets</a> › ${esc(p.label)}</p>
<main>
<h1>${esc(p.label)} : ${esc(p.value.charAt(0).toLowerCase() + p.value.slice(1))}</h1>
<p class="lead">${esc(p.summary)}</p>
${p.imageId ? picture(p.imageId, p.imageAlt, { priority: true }) : ""}
<h2>À propos du projet</h2>
${p.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("\n")}
${
  p.technologies.length
    ? `<h2>Technologies</h2><ul class="tags">${p.technologies.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`
    : ""
}
<h2>Voir le projet en ligne</h2>
<p><a class="btn" href="${p.link}">${esc(p.anchor)}</a>${p.github
    .map(
      (g, i) =>
        `<a href="${g}">Code source de ${esc(p.label)} sur GitHub${p.github.length > 1 ? ` (${i === 0 ? "front" : "back"})` : ""}</a>`
    )
    .join(" · ")}</p>
${
  p.improvements.length
    ? `<h2>Pistes d'amélioration</h2><ul class="plain">${p.improvements.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`
    : ""
}
<h2>Mes autres projets</h2>
${otherProjects(p.slug)}
<p><a href="/">Retour au portfolio de Théo Créac'h</a></p>
</main>`;

  const ld = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${abs(p.path)}#app`,
    name: p.label,
    description: p.description,
    url: p.link,
    mainEntityOfPage: abs(p.path),
    applicationCategory: p.category,
    operatingSystem: "Web",
    inLanguage: "fr",
    author: personRef,
    ...(p.github[0] ? { codeRepository: p.github[0] } : {}),
    ...(p.imageId ? { image: abs(`/img/projects/opt/${p.imageId}-1200.jpg`) } : {}),
    ...(p.slug === "makemelearn" ? { offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" } } : {}),
  };
  return page({
    title: p.title,
    description: p.description,
    path: p.path,
    body,
    jsonld: [ld, breadcrumb([["Accueil", "/"], ["Projets", "/projets/"], [p.label, p.path]])],
  });
};

// ── Hub /projets/ ──
const HUB = {
  path: "/projets/",
  title: "Projets web de Théo Créac'h : React, Node.js et TypeScript",
  description:
    "Tous les projets web de Théo Créac'h, développeur full-stack : boutique e-commerce, billetterie, jeux, recherche d'emploi et éditeur de dessin, tous en ligne.",
};

const hubPage = () => {
  const body = `
<p class="crumb"><a href="/">Accueil</a> › Projets</p>
<main>
<h1>Mes projets web</h1>
<p class="lead">Chaque projet est né d'un besoin ou d'une envie, et tous sont en ligne. Voici ce que chacun fait, pourquoi je l'ai construit et où l'essayer.</p>
${projects
  .map(
    (p) => `<section class="card">
<h2><a href="${p.path}">${esc(p.label)}</a></h2>
<p><strong>${esc(p.value)}</strong></p>
<p>${esc(p.summary)}</p>
<p><a href="${p.path}">Lire la présentation de ${esc(p.label)}</a> · <a href="${p.link}">${esc(p.anchor)}</a></p>
</section>`
  )
  .join("\n")}
</main>`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projets web de Théo Créac'h",
    url: abs(HUB.path),
    inLanguage: "fr",
    author: personRef,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: abs(p.path),
        name: p.label,
      })),
    },
  };
  return page({
    ...HUB,
    body,
    jsonld: [ld, breadcrumb([["Accueil", "/"], ["Projets", HUB.path]])],
  });
};

// ── 404 ──
const notFoundPage = () =>
  page({
    title: "Page introuvable | Théo Créac'h",
    description: "Cette page n'existe pas. Retrouvez le portfolio et les projets de Théo Créac'h.",
    path: "/404.html",
    noindex: true,
    body: `<main><h1>Page introuvable</h1>
<p class="lead">Cette adresse ne mène nulle part.</p>
<p><a class="btn" href="/">Retour au portfolio de Théo Créac'h</a><a href="/projets/">Voir mes projets web</a></p></main>`,
  });

// ── Contenu prérendu de l'accueil (dans #root) ──
const homeStatic = () => {
  const story = journey.story.fr;
  const skillsHtml = skills
    .map(
      (c) =>
        `<li><strong>${esc(c.category)}</strong> : ${c.skills.map((s) => esc(s.name)).join(", ")}</li>`
    )
    .join("");
  const steps = journey.journey
    .map((s) => `<li><strong>${esc(s.fr.title)}</strong>${s.fr.org ? ` (${esc(s.fr.org)})` : ""}, ${esc(s.period.fr)}</li>`)
    .join("");
  return `<div class="seo-static"><div class="wrap">
<header><h1>Théo Créac'h, ${esc(SITE.jobTitle.toLowerCase())}</h1>
<p class="lead">${esc(story.bio)}</p>
<p><a class="btn" href="/projets/">Voir mes projets web</a><a href="mailto:creach.t@gmail.com">Me contacter par e-mail</a></p></header>
<main>
<section><h2>À propos</h2>${story.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("")}</section>
<section><h2>Projets</h2>
${projects
  .map(
    (p) => `<article class="card"><h3><a href="${p.path}">${esc(p.label)}</a>, ${esc(p.value.toLowerCase())}</h3>
<p>${esc(p.summary)}</p>
<p><a href="${p.link}">${esc(p.anchor)}</a> · <a href="${p.path}">Lire la présentation de ${esc(p.label)}</a></p></article>`
  )
  .join("")}
</section>
<section><h2>Parcours</h2><ul class="plain">${steps}</ul></section>
<section><h2>Compétences</h2><ul class="plain">${skillsHtml}</ul></section>
<section><h2>Contact</h2><p>Je cherche un CDI en développement web (présentiel près de ${esc(SITE.locality)}, hybride en Île-de-France ou remote). <a href="mailto:creach.t@gmail.com">creach.t@gmail.com</a> · <a href="${SITE.sameAs[0]}">Théo Créac'h sur LinkedIn</a> · <a href="${SITE.sameAs[1]}">Théo Créac'h sur GitHub</a></p></section>
</main></div></div>`;
};

const homeProjectsLd = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Projets de Théo Créac'h",
  itemListElement: projects.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: abs(p.path),
    name: p.label,
  })),
});

// ── Exécution ──
const write = async (rel, content) => {
  const file = join(BUILD, rel);
  await mkdir(join(file, ".."), { recursive: true });
  await writeFile(file, content, "utf8");
};

// 1. Accueil
let html = await readFile(join(BUILD, "index.html"), "utf8");
const MARKER = '<div id="root"></div>';
if (!html.includes(MARKER)) {
  throw new Error(`Marqueur ${MARKER} introuvable dans build/index.html`);
}
html = html.replace(MARKER, `<div id="root">${homeStatic()}</div>`);
html = html.replace("</head>", `<style>${HOME_CSS}</style>${ldTag(homeProjectsLd())}</head>`);
await writeFile(join(BUILD, "index.html"), html, "utf8");

// 2. Pages statiques
await write("projets/index.html", hubPage());
for (const p of projects) await write(`projets/${p.slug}/index.html`, projectPage(p));
await write("404.html", notFoundPage());

// 3. Sitemap
const homeMod = lastmod(["public/data", "public/index.html"]);
const projMod = lastmod(["public/data/projects.json", "scripts/seo"]);
const urls = [
  ["/", homeMod],
  [HUB.path, projMod],
  ...projects.map((p) => [p.path, projMod]),
];
await write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([path, mod]) => `  <url>\n    <loc>${abs(path)}</loc>\n    <lastmod>${mod}</lastmod>\n  </url>`).join("\n")}
</urlset>
`
);

// 4. Contrôles de longueur (title 50-60, description 140-160) : avertissements
const check = (label, title, description) => {
  if (title.length < 50 || title.length > 60)
    warnings.push(`title ${title.length} car. (${label}) : ${title}`);
  if (description.length < 140 || description.length > 160)
    warnings.push(`description ${description.length} car. (${label})`);
};
check(HUB.path, HUB.title, HUB.description);
projects.forEach((p) => check(p.path, p.title, p.description));

// 5. Garde-fou : aucun fichier de dev dans le build de prod
const DEV_MARKERS = ["/@vite/client", "@react-refresh", "webpack-dev-server", "react-refresh/runtime"];
const scan = async (dir) => {
  const bad = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) bad.push(...(await scan(p)));
    else if (/\.(html|js)$/.test(e.name)) {
      const txt = await readFile(p, "utf8");
      for (const m of DEV_MARKERS) if (txt.includes(m)) bad.push(`${p} → ${m}`);
    }
  }
  return bad;
};
const devFiles = await scan(BUILD);
if (devFiles.length) {
  console.error("Fichiers de dev détectés dans le build :\n" + devFiles.join("\n"));
  process.exit(1);
}

console.log(`SEO : ${urls.length} URL dans sitemap.xml, ${projects.length} pages projet, 404.html`);
warnings.forEach((w) => console.warn(`⚠ ${w}`));
