package com.activityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.common.configurations.EncryptDecryptConverter;
import com.common.dto.PointsDTO;
import com.common.dto.ResponseDTO;

import reactor.core.publisher.Mono;

@Service
public class FamilyService {
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    @Autowired
    @Qualifier("webClientPoints")
    WebClient webClientPoints;

    public Mono<ResponseDTO> savePointsByFamily(PointsDTO pointsDTO) {
        return webClientPoints.post()
                .uri("/api/points/dati/standard")
                .bodyValue(pointsDTO)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> {
                    return Mono.error(new RuntimeException("Errore 4xx"+clientResponse.statusCode())); // Passa l'errore
                })
                .bodyToMono(new ParameterizedTypeReference<ResponseDTO>() {
                })
                .doOnError(ex -> {
                    // Log error senza interrompere
                    System.err.println("Errore nella chiamata: " + ex.getMessage());
                });
    }

}
