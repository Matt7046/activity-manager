package com.logActivityService.service;

import com.common.dto.LogFamilyDTO;
import com.common.dto.UserPointDTO;
import com.common.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class LogActivityWebService {

    @Autowired
    @Qualifier("webClientPoint")
    private WebClient webClientPoint;

    @Autowired
    @Qualifier("webClientFamily")
    private WebClient webClientFamily;

    @Value("${app.page.path.userpoint}")
    private String userPointPath;

    @Value("${app.page.path.family}")
    private String familyPath;

    public Mono<ResponseDTO> savePoints(UserPointDTO userPointDTO) {
        return webClientPoint.post()
                .uri(userPointPath+"/dati/standard")
                .bodyValue(userPointDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class);

    }
    public Mono<ResponseDTO> saveLogFamily(LogFamilyDTO logFamilyDTO) {
        return webClientFamily.post()
                .uri(familyPath+"/log")
                .bodyValue(logFamilyDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class);
    }

}
