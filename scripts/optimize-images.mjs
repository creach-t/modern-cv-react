// Génère des variantes responsives (WebP + JPG optimisé) des captures projet.
// Les variantes sont COMMITÉES → le build (CI) n'a pas besoin de sharp.
// Régénération ponctuelle (dev) : `npm i -D sharp && npm run optimize:img`.
// Idempotent : réécrit dans public/img/projects/opt/.
import { readdir, mkdir } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

const SRC = "public/img/projects";
const OUT = join(SRC, "opt");
const WIDTHS = [480, 800, 1200];

const run = async () => {
  await mkdir(OUT, { recursive: true });
  const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  for (const file of files) {
    const { name } = parse(file);
    const input = join(SRC, file);
    for (const w of WIDTHS) {
      await sharp(input)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 72 })
        .toFile(join(OUT, `${name}-${w}.webp`));
    }
    // Fallback JPG optimisé (progressif, mozjpeg) au plus grand format.
    await sharp(input)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 78, progressive: true, mozjpeg: true })
      .toFile(join(OUT, `${name}-1200.jpg`));
    console.log(`✓ ${name}`);
  }
  console.log(`\nDone → ${OUT}`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
