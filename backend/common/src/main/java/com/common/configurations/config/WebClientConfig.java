package com.common.configurations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.security.oauth2.jwt.Jwt;

@Configuration
public class WebClientConfig {

    @Value("${app.page.service.auth}")
    private String auth;

    @Value("${app.page.service.activity}")
    private String activity;

    @Value("${app.page.service.logactivity}")
    private String logactivity;

    @Value("${app.page.service.register}")
    private String register;

    @Value("${app.page.service.userpoint}")
    private String userpoint;

    @Value("${app.page.service.about}")
    private String about;

    @Value("${app.page.service.family}")
    private String family;

    @Bean
    public WebClient webClientRegister(WebClient.Builder builder) {
        return builder
                .baseUrl(register)
                .filter((request, next) -> ReactiveSecurityContextHolder.getContext()
                        .map(securityContext -> {
                            String token = (String) securityContext.getAuthentication().getCredentials();
                            return ClientRequest.from(request)
                                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                    .build();
                        })
                        .flatMap(next::exchange) // Continua la chiamata dopo aver aggiunto il token
                )
                .build();
    }

    @Bean
    public WebClient webClientAbout(WebClient.Builder builder) {
        return builder
                .baseUrl(about) // Usa il nome del container se sei in Docker!
                .filter((request, next) -> ReactiveSecurityContextHolder.getContext()
                        .map(securityContext -> {
                            Jwt token = (Jwt) securityContext.getAuthentication().getCredentials();
                            String tokenValue = token.getTokenValue();
                            return ClientRequest.from(request)
                                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenValue)
                                    .build();
                        })
                        .flatMap(next::exchange) // Continua la chiamata dopo aver aggiunto il token
                )
                .build();
    }

    @Bean
    public WebClient webClientPoint(WebClient.Builder builder) {
        return builder
                .baseUrl(userpoint)
                .filter((request, next) -> ReactiveSecurityContextHolder.getContext()
                        .map(securityContext -> {
                            Jwt token = (Jwt) securityContext.getAuthentication().getCredentials();
                            String tokenValue = token.getTokenValue();
                            return ClientRequest.from(request)
                                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenValue)
                                    .build();
                        })
                        .flatMap(next::exchange) // Continua la chiamata dopo aver aggiunto il token
                )
                .build();
    }

    @Bean
    public WebClient webClientActivity(WebClient.Builder builder) {
        return builder
                .baseUrl(activity) // Usa il nome del container se sei in Docker!
                .filter((request, next) -> ReactiveSecurityContextHolder.getContext()
                        .map(securityContext -> {
                            Jwt token = (Jwt) securityContext.getAuthentication().getCredentials();
                            String tokenValue = token.getTokenValue();
                            return ClientRequest.from(request)
                                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenValue)
                                    .build();
                        })
                        .flatMap(next::exchange) // Continua la chiamata dopo aver aggiunto il token
                )
                .build();
    }

    @Bean
    public WebClient webClientLogActivity(WebClient.Builder builder) {
        return builder
                .baseUrl(logactivity) // Usa il nome del container se sei in Docker!
                .filter((request, next) -> ReactiveSecurityContextHolder.getContext()
                        .map(securityContext -> {
                            Jwt token = (Jwt) securityContext.getAuthentication().getCredentials();
                            String tokenValue = token.getTokenValue();
                            return ClientRequest.from(request)
                                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenValue)
                                    .build();
                        })
                        .flatMap(next::exchange) // Continua la chiamata dopo aver aggiunto il token
                )
                .build();
    }

    @Bean
    public WebClient webClientAuth(WebClient.Builder builder) {
        return builder
                .baseUrl(auth) // Usa il nome del container se sei in Docker!
                .filter((request, next) -> ReactiveSecurityContextHolder.getContext()
                        .map(securityContext -> {
                            Jwt token = (Jwt) securityContext.getAuthentication().getCredentials();
                            String tokenValue = token.getTokenValue();
                            return ClientRequest.from(request)
                                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenValue)
                                    .build();
                        })
                        .flatMap(next::exchange) // Continua la chiamata dopo aver aggiunto il token
                )
                .build();
    }

    @Bean
    public WebClient webClientFamily(WebClient.Builder builder) {
        return builder
                .baseUrl(family) // Usa il nome del container se sei in Docker!
                .filter((request, next) -> ReactiveSecurityContextHolder.getContext()
                        .map(securityContext -> {
                            Jwt token = (Jwt) securityContext.getAuthentication().getCredentials();
                            String tokenValue = token.getTokenValue();
                            return ClientRequest.from(request)
                                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenValue)
                                    .build();
                        })
                        .flatMap(next::exchange) // Continua la chiamata dopo aver aggiunto il token
                )
                .build();
    }


}