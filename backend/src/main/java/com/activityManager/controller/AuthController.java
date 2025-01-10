package com.activityManager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.activityManager.configurations.JwtUtil;
import com.activityManager.transversal.LoginRequest;
import com.activityManager.transversal.LoginResponse;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    JwtUtil jwtUtil;

    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/token")
    public ResponseEntity<?> geToken(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        String token = jwtUtil.generateToken(authentication.getName()); // Genera il token JWT
        return ResponseEntity.ok(new LoginResponse(token)); // Restituisci il token
    }
}
