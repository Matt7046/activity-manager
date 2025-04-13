package com.aboutService.service;

import com.common.dto.activity.ActivityDTO;
import com.common.dto.structure.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
public class AboutWebService {

    @Autowired
    @Qualifier("webClientActivity")
    private WebClient webClientActivity;
    @Value("${message.http.error.4xx}")
    private String error4xx;
    @Value("${app.page.path.activity}")
    private String activityPath;

    public Mono<ResponseDTO> processDeleteActivity(String identificativo) {
        return webClientActivity.delete()
                .uri(activityPath+"/toggle/{identificativo}", identificativo)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> {
                    return Mono.error(new RuntimeException("Errore 4xx")); // Passa l'errore
                })
                .bodyToMono(ResponseDTO.class)
                .flatMap(responseDTO -> Mono.fromCallable(() -> responseDTO)
                        .subscribeOn(Schedulers.boundedElastic()));
    }

    public Mono<ResponseDTO> processSaveActivity(ActivityDTO activityDTO) {
        return webClientActivity.post()
                .uri(activityPath+"/dati")
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
