package com.authService.service;

import com.common.dto.auth.LoginRequest;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.fasterxml.jackson.databind.JsonNode;
import reactor.core.publisher.Mono;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AuthService {

    @Autowired
    @Qualifier("webClientPublic")
    private WebClient webClientPublic;

    @Value("${app.page.path.userpoint}")
    private String userPointPath;

    public Mono<Boolean> validateLogin(LoginRequest loginRequest) {
        UserPointDTO userPointDTO = new UserPointDTO();
        userPointDTO.setEmail(loginRequest.getEmail());
        userPointDTO.setPassword(loginRequest.getPassword());

        return webClientPublic.post()
                .uri(userPointPath + "/dati/login")
                .bodyValue(userPointDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .map(this::isSuccessfulLoginResponse)
                .defaultIfEmpty(false)
                .onErrorReturn(false);
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
