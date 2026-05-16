package com.common.user;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.security.EmailNormalization;
import com.common.structure.exception.BadRequestException;
import com.common.structure.messages.ImageMessages;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Tre slot immagine per utente bambino (card 0, 1, 2). Ogni slot ha un public_id Cloudinary fisso
 * così un nuovo upload sovrascrive lo stesso file invece di crearne uno nuovo.
 */
@Component
public class UserPointImageSlots {

    public static final List<String> SLOT_IDS = List.of("0", "1", "2");

    private static final Pattern IMAGE_VERSION_PATH =
            Pattern.compile("/image/v(\\d+)/(.+)$");

    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;

    @Autowired
    private ImageMessages imageMessages;

    @Value("${cloudinary.cloud_name}")
    private String cloudName;

    public boolean isAllowedSlot(String slotId) {
        return slotId != null && SLOT_IDS.contains(sanitizeSlotId(slotId));
    }

    public String sanitizeSlotId(String raw) {
        if (raw == null || raw.isBlank()) {
            return "";
        }
        return raw.trim().replace("$", "_").replace(".", "_");
    }

    public String buildPublicId(String emailPlain, String slotId) {
        String slot = sanitizeSlotId(slotId);
        if (!isAllowedSlot(slot)) {
            throw new BadRequestException(imageMessages.uploadSlotInvalid());
        }
        String email = EmailNormalization.normalize(emailPlain);
        if (email == null || email.isEmpty()) {
            throw new BadRequestException(imageMessages.uploadEmailMissing());
        }
        String safeEmail = email.replace('@', '_').replaceAll("[^a-z0-9._-]", "_");
        return "userpoint/" + safeEmail + "/" + slot;
    }

    /**
     * Risolve il public_id da inviare a Cloudinary.
     * Con email + slot usa sempre {@link #buildPublicId} (evita path legacy senza slot).
     */
    public String resolvePublicId(String nameImage, String emailPlain, String slotId) {
        if (emailPlain != null && !emailPlain.isBlank() && slotId != null && !slotId.isBlank()) {
            return buildPublicId(emailPlain, slotId);
        }
        if (nameImage != null && !nameImage.isBlank()) {
            String path = encryptDecryptConverter.safeDecrypt(nameImage.trim());
            return sanitizePublicId(path);
        }
        return null;
    }

    /**
     * Path relativo da persistere e mostrare: {@code v{version}/userpoint/.../slot.ext}
     * (senza dominio né segmento {@code upload}).
     */
    public String normalizeStoragePath(String urlOrPath) {
        if (urlOrPath == null || urlOrPath.isBlank()) {
            return "";
        }
        String p = urlOrPath.trim();
        if (p.startsWith("http://") || p.startsWith("https://")) {
            p = pathFromDeliveryUrl(p);
        } else if (p.startsWith("/")) {
            p = p.substring(1);
        }
        if (p.contains("upload/")) {
            p = p.substring(p.lastIndexOf("upload/") + "upload/".length());
        }
        int imageV = p.indexOf("/image/v");
        if (imageV >= 0) {
            p = p.substring(imageV + "/image/".length());
        }
        int q = p.indexOf('?');
        if (q >= 0) {
            p = p.substring(0, q);
        }
        return p.replaceAll("/+", "/").replaceAll("^/+", "");
    }

    /** URL delivery con {@code /image/upload/} (Cloudinary SDK può omettere {@code upload}). */
    public String ensureUploadDeliveryUrl(String url) {
        if (url == null || url.isBlank()) {
            return url;
        }
        if (url.contains("/image/upload/")) {
            return url;
        }
        return url.replace("/image/v", "/image/upload/v");
    }

    public String buildUploadDeliveryUrl(String storagePath) {
        if (storagePath == null || storagePath.isBlank()) {
            return "";
        }
        String path = normalizeStoragePath(storagePath);
        return "https://res.cloudinary.com/" + cloudName + "/image/upload/" + path;
    }

    public String storagePathFromUploadResult(Map<?, ?> uploadResult) {
        Object version = uploadResult.get("version");
        String publicId = String.valueOf(uploadResult.get("public_id"));
        String format = String.valueOf(uploadResult.get("format"));
        if (version == null || publicId == null || format == null || "null".equals(publicId)) {
            return normalizeStoragePath(ensureUploadDeliveryUrl(String.valueOf(uploadResult.get("secure_url"))));
        }
        return "v" + version + "/" + publicId + "." + format;
    }

    /** public_id Cloudinary (senza versione) per overwrite sullo stesso slot. */
    public String sanitizePublicId(String path) {
        String p = normalizeStoragePath(path);
        if (p.isEmpty()) {
            return "";
        }
        if (p.startsWith("v") && p.length() > 1 && Character.isDigit(p.charAt(1))) {
            int slash = p.indexOf('/');
            if (slash > 0) {
                p = p.substring(slash + 1);
            }
        }
        p = stripImageExtensionFromLastSegment(p);
        return p.replaceAll("/+", "/").replaceAll("^/+", "");
    }

    /** Rimuove solo estensioni immagine sull'ultimo segmento (non {@code .com} nell'email). */
    private static String stripImageExtensionFromLastSegment(String path) {
        int lastSlash = path.lastIndexOf('/');
        String lastSegment = lastSlash >= 0 ? path.substring(lastSlash + 1) : path;
        int dot = lastSegment.lastIndexOf('.');
        if (dot <= 0 || dot >= lastSegment.length() - 1) {
            return path;
        }
        String ext = lastSegment.substring(dot + 1).toLowerCase();
        if (!isImageFileExtension(ext)) {
            return path;
        }
        String withoutExt = lastSegment.substring(0, dot);
        return lastSlash >= 0 ? path.substring(0, lastSlash + 1) + withoutExt : withoutExt;
    }

    private static boolean isImageFileExtension(String ext) {
        return switch (ext) {
            case "jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "avif", "heic" -> true;
            default -> false;
        };
    }

    /** Mantiene al massimo i 3 slot canonici (0, 1, 2). */
    public Map<String, String> trimToAllowedSlots(Map<String, String> source) {
        LinkedHashMap<String, String> out = new LinkedHashMap<>();
        if (source == null) {
            return out;
        }
        for (String id : SLOT_IDS) {
            String path = source.get(id);
            if (path != null && !path.isBlank()) {
                out.put(id, path);
            }
        }
        return out;
    }

    private String pathFromDeliveryUrl(String url) {
        int upload = url.lastIndexOf("upload/");
        if (upload >= 0) {
            String rest = url.substring(upload + "upload/".length());
            int q = rest.indexOf('?');
            return q >= 0 ? rest.substring(0, q) : rest;
        }
        Matcher m = IMAGE_VERSION_PATH.matcher(url);
        if (m.find()) {
            return "v" + m.group(1) + "/" + m.group(2);
        }
        return url;
    }
}
