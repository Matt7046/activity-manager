package com.common.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import com.common.structure.exception.ForbiddenException;

import reactor.core.publisher.Mono;

@Component
public class ReactiveJwt {

    private final String messageAuthenticationRequired;

    public ReactiveJwt(
            @Value("${message.exceptions.forbidden.authentication-required}") String messageAuthenticationRequired) {
        this.messageAuthenticationRequired = messageAuthenticationRequired;
    }

    public Mono<String> currentSubject() {
        return ReactiveSecurityContextHolder.getContext()
                .map(ctx -> ctx.getAuthentication())
                .filter(Authentication::isAuthenticated)
                .flatMap(auth -> {
                    if (auth.getPrincipal() instanceof Jwt jwt) {
                        return Mono.just(EmailNormalization.normalize(jwt.getSubject()));
                    }
                    return Mono.error(new ForbiddenException(messageAuthenticationRequired));
                })
                .switchIfEmpty(Mono.error(new ForbiddenException(messageAuthenticationRequired)));
    }
}
