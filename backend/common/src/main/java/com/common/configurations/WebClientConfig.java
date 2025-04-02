package com.common.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.security.oauth2.jwt.Jwt;

@Configuration
public class WebClientConfig { 

@Bean
public WebClient webClientRegister(WebClient.Builder builder) {
    return builder
        .baseUrl("http://register-service:8080")
        .filter((request, next) -> 
            ReactiveSecurityContextHolder.getContext()
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
                .baseUrl("http://about-service:8080") // Usa il nome del container se sei in Docker!
                .filter((request, next) -> 
                ReactiveSecurityContextHolder.getContext()
                    .map(securityContext -> {
                        Jwt token =  (Jwt) securityContext.getAuthentication().getCredentials();
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
    public WebClient webClientPoints(WebClient.Builder builder) {
        return builder
        .baseUrl("http://points-service:8080")
        .filter((request, next) -> 
            ReactiveSecurityContextHolder.getContext()
                .map(securityContext -> {
                    Jwt token =  (Jwt) securityContext.getAuthentication().getCredentials();
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
                .baseUrl("http://activity-service:8080") // Usa il nome del container se sei in Docker!
                .filter((request, next) -> 
            ReactiveSecurityContextHolder.getContext()
                .map(securityContext -> {
                    Jwt token =  (Jwt) securityContext.getAuthentication().getCredentials();
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
                .baseUrl("http://log-activity-service:8080") // Usa il nome del container se sei in Docker!
                .filter((request, next) -> 
            ReactiveSecurityContextHolder.getContext()
                .map(securityContext -> {
                    Jwt token =  (Jwt) securityContext.getAuthentication().getCredentials();
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
                .baseUrl("http://auth-service:8080") // Usa il nome del container se sei in Docker!
                .filter((request, next) -> 
            ReactiveSecurityContextHolder.getContext()
                .map(securityContext -> {
                    Jwt token =  (Jwt) securityContext.getAuthentication().getCredentials();
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