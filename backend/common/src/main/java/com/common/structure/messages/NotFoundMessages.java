package com.common.structure.messages;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Messaggi 404 in formato {@code ?lang?chiave?lang?} per traduzione lato client.
 */
@Component
public class NotFoundMessages {

    private final String userByEmail;
    private final String activityById;
    private final String parentUpdate;
    private final String persistLogFamily;
    private final String payloadEmailUserCurrent;

    public NotFoundMessages(
            @Value("${message.exceptions.not-found.user-by-email}") String userByEmail,
            @Value("${message.exceptions.not-found.activity-by-id}") String activityById,
            @Value("${message.exceptions.not-found.parent-update}") String parentUpdate,
            @Value("${message.exceptions.not-found.persist-log-family}") String persistLogFamily,
            @Value("${message.exceptions.not-found.payload-email-user-current}") String payloadEmailUserCurrent) {
        this.userByEmail = userByEmail;
        this.activityById = activityById;
        this.parentUpdate = parentUpdate;
        this.persistLogFamily = persistLogFamily;
        this.payloadEmailUserCurrent = payloadEmailUserCurrent;
    }

    public String userByEmail() {
        return userByEmail;
    }

    public String activityById() {
        return activityById;
    }

    public String parentUpdate() {
        return parentUpdate;
    }

    public String persistLogFamily() {
        return persistLogFamily;
    }

    public String payloadEmailUserCurrent() {
        return payloadEmailUserCurrent;
    }
}
