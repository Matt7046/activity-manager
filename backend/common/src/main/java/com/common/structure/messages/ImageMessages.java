package com.common.structure.messages;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Messaggi upload immagine in formato {@code ?lang?chiave?lang?} per traduzione lato client.
 */
@Component
public class ImageMessages {

    private final String uploadSlotRequired;
    private final String uploadSlotInvalid;
    private final String uploadEmailMissing;

    public ImageMessages(
            @Value("${message.exceptions.image.upload-slot-required}") String uploadSlotRequired,
            @Value("${message.exceptions.image.upload-slot-invalid}") String uploadSlotInvalid,
            @Value("${message.exceptions.image.upload-email-missing}") String uploadEmailMissing) {
        this.uploadSlotRequired = uploadSlotRequired;
        this.uploadSlotInvalid = uploadSlotInvalid;
        this.uploadEmailMissing = uploadEmailMissing;
    }

    public String uploadSlotRequired() {
        return uploadSlotRequired;
    }

    public String uploadSlotInvalid() {
        return uploadSlotInvalid;
    }

    public String uploadEmailMissing() {
        return uploadEmailMissing;
    }
}
