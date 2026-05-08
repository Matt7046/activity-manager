package com.common.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import com.common.structure.exception.ForbiddenException;

import reactor.core.publisher.Mono;

public final class ReactiveJwt {

    private ReactiveJwt() {
    }

    public static Mono<String> currentSubject() {
        return ReactiveSecurityContextHolder.getContext()
                .map(ctx -> ctx.getAuthentication())
                .filter(Authentication::isAuthenticated)
                .flatMap(auth -> {
                    if (auth.getPrincipal() instanceof Jwt jwt) {
                        return Mono.just(EmailNormalization.normalize(jwt.getSubject()));
                    }
                    return Mono.error(new ForbiddenException("Autenticazione richiesta."));
                })
                .switchIfEmpty(Mono.error(new ForbiddenException("Autenticazione richiesta.")));
    }
}
