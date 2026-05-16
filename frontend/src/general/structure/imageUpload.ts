/** Riduce foto da telefono prima dell'upload (spesso 5–15 MB vs pochi KB da PC). */
const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.85;
const SKIP_RESIZE_BELOW_BYTES = 600_000;

export async function prepareImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < SKIP_RESIZE_BELOW_BYTES) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height, 1));
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const baseName = (file.name.replace(/\.[^.]+$/, "") || "image").slice(0, 80);
          resolve(
            new File([blob], `${baseName}.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
          );
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export function imageExtensionFromFile(file: File): string {
  const dot = file.name.lastIndexOf(".");
  if (dot > 0 && dot < file.name.length - 1) {
    const ext = file.name.substring(dot).toLowerCase();
    if (ext.length <= 5) return ext;
  }
  switch (file.type) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/heic":
    case "image/heif":
      return ".heic";
    default:
      return ".jpg";
  }
}
