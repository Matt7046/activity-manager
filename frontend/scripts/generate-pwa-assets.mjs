/**
 * Genera icone PWA (192/512) e screenshot placeholder da public/logo-colorsdev.png.
 * Esegui prima del build: `node scripts/generate-pwa-assets.mjs`
 * (collegato come `prebuild` in package.json).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const pwaDir = path.join(publicDir, "pwa");
const logoPath = path.join(publicDir, "logo-colorsdev.png");

/** Allineato a manifest theme_color / background (no grigio sistema su adaptive icon) */
const PWA_ICON_BG = { r: 11, g: 18, b: 32, alpha: 1 };

async function ensureLogo() {
  try {
    await fs.access(logoPath);
  } catch {
    console.warn("[pwa] logo-colorsdev.png non trovato, salto generazione asset PWA.");
    process.exit(0);
  }
}

async function screenshotWithLogo(width, height, outName) {
  const logoBuf = await sharp(logoPath)
    .resize(Math.round(Math.min(width, height) * 0.22), null, { fit: "inside" })
    .toBuffer();

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 11, g: 18, b: 32, alpha: 1 },
    },
  })
    .composite([{ input: logoBuf, gravity: "center" }])
    .png()
    .toFile(path.join(pwaDir, outName));
}

async function maskableIcon(size) {
  const inner = Math.round(size * 0.62);
  const logoBuf = await sharp(logoPath)
    .ensureAlpha()
    .resize(inner, inner, { fit: "inside" })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: PWA_ICON_BG,
    },
  })
    .composite([{ input: logoBuf, gravity: "center" }])
    .png()
    .toFile(path.join(pwaDir, `icon-maskable-${size}.png`));
}

/** Favicon / Apple: sfondo opaco; `fillRatio` più alto = logo più grande nel quadrato */
async function opaqueBrandIcon(size, outPath, fillRatio = 0.62) {
  const inner = Math.round(size * fillRatio);
  const logoBuf = await sharp(logoPath)
    .ensureAlpha()
    .resize(inner, inner, { fit: "inside" })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: PWA_ICON_BG,
    },
  })
    .composite([{ input: logoBuf, gravity: "center" }])
    .png()
    .toFile(outPath);
}

async function main() {
  await ensureLogo();
  await fs.mkdir(pwaDir, { recursive: true });

  await sharp(logoPath).ensureAlpha().resize(192, 192).png().toFile(path.join(pwaDir, "icon-192.png"));
  await sharp(logoPath).ensureAlpha().resize(512, 512).png().toFile(path.join(pwaDir, "icon-512.png"));

  await maskableIcon(192);
  await maskableIcon(512);

  await screenshotWithLogo(1280, 720, "screenshot-wide.png");
  await screenshotWithLogo(390, 844, "screenshot-narrow.png");

  /* Favicon più grande nel disegno (fill ~90%) e canvas 128px per nitidezza su display HiDPI */
  await opaqueBrandIcon(128, path.join(publicDir, "favicon.png"), 0.9);
  await opaqueBrandIcon(180, path.join(publicDir, "apple-touch-icon.png"), 0.84);

  console.log("[pwa] Asset generati in public/pwa/, public/favicon.png, public/apple-touch-icon.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
