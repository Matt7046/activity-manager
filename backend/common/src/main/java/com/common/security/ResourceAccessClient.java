package com.common.security;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.common.dto.access.CanAccessRequest;
import com.common.dto.access.FamilyTransferCheckRequest;
import com.common.dto.access.SelfCheckRequest;
import com.common.structure.exception.ForbiddenException;
import com.common.structure.messages.ForbiddenMessages;

import reactor.core.publisher.Mono;

/**
 * Delega le verifiche al servizio user-point tramite endpoint interni autenticati con JWT.
 */
@Service
public class ResourceAccessClient {

    private final WebClient webClientPoint;
    private final ForbiddenMessages forbiddenMessages;

    public ResourceAccessClient(@Qualifier("webClientPoint") WebClient webClientPoint,
            ForbiddenMessages forbiddenMessages) {
        this.webClientPoint = webClientPoint;
        this.forbiddenMessages = forbiddenMessages;
    }

    public Mono<Void> assertCanAccess(String resourceEmail) {
        return webClientPoint.post()
                .uri("/api/userpoint/internal/can-access")
                .bodyValue(new CanAccessRequest(resourceEmail))
                .retrieve()
                .onStatus(status -> status.value() == 403,
                        response -> Mono.error(new ForbiddenException(forbiddenMessages.accessDeniedResource())))
                .toBodilessEntity()
                .then();
    }

    public Mono<Void> assertSelf(String email) {
        return webClientPoint.post()
                .uri("/api/userpoint/internal/self")
                .bodyValue(new SelfCheckRequest(email))
                .retrieve()
                .onStatus(status -> status.value() == 403,
                        response -> Mono.error(new ForbiddenException(forbiddenMessages.operationNotSelf())))
                .toBodilessEntity()
                .then();
    }

    public Mono<Void> assertFamilyTransfer(String emailUserCurrent, String targetEmail) {
        return webClientPoint.post()
                .uri("/api/userpoint/internal/family-transfer")
                .bodyValue(new FamilyTransferCheckRequest(emailUserCurrent, targetEmail))
                .retrieve()
                .onStatus(status -> status.value() == 403,
                        response -> Mono.error(new ForbiddenException(forbiddenMessages.familyOperationDenied())))
                .toBodilessEntity()
                .then();
    }
}
