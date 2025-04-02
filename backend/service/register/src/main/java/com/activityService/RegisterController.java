package com.activityService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.common.dto.PointsDTO;
import com.common.dto.ResponseDTO;
import com.common.dto.UserDTO;
import reactor.core.publisher.Mono;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(origins = "https://webapp-tn6q.onrender.com")
@RequestMapping("api/register")
public class RegisterController {

        @Autowired
        @Qualifier("webClientPoints")
        private WebClient webClientPoints;


        @PostMapping("/dati")
        public Mono<ResponseDTO> saveUserByPoints(@RequestBody PointsDTO pointsDTO) {
                return webClientPoints.post()
                                .uri("/api/points/dati/user")
                                .bodyValue(pointsDTO)
                                .retrieve()
                                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> {
                                        System.out.println("Errore 4xx ricevuto");
                                        return Mono.error(new RuntimeException("Errore 4xx")); // Passa l'errore
                                })
                                .bodyToMono(new ParameterizedTypeReference<ResponseDTO>() {
                                })
                                .doOnError(ex -> {
                                        // Log error senza interrompere
                                        System.err.println("Errore nella chiamata: " + ex.getMessage());
                                });
        }
}
