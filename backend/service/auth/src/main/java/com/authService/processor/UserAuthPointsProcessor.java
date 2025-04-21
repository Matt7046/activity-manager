package com.authService.processor;

import com.authService.service.AuthService;
import com.common.dto.auth.LoginRequest;
import com.common.dto.structure.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;
import reactor.core.publisher.Mono;

@Component
public class UserAuthPointsProcessor {


    @Autowired
    AuthService authService;
    @Autowired
    private AuthenticationManager authenticationManager;

    public Mono<ResponseDTO> getToken(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        return authService.getToken(authentication);
    }
}
