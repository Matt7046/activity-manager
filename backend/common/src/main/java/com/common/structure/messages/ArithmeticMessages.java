package com.common.structure.messages;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Messaggi per errori aritmetici sui punti in formato {@code ?lang?chiave?lang?}.
 */
@Component
public class ArithmeticMessages {

    private final String negativePoints;

    public ArithmeticMessages(
            @Value("${message.exceptions.arithmetic.negative-points}") String negativePoints) {
        this.negativePoints = negativePoints;
    }

    public String negativePoints() {
        return negativePoints;
    }
}
