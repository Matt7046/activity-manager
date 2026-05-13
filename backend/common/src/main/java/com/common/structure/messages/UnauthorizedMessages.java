package com.common.structure.messages;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Messaggi 401 in formato {@code ?lang?chiave?lang?} per traduzione lato client.
 */
@Component
public class UnauthorizedMessages {

    private final String invalidCredentials;

    public UnauthorizedMessages(
            @Value("${message.exceptions.unauthorized.invalid-credentials}") String invalidCredentials) {
        this.invalidCredentials = invalidCredentials;
    }

    public String invalidCredentials() {
        return invalidCredentials;
    }
}
