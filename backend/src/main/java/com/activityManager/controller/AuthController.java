package com.activityManager.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.activityManager.configurations.JwtUtil;
import com.activityManager.dto.ResponseDTO;
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
    public ResponseEntity<ResponseDTO> geToken(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        String token = jwtUtil.generateToken(authentication.getName()); // Genera il token JWT
        ResponseDTO response = new ResponseDTO(new LoginResponse(token), HttpStatus.OK.value(), new ArrayList<>());
        return ResponseEntity.ok(response);
    }
}
