package com.common.security;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.common.dto.access.CanAccessRequest;
import com.common.dto.access.FamilyTransferCheckRequest;
import com.common.dto.access.SelfCheckRequest;
import com.common.structure.exception.ForbiddenException;

import reactor.core.publisher.Mono;

/**
 * Delega le verifiche al servizio user-point tramite endpoint interni autenticati con JWT.
 */
@Service
public class ResourceAccessClient {

    private final WebClient webClientPoint;

    public ResourceAccessClient(@Qualifier("webClientPoint") WebClient webClientPoint) {
        this.webClientPoint = webClientPoint;
    }

    public Mono<Void> assertCanAccess(String resourceEmail) {
        return webClientPoint.post()
                .uri("/api/userpoint/internal/can-access")
                .bodyValue(new CanAccessRequest(resourceEmail))
                .retrieve()
                .onStatus(status -> status.value() == 403,
                        response -> Mono.error(new ForbiddenException("Accesso negato per questa risorsa.")))
                .toBodilessEntity()
                .then();
    }

    public Mono<Void> assertSelf(String email) {
        return webClientPoint.post()
                .uri("/api/userpoint/internal/self")
                .bodyValue(new SelfCheckRequest(email))
                .retrieve()
                .onStatus(status -> status.value() == 403,
                        response -> Mono.error(new ForbiddenException("Operazione non consentita per altri utenti.")))
                .toBodilessEntity()
                .then();
    }

    public Mono<Void> assertFamilyTransfer(String emailUserCurrent, String targetEmail) {
        return webClientPoint.post()
                .uri("/api/userpoint/internal/family-transfer")
                .bodyValue(new FamilyTransferCheckRequest(emailUserCurrent, targetEmail))
                .retrieve()
                .onStatus(status -> status.value() == 403,
                        response -> Mono.error(new ForbiddenException("Operazione famiglia non consentita.")))
                .toBodilessEntity()
                .then();
    }
}
