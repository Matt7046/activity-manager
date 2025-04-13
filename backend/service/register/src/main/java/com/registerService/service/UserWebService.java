package com.registerService.service;

import com.common.dto.UserPointDTO;
import com.common.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
public class UserWebService {


    @Autowired
    @Qualifier("webClientPoint")
    private WebClient webClientPoint;
    @Value("${app.page.path.userpoint}")
    private String userPointPath;

    public Mono<ResponseDTO> processUser(UserPointDTO userPointDTO) {
        return webClientPoint.post()
                .uri(userPointPath+"/dati/user")
                .bodyValue(userPointDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .flatMap(responseDTO -> Mono.fromCallable(() -> responseDTO)
                        .subscribeOn(Schedulers.boundedElastic()));
    }
}
