package com.common.structure.messages;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Messaggi per errori di cifratura/decifratura in formato {@code ?lang?chiave?lang?}.
 */
@Component
public class DecryptMessages {

    private final String operationFailed;

    public DecryptMessages(
            @Value("${message.exceptions.decrypt.operation-failed}") String operationFailed) {
        this.operationFailed = operationFailed;
    }

    public String operationFailed() {
        return operationFailed;
    }
}
