package com.activityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.common.dto.ActivityDTO;
import com.common.dto.PointsDTO;
import com.common.dto.ResponseDTO;

import reactor.core.publisher.Mono;

@Service
public class AboutService {

    @Autowired
    @Qualifier("webClientActivity")
    private WebClient webClientActivity;

    public Mono<ResponseDTO> callActivitySaveService(ActivityDTO activityDTO) {
        return webClientActivity.post()
                .uri("/api/activity/dati")
                .bodyValue(activityDTO)
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

    public Mono<ResponseDTO> callActivityDeleteService(String identificativo) {

        return webClientActivity.delete()
                .uri("/api/activity/toggle/{identificativo}", identificativo)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> {
                    System.out.println("Errore 4xx ricevuto" + clientResponse.statusCode());
                    return Mono.error(new RuntimeException("Errore 4xx" + clientResponse.statusCode()));
                })
                .bodyToMono(new ParameterizedTypeReference<ResponseDTO>() {
                })
                .doOnError(ex -> {
                    System.err.println("Errore nella chiamata: " + ex.getMessage());
                });
    }

}
