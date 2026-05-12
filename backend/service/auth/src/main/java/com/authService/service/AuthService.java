package com.authService.service;

import com.common.dto.auth.LoginRequest;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
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

    @Value("${github.client-id:}")
    private String githubClientId;

    @Value("${github.client-secret:}")
    private String githubClientSecret;

    @Value("${facebook.app-id:}")
    private String facebookAppId;

    @Value("${facebook.app-secret:}")
    private String facebookAppSecret;

    private static final WebClient WEB_CLIENT_GITHUB_API = WebClient.create("https://api.github.com");
    private static final WebClient WEB_CLIENT_GITHUB_OAUTH = WebClient.create("https://github.com");
    private static final WebClient WEB_CLIENT_FACEBOOK = WebClient.create("https://graph.facebook.com");

    public Mono<Boolean> validateLogin(LoginRequest loginRequest) {
        if (isGoogleLoginRequest(loginRequest)) {
            return validateGoogleLogin(loginRequest);
        }
        if (isGithubLoginRequest(loginRequest)) {
            return validateGithubLogin(loginRequest);
        }
        if (isFacebookLoginRequest(loginRequest)) {
            return validateFacebookLogin(loginRequest);
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

    private boolean isGithubLoginRequest(LoginRequest loginRequest) {
        if (loginRequest == null) {
            return false;
        }
        return Boolean.TRUE.equals(loginRequest.getGithubLogin())
                && normalize(loginRequest.getGithubCode()) != null
                && !normalize(loginRequest.getGithubCode()).isEmpty()
                && normalize(loginRequest.getGithubRedirectUri()) != null
                && !normalize(loginRequest.getGithubRedirectUri()).isEmpty();
    }

    private boolean isFacebookLoginRequest(LoginRequest loginRequest) {
        if (loginRequest == null) {
            return false;
        }
        String email = normalize(loginRequest.getEmail());
        return Boolean.TRUE.equals(loginRequest.getFacebookLogin())
                && email != null
                && !email.isEmpty()
                && normalize(loginRequest.getFacebookAccessToken()) != null
                && !normalize(loginRequest.getFacebookAccessToken()).isEmpty();
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

    /**
     * Scambia il code OAuth con GitHub, legge l’email primaria verificata e la imposta su {@code loginRequest}
     * (come l’email inviata dal client per Google).
     */
    private Mono<Boolean> validateGithubLogin(LoginRequest loginRequest) {
        String cid = normalize(githubClientId);
        String csec = normalize(githubClientSecret);
        if (cid == null || cid.isEmpty() || csec == null || csec.isEmpty()) {
            return Mono.just(false);
        }
        String code = normalize(loginRequest.getGithubCode());
        String redirectUri = normalize(loginRequest.getGithubRedirectUri());

        return WEB_CLIENT_GITHUB_OAUTH
                .post()
                .uri("/login/oauth/access_token")
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("client_id", cid)
                        .with("client_secret", csec)
                        .with("code", code)
                        .with("redirect_uri", redirectUri))
                .retrieve()
                .bodyToMono(JsonNode.class)
                .flatMap(tokenJson -> {
                    String accessToken = normalize(tokenJson.path("access_token").asText(null));
                    if (accessToken == null || accessToken.isEmpty()) {
                        return Mono.just(false);
                    }
                    return fetchGithubPrimaryEmail(accessToken)
                            .map(primary -> {
                                loginRequest.setEmail(primary);
                                return true;
                            })
                            .switchIfEmpty(Mono.just(false));
                })
                .defaultIfEmpty(false)
                .onErrorReturn(false);
    }

    private Mono<String> fetchGithubPrimaryEmail(String githubAccessToken) {
        return WEB_CLIENT_GITHUB_API
                .get()
                .uri("/user/emails")
                .headers(h -> h.setBearerAuth(githubAccessToken))
                .header(HttpHeaders.ACCEPT, "application/vnd.github+json")
                .retrieve()
                .bodyToMono(JsonNode.class)
                .flatMap(this::pickGithubEmailFromJson);
    }

    private Mono<String> pickGithubEmailFromJson(JsonNode emails) {
        if (emails == null || !emails.isArray() || emails.isEmpty()) {
            return Mono.empty();
        }
        String primary = null;
        String fallback = null;
        for (JsonNode node : emails) {
            String em = normalize(node.path("email").asText(null));
            boolean verified = node.path("verified").asBoolean(false);
            boolean isPrimary = node.path("primary").asBoolean(false);
            if (em == null || em.isEmpty() || !verified) {
                continue;
            }
            if (isPrimary) {
                primary = em;
                break;
            }
            if (fallback == null) {
                fallback = em;
            }
        }
        if (primary != null) {
            return Mono.just(primary);
        }
        if (fallback != null) {
            return Mono.just(fallback);
        }
        return Mono.empty();
    }

    private Mono<Boolean> validateFacebookLogin(LoginRequest loginRequest) {
        String email = normalize(loginRequest.getEmail());
        String userToken = normalize(loginRequest.getFacebookAccessToken());
        String appId = normalize(facebookAppId);
        String appSecret = normalize(facebookAppSecret);
        if (appId == null || appId.isEmpty() || appSecret == null || appSecret.isEmpty()) {
            return Mono.just(false);
        }
        String appAccessToken = appId + "|" + appSecret;

        return WEB_CLIENT_FACEBOOK
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/debug_token")
                        .queryParam("input_token", userToken)
                        .queryParam("access_token", appAccessToken)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .flatMap(debug -> {
                    JsonNode data = debug.path("data");
                    if (!data.path("is_valid").asBoolean(false)) {
                        return Mono.just(false);
                    }
                    return WEB_CLIENT_FACEBOOK
                            .get()
                            .uri(uriBuilder -> uriBuilder
                                    .path("/me")
                                    .queryParam("fields", "email")
                                    .queryParam("access_token", userToken)
                                    .build())
                            .retrieve()
                            .bodyToMono(JsonNode.class)
                            .map(me -> {
                                String fbEmail = normalize(me.path("email").asText(null));
                                return fbEmail != null && fbEmail.equalsIgnoreCase(email);
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
