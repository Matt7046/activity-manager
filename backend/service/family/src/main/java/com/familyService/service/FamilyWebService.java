package com.familyService.service;

import com.common.dto.auth.PointsUser;
import com.common.dto.user.UserPointDTO;
import com.common.dto.structure.ResponseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
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
    @Value("${app.page.path.userpoint}")
    private String userPointPath;


    public Mono<Optional<PointsUser>> savePointsByFamily(UserPointDTO userPointDTO) {
         return webClientPoint.post()
                .uri(userPointPath+"/dati/standard")
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
