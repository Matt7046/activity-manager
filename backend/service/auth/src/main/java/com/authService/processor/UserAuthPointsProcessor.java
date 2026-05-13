package com.authService.processor;

import com.authService.service.AuthService;
import com.common.configurations.structure.JwtUtil;
import com.common.dto.auth.LoginRequest;
import com.common.dto.auth.LoginResponse;
import com.common.dto.structure.ResponseDTO;
import com.common.structure.messages.UnauthorizedMessages;
import com.common.structure.status.ActivityHttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserAuthPointsProcessor {

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    AuthService authService;

    @Autowired
    UnauthorizedMessages unauthorizedMessages;

    public Mono<ResponseDTO> getToken(LoginRequest loginRequest) {
        return authService.validateLogin(loginRequest)
                .filter(valid -> valid)
                .map(ignored -> {
                    String email = loginRequest.getEmail();
                    String token = jwtUtil.generateToken(email);
                    LoginResponse body = new LoginResponse();
                    body.setToken(token);
                    body.setEmail(email);
                    return new ResponseDTO(body, ActivityHttpStatus.OK.value(),
                            new ArrayList<>());
                })
                .switchIfEmpty(Mono.fromSupplier(() -> new ResponseDTO(new LoginResponse(), 401,
                        new ArrayList<>(List.of(unauthorizedMessages.invalidCredentials())))));
    }
}
