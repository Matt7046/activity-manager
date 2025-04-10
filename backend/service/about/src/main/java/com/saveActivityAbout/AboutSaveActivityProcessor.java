package com.saveActivityAbout;

import com.common.dto.ActivityDTO;
import com.common.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Component
public class AboutSaveActivityProcessor {

    @Autowired
    @Qualifier("webClientActivity")
    private WebClient webClientActivity;

    @Value("${message.http.error.4xx}")
    private String error4xx;

    public Mono<ResponseDTO> callActivitySaveService(ActivityDTO activityDTO) {
        return processActivity(activityDTO);
    }

    private Mono<ResponseDTO> processActivity(ActivityDTO activityDTO) {
         return webClientActivity.post()
                .uri("/api/activity/dati")
                .bodyValue(activityDTO)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> {
                    return Mono.error(new RuntimeException(error4xx)); // Passa l'errore
                })
                 .bodyToMono(ResponseDTO.class)
                 .flatMap(responseDTO -> Mono.fromCallable(() -> responseDTO)
                         .subscribeOn(Schedulers.boundedElastic()));
    }
}
