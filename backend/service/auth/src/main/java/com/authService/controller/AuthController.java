package com.authService.controller;

import java.util.ArrayList;

import com.authService.processor.UserAuthPointsProcessor;
import com.common.dto.user.UserPointDTO;
import com.common.structure.status.ActivityHttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import com.common.configurations.structure.JwtUtil;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.auth.LoginRequest;
import com.common.dto.auth.LoginResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserAuthPointsProcessor processor;
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
        return processor.getUserType(userPointDTO);
    }
}
