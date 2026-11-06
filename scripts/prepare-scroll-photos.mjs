import { mkdir, stat } from "node:fs/promises";
import sharp from "sharp";
const destination = new URL("../public/images/scroll-lab/", import.meta.url);
await mkdir(destination, { recursive: true });
for (const name of ["atelier-material", "consultation-vinyl", "workflow-install", "gallery-ferrari-magenta", "gallery-raptor-black", "gallery-ktm-black", "gallery-yamaha-r1-blue"]) {
  const source = new URL(`../public/images/${name}.png`, import.meta.url);
  const target = new URL(`${name}.webp`, destination);
  await sharp(await import("node:fs/promises").then(fs => fs.readFile(source))).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 88, effort: 5 }).toFile(target.pathname.replace(/^\/([A-Za-z]:)/, "$1"));
  console.log(`${name}: ${(await stat(target)).size} bytes`);
}
