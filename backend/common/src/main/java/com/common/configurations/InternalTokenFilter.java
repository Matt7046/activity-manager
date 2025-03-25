package com.common.configurations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
public class InternalTokenFilter implements WebFilter {

    @Value("${microservice.auth-token}")
    private String internalAuthToken;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        return ReactiveSecurityContextHolder.getContext()
                .map(securityContext -> {
                    String token = securityContext.getAuthentication().getCredentials().toString();
                    System.out.println("Token recuperato dal contesto di sicurezza: " + token);
                    return token;
                })
                .defaultIfEmpty("") // Se non c'è token, usa una stringa vuota
                .flatMap(token -> {
                    String path = exchange.getRequest().getPath().toString();
                    System.out.println("Request path: " + path);

                    // 1️⃣ Permetti l'endpoint pubblico
                    if (path.equals("/api/auth/token")) {
                        return chain.filter(exchange);
                    }

                    // 2️⃣ Se il token corrisponde al token interno, permetti la chiamata
                    if ((token).equals(internalAuthToken)) {
                        return chain.filter(exchange);
                    }

                    return chain.filter(exchange);
                });
    }
}