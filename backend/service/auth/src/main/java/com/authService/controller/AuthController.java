package com.authService.controller;

import com.authService.processor.UserAuthPointsProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import com.common.configurations.structure.JwtUtil;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.auth.LoginRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    UserAuthPointsProcessor processor;

    @PostMapping("/token")
    public Mono<ResponseDTO> getToken(@RequestBody LoginRequest loginRequest) {
        return processor.getToken(loginRequest);
    }
}
