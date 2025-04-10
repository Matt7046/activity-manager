package com.userAuth;

import com.common.dto.PointsDTO;
import com.common.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Component
public class UserAuthPointsProcessor {

    @Autowired
    @Qualifier("webClientPoint")
    private WebClient webClientPoint;

    public Mono<ResponseDTO> getUserType(PointsDTO pointsDTO) {
        return  processUser(pointsDTO);
    }

    private Mono<ResponseDTO> processUser(PointsDTO pointsDTO) {
           return webClientPoint.post()
                .uri("/api/point/dati")
                .bodyValue(pointsDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .flatMap(responseDTO -> Mono.fromCallable(() -> responseDTO)
                        .subscribeOn(Schedulers.boundedElastic()));
    }
}
