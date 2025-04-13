package com.familyService.service;

import com.common.authDTO.PointsUser;
import com.common.dto.UserPointDTO;
import com.common.dto.ResponseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import java.util.Optional;

@Service
public class FamilyWebService {

    @Autowired
    @Qualifier("webClientPoint")
    private WebClient webClientPoint;

    public Mono<Optional<PointsUser>> savePointsByFamily(UserPointDTO userPointDTO) {
         return webClientPoint.post()
                .uri("/api/point/dati/standard")
                .bodyValue(userPointDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .flatMap(responseDTO -> Mono.fromCallable(() -> {
                    UserPointDTO subDTO = new ObjectMapper().convertValue(responseDTO.getJsonText(), UserPointDTO.class);
                    return subDTO.getPoints().stream()
                            .filter(point -> userPointDTO.getEmailFamily().equals(point.getEmail()))
                            .findFirst();
                }).subscribeOn(Schedulers.boundedElastic()));
    }


}
