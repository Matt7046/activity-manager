package com.familyService.service;

import java.util.Optional;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.dto.auth.Point;
import com.common.dto.user.PointDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
public class FamilyWebService {

    @Autowired
    @Qualifier("webClientPoint")
    private WebClient webClientPoint;
    @Value("${app.page.path.userpoint}")
    private String userPointPath;
    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;



    public Mono<Optional<PointDTO>> savePointsByFamily(UserPointDTO userPointDTO) {
         return webClientPoint.post()
                .uri(userPointPath+"/dati/user/operation")
                .bodyValue(userPointDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .flatMap(responseDTO -> Mono.fromCallable(() -> {
                    UserPointDTO subDTO = new ObjectMapper().convertValue(responseDTO.getJsonText(), UserPointDTO.class);
                    return subDTO.getPoints().stream()
                            .filter(point -> encryptDecryptConverter.convert(userPointDTO.getEmailFamily()).equals(point.getEmail()))
                            .findFirst();
                }).subscribeOn(Schedulers.boundedElastic()));
    }


}
