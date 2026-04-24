package com.authService.processor;

import com.authService.service.AuthService;
import com.common.configurations.structure.JwtUtil;
import com.common.dto.auth.LoginRequest;
import com.common.dto.auth.LoginResponse;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.common.structure.status.ActivityHttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.ArrayList;

@Component
public class UserAuthPointsProcessor {

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public Mono<ResponseDTO> getToken(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken("user", "qwertyuiop"));
        String token = jwtUtil.generateToken(authentication.getName());
        return authService.checkUserExists(loginRequest)
                .flatMap(exists -> {
                    if (exists) {
                        return Mono.just(new ResponseDTO(new LoginResponse(token), ActivityHttpStatus.OK.value(),
                                new ArrayList<>()));
                    } else {
                        // Se non esiste, ritorno una risposta vuota o un errore
                        return Mono.just(new ResponseDTO(new LoginResponse(""), ActivityHttpStatus.INTERNAL_SERVER_ERROR.value(),
                                new ArrayList<>()));
                    }
                });
    }
}
