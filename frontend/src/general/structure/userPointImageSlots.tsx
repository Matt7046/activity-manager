"use client";

import { i18n } from "@lingui/core";
import { IMAGE } from "./Constant";

/** Tre slot immagine per bambino (card punti / log attività / log famiglia). */
export const USER_POINT_IMAGE_SLOT_IDS = ["0", "1", "2"] as const;

export type UserPointImageSlotId = (typeof USER_POINT_IMAGE_SLOT_IDS)[number];

export const sanitizeUserPointSlotId = (raw: string): string => {
  return raw.trim().replace(/\$/g, "_").replace(/\./g, "_");
};

/** public_id Cloudinary stabile: stesso slot = overwrite, non nuovo file. */
export const userPointImagePublicId = (email: string, slotId: string): string => {
  const slot = sanitizeUserPointSlotId(slotId);
  if (!USER_POINT_IMAGE_SLOT_IDS.includes(slot as UserPointImageSlotId)) {
    throw new Error(i18n._("image_upload_slot_invalid"));
  }
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    throw new Error(i18n._("image_upload_email_missing"));
  }
  const safeEmail = normalized.replace("@", "_").replace(/[^a-z0-9._-]/gi, "_");
  return `userpoint/${safeEmail}/${slot}`;
};

const stripQuery = (path: string): string => path.split("?")[0] ?? path;

/** Estrae il path da persistere: v{version}/userpoint/.../slot.ext */
export const cloudinaryPathFromUploadUrl = (secureUrl: string): string => {
  const trimmed = secureUrl.trim();
  if (!trimmed) {
    return "";
  }
  const uploadIdx = trimmed.lastIndexOf("upload/");
  if (uploadIdx >= 0) {
    return stripQuery(trimmed.substring(uploadIdx + "upload/".length));
  }
  const versionMatch = trimmed.match(/\/image\/v(\d+)\/(.+)$/);
  if (versionMatch) {
    return stripQuery(`v${versionMatch[1]}/${versionMatch[2]}`);
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return stripQuery(trimmed);
  }
  return stripQuery(trimmed.replace(/^\/+/, ""));
};

/** Forza /image/upload/ nell'URL delivery Cloudinary. */
export const ensureCloudinaryUploadUrl = (url: string): string => {
  if (!url || url.includes("/image/upload/")) {
    return url;
  }
  return url.replace("/image/v", "/image/upload/v");
};

/** Base CDN sempre con segmento {@code /image/upload/}. */
export const cloudinaryUploadBase = (): string => {
  const raw = (IMAGE.SERVER ?? "").trim();
  if (!raw) {
    return "https://res.cloudinary.com/dzxtjigpc/image/upload/";
  }
  if (raw.includes("/image/upload")) {
    return raw.endsWith("/") ? raw : `${raw}/`;
  }
  if (/\/image\/?$/i.test(raw)) {
    return raw.replace(/\/image\/?$/i, "/image/upload/");
  }
  return raw.endsWith("/") ? raw : `${raw}/`;
};

/**
 * URL completo per Card: accetta path relativo (v…/userpoint/…/slot.ext)
 * o URL assoluto già su Cloudinary.
 */
export const cloudinaryImageDeliveryUrl = (stored: string): string => {
  const trimmed = stored?.trim() ?? "";
  if (!trimmed) {
    return "";
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return ensureCloudinaryUploadUrl(trimmed);
  }
  const path = trimmed.replace(/^\/+/, "");
  return `${cloudinaryUploadBase()}${path}`;
};
