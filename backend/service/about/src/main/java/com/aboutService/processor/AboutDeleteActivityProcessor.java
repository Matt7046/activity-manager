package com.aboutService.processor;

import com.common.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Component
public class AboutDeleteActivityProcessor {

    @Autowired
    @Qualifier("webClientActivity")
    private WebClient webClientActivity;

    public Mono<ResponseDTO> callActivityDeleteService(String identificativo) {
        return processDeleteActivity(identificativo);
    }

    private Mono<ResponseDTO> processDeleteActivity(String identificativo) {
        return webClientActivity.delete()
                .uri("/api/activity/toggle/{identificativo}", identificativo)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> {
                    return Mono.error(new RuntimeException("Errore 4xx")); // Passa l'errore
                })
                .bodyToMono(ResponseDTO.class)
                .flatMap(responseDTO -> Mono.fromCallable(() -> responseDTO)
                        .subscribeOn(Schedulers.boundedElastic()));
    }
}