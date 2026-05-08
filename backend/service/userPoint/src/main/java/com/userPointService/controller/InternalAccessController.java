package com.userPointService.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.common.dto.access.CanAccessRequest;
import com.common.dto.access.FamilyTransferCheckRequest;
import com.common.dto.access.SelfCheckRequest;
import com.common.structure.exception.ForbiddenException;
import com.userPointService.service.UserPointAccessService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/userpoint/internal")
public class InternalAccessController {

    private static final Logger log = LoggerFactory.getLogger(InternalAccessController.class);

    private final UserPointAccessService accessService;

    public InternalAccessController(UserPointAccessService accessService) {
        this.accessService = accessService;
    }

    @PostMapping("/can-access")
    public Mono<ResponseEntity<Void>> canAccess(@RequestBody CanAccessRequest request) {
        return jwt()
                .flatMap(jwt -> Mono.fromCallable(() -> {
                    accessService.requireCanAccess(jwt.getSubject(), request.getResourceEmail());
                    return ResponseEntity.ok().<Void>build();
                }));
    }

    @PostMapping("/self")
    public Mono<ResponseEntity<Void>> self(@RequestBody SelfCheckRequest request) {
        return jwt()
                .flatMap(jwt -> Mono.fromCallable(() -> {
                    accessService.requireSelf(jwt.getSubject(), request.getEmail());
                    return ResponseEntity.ok().<Void>build();
                }));
    }

    @PostMapping("/family-transfer")
    public Mono<ResponseEntity<Void>> familyTransfer(@RequestBody FamilyTransferCheckRequest request) {
        return jwt()
                .flatMap(jwt -> Mono.fromCallable(() -> {
                    log.info("INTERNAL family-transfer check - jwtSubject='{}', actorEmail='{}', targetEmail='{}'",
                            jwt.getSubject(), request.getActorEmail(), request.getTargetEmail());
                    accessService.requireFamilyPointsTransfer(jwt.getSubject(), request.getActorEmail(),
                            request.getTargetEmail());
                    log.info("INTERNAL family-transfer check PASSED - jwtSubject='{}'", jwt.getSubject());
                    return ResponseEntity.ok().<Void>build();
                }));
    }

    private Mono<Jwt> jwt() {
        return ReactiveSecurityContextHolder.getContext()
                .flatMap(ctx -> {
                    Object p = ctx.getAuthentication().getPrincipal();
                    if (p instanceof Jwt j) {
                        return Mono.just(j);
                    }
                    return Mono.error(new ForbiddenException("Autenticazione richiesta."));
                });
    }
}
