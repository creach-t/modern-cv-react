#!/usr/bin/env node
/**
 * Capture automatiquement une screenshot de chaque projet depuis son URL live
 * et l'enregistre dans public/img/projects/<id>.jpg (utilisé par le site).
 *
 * Usage :
 *   npm i -D puppeteer   (une fois)
 *   npm run shots
 *
 * Les captures restent ainsi toujours à jour avec les sites déployés.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "public", "data", "projects.json");
const OUT_DIR = path.join(ROOT, "public", "img", "projects");

const VIEWPORT = { width: 1280, height: 800, deviceScaleFactor: 2 };
const TIMEOUT = 45000;

let puppeteer;
try {
  puppeteer = (await import("puppeteer")).default;
} catch {
  console.error(
    "\n✖ puppeteer n'est pas installé.\n  Lance :  npm i -D puppeteer\n"
  );
  process.exit(1);
}

const { projects } = JSON.parse(fs.readFileSync(DATA, "utf8"));
fs.mkdirSync(OUT_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const run = async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  let ok = 0;
  for (const project of projects) {
    const url = project.link;
    const out = path.join(OUT_DIR, `${project.id}.jpg`);
    if (!url) continue;
    const page = await browser.newPage();
    try {
      await page.setViewport(VIEWPORT);
      await page.goto(url, { waitUntil: "networkidle2", timeout: TIMEOUT });
      await sleep(1800); // laisser les animations/fonts se poser
      await page.screenshot({ path: out, type: "jpeg", quality: 82 });
      console.log(`✔ ${project.id}  →  ${url}`);
      ok++;
    } catch (err) {
      console.warn(`✖ ${project.id}  (${url}) : ${err.message} — capture conservée`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`\n${ok}/${projects.length} captures mises à jour.`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
