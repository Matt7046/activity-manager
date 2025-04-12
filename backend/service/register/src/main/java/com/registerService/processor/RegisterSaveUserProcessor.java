package com.registerService.processor;

import com.common.dto.UserPointDTO;
import com.common.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Component
public class RegisterSaveUserProcessor {

    @Autowired
    @Qualifier("webClientPoint")
    private WebClient webClientPoint;

    public Mono<ResponseDTO> saveUserByPoints(UserPointDTO userPointDTO) {
        return  processUser(userPointDTO);
    }

    private Mono<ResponseDTO> processUser(UserPointDTO userPointDTO) {
        return webClientPoint.post()
                .uri("/api/point/dati/user")
                .bodyValue(userPointDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .flatMap(responseDTO -> Mono.fromCallable(() -> responseDTO)
                        .subscribeOn(Schedulers.boundedElastic()));
    }
}
