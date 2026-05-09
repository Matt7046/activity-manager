package com.authService.service;

import com.common.dto.auth.LoginRequest;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class AuthService {

    @Autowired
    @Qualifier("webClientPublic")
    private WebClient webClientPublic;

    @Value("${app.page.path.userpoint}")
    private String userPointPath;

    @Autowired
    @Qualifier("webClientGoogle")
    private WebClient webClientGoogle;

    @Value("${google.api-key}")
    private String googleClientId;

    public Mono<Boolean> validateLogin(LoginRequest loginRequest) {
        if (isGoogleLoginRequest(loginRequest)) {
            return validateGoogleLogin(loginRequest);
        }

        UserPointDTO userPointDTO = new UserPointDTO();
        userPointDTO.setEmail(normalize(loginRequest != null ? loginRequest.getEmail() : null));
        userPointDTO.setPassword(loginRequest != null ? loginRequest.getPassword() : null);

        return webClientPublic.post()
                .uri(userPointPath + "/dati/login")
                .bodyValue(userPointDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .map(this::isSuccessfulLoginResponse)
                .defaultIfEmpty(false)
                .onErrorReturn(false);
    }

    private boolean isGoogleLoginRequest(LoginRequest loginRequest) {
        if (loginRequest == null) {
            return false;
        }
        String email = normalize(loginRequest.getEmail());
        return Boolean.TRUE.equals(loginRequest.getGoogleLogin()) && email != null && !email.isEmpty();
    }

    private Mono<Boolean> validateGoogleLogin(LoginRequest loginRequest) {
        String email = normalize(loginRequest.getEmail());
        String accessToken = normalize(loginRequest.getGoogleAccessToken());
        if (email == null || email.isEmpty() || accessToken == null || accessToken.isEmpty()) {
            return Mono.just(false);
        }
        String configuredClientId = normalize(googleClientId);

        return webClientGoogle
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/oauth2/v1/tokeninfo")
                        .queryParam("access_token", accessToken)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .flatMap(tokenInfo -> {
                    String audience = normalize(tokenInfo.path("audience").asText(null));
                    if (audience == null || audience.isEmpty()) {
                        audience = normalize(tokenInfo.path("aud").asText(null));
                    }
                    String issuedTo = normalize(tokenInfo.path("issued_to").asText(null));
                    String expiresIn = normalize(tokenInfo.path("expires_in").asText(null));
                    boolean audienceValid = configuredClientId == null || configuredClientId.isEmpty()
                            || configuredClientId.equals(audience)
                            || configuredClientId.equals(issuedTo);
                    boolean notExpired = isTokenNotExpired(expiresIn);
                    if (!audienceValid || !notExpired) {
                        return Mono.just(false);
                    }

                    String tokenInfoEmail = normalize(tokenInfo.path("email").asText(null));
                    boolean tokenInfoEmailVerified = tokenInfo.path("verified_email").asBoolean(false);
                    if (tokenInfoEmail != null && !tokenInfoEmail.isEmpty()) {
                        return Mono.just(tokenInfoEmailVerified && tokenInfoEmail.equalsIgnoreCase(email));
                    }

                    return webClientGoogle
                            .get()
                            .uri("/oauth2/v3/userinfo")
                            .headers(headers -> headers.setBearerAuth(accessToken))
                            .retrieve()
                            .bodyToMono(JsonNode.class)
                            .map(userInfo -> {
                                String googleEmail = normalize(userInfo.path("email").asText(null));
                                boolean emailVerified = userInfo.path("email_verified").asBoolean(false);
                                return emailVerified && googleEmail != null && googleEmail.equalsIgnoreCase(email);
                            });
                })
                .defaultIfEmpty(false)
                .onErrorReturn(false);
    }

    private boolean isTokenNotExpired(String expiresIn) {
        if (expiresIn == null || expiresIn.isBlank()) {
            return false;
        }
        try {
            return Long.parseLong(expiresIn) > 0;
        } catch (NumberFormatException ex) {
            return false;
        }
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

    private boolean isSuccessfulLoginResponse(ResponseDTO responseDTO) {
        if (responseDTO == null || responseDTO.getStatus() == null || responseDTO.getStatus() != 200) {
            return false;
        }
        JsonNode json = responseDTO.getJsonText();
        return json != null && !json.isNull()
                && (json.hasNonNull("email") || json.hasNonNull("_id"));
    }
}
