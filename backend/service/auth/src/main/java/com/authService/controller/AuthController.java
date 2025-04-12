package com.authService.controller;

import java.util.ArrayList;

import com.authService.service.UserWebService;
import com.common.dto.UserPointDTO;
import com.common.exception.ActivityHttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.common.configurations.JwtUtil;
import com.common.dto.ResponseDTO;
import com.common.authDTO.LoginRequest;
import com.common.authDTO.LoginResponse;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserWebService userWebService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/token")
    public ResponseEntity<ResponseDTO> getToken(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        String token = jwtUtil.generateToken(authentication.getName()); // Genera il token JWT
        ResponseDTO response = new ResponseDTO(new LoginResponse(token), ActivityHttpStatus.OK.value(), new ArrayList<>());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/dati")
    public Mono<ResponseDTO> getUserType(@RequestBody UserPointDTO userPointDTO) {
        // Una volta completata la chiamata points, salva il log e crea la response
        return userWebService.getUserType(userPointDTO);
    }
}
