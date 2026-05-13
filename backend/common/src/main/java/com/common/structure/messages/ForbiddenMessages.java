package com.common.structure.messages;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Messaggi 403 in formato {@code ?lang?chiave?lang?} per traduzione lato client.
 */
@Component
public class ForbiddenMessages {

    private final String resourceMissing;
    private final String accessDeniedResource;
    private final String identityMissing;
    private final String operationNotSelf;
    private final String familyOperationDenied;
    private final String authenticationRequired;
    private final String notificationNoReceiver;
    private final String emailInvalidPayload;
    private final String cannotAddChildIsParent;

    public ForbiddenMessages(
            @Value("${message.exceptions.forbidden.resource-missing}") String resourceMissing,
            @Value("${message.exceptions.forbidden.access-denied-resource}") String accessDeniedResource,
            @Value("${message.exceptions.forbidden.identity-missing}") String identityMissing,
            @Value("${message.exceptions.forbidden.operation-not-self}") String operationNotSelf,
            @Value("${message.exceptions.forbidden.family-operation-denied}") String familyOperationDenied,
            @Value("${message.exceptions.forbidden.authentication-required}") String authenticationRequired,
            @Value("${message.exceptions.forbidden.notification-no-receiver}") String notificationNoReceiver,
            @Value("${message.exceptions.forbidden.email-invalid-payload}") String emailInvalidPayload,
            @Value("${message.exceptions.forbidden.cannot-add-child-is-parent}") String cannotAddChildIsParent) {
        this.resourceMissing = resourceMissing;
        this.accessDeniedResource = accessDeniedResource;
        this.identityMissing = identityMissing;
        this.operationNotSelf = operationNotSelf;
        this.familyOperationDenied = familyOperationDenied;
        this.authenticationRequired = authenticationRequired;
        this.notificationNoReceiver = notificationNoReceiver;
        this.emailInvalidPayload = emailInvalidPayload;
        this.cannotAddChildIsParent = cannotAddChildIsParent;
    }

    public String resourceMissing() {
        return resourceMissing;
    }

    public String accessDeniedResource() {
        return accessDeniedResource;
    }

    public String identityMissing() {
        return identityMissing;
    }

    public String operationNotSelf() {
        return operationNotSelf;
    }

    public String familyOperationDenied() {
        return familyOperationDenied;
    }

    public String authenticationRequired() {
        return authenticationRequired;
    }

    public String notificationNoReceiver() {
        return notificationNoReceiver;
    }

    public String emailInvalidPayload() {
        return emailInvalidPayload;
    }

    public String cannotAddChildIsParent() {
        return cannotAddChildIsParent;
    }
}
