package com.authService;

import java.util.ArrayList;

import com.common.dto.PointsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.common.configurations.JwtUtil;
import com.common.dto.ResponseDTO;
import com.common.transversal.LoginRequest;
import com.common.transversal.LoginResponse;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserStateMachineService userStateMachineService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/token")
    public ResponseEntity<ResponseDTO> getToken(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        String token = jwtUtil.generateToken(authentication.getName()); // Genera il token JWT
        ResponseDTO response = new ResponseDTO(new LoginResponse(token), HttpStatus.OK.value(), new ArrayList<>());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/dati")
    public Mono<ResponseDTO> getUserType(@RequestBody PointsDTO pointsDTO) {
        // Una volta completata la chiamata points, salva il log e crea la response
        return userStateMachineService.getUserType(pointsDTO);
    }
}
