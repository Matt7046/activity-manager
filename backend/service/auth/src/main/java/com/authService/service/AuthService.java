package com.authService.service;

import com.common.configurations.structure.JwtUtil;
import com.common.dto.auth.LoginResponse;
import com.common.dto.user.UserPointDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.structure.status.ActivityHttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.ArrayList;

@Service
public class AuthService {

    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Transactional
    public LoginResponse getToken( Authentication authentication) {
        String token = jwtUtil.generateToken(authentication.getName());
        return new LoginResponse(token);// Genera il token JWT

    }
}
