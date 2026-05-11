/**
 * Genera icone PWA e favicon da public/logo-colorsdev-v2.png.
 * Solo ridimensionamento (fit: contain, sfondo trasparente): niente compositing
 * su piastre colorate, niente ritagli “creativi” sul logo.
 *
 * Uso: node scripts/generate-pwa-assets.mjs  (anche come prebuild in package.json)
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const pwaDir = path.join(publicDir, "pwa");
const logoPath = path.join(publicDir, "logo-colorsdev-v2.png");

const ensureLogo = async () => {
  try {
    await fs.access(logoPath);
  } catch {
    console.warn("[pwa] logo-colorsdev-v2.png non trovato in public/, salto generazione asset.");
    process.exit(0);
  }
};

/** Canvas quadrato: logo inserito così com’è (solo scala), letterbox trasparente. */
const resizeContainedSquare = (size) =>
  sharp(logoPath)
    .ensureAlpha()
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png();

/** Screenshot: canvas fisso, logo centrato al massimo ingrandibile senza tagli (inside). */
const screenshot = async (fileName, canvasW, canvasH) => {
  const logoBuf = await sharp(logoPath)
    .ensureAlpha()
    .resize(canvasW, canvasH, {
      fit: "inside",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: logoBuf, gravity: "center" }])
    .png()
    .toFile(path.join(pwaDir, fileName));
};

const main = async () => {
  await ensureLogo();
  await fs.mkdir(pwaDir, { recursive: true });

  await resizeContainedSquare(192).toFile(path.join(pwaDir, "icon-192.png"));
  await resizeContainedSquare(512).toFile(path.join(pwaDir, "icon-512.png"));
  await resizeContainedSquare(192).toFile(path.join(pwaDir, "icon-maskable-192.png"));
  await resizeContainedSquare(512).toFile(path.join(pwaDir, "icon-maskable-512.png"));

  await resizeContainedSquare(128).toFile(path.join(publicDir, "favicon.png"));
  await resizeContainedSquare(180).toFile(path.join(publicDir, "apple-touch-icon.png"));

  await screenshot("screenshot-wide.png", 1280, 720);
  await screenshot("screenshot-narrow.png", 390, 844);

  console.log("[pwa] Asset generati da logo-colorsdev-v2.png (solo resize/contain).");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
