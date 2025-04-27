package com.logActivityService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.common.dto.family.LogFamilyDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;

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
                .uri(userPointPath + "/dati/user/operation")
                .bodyValue(userPointDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .doOnError(error -> {
                    // Log dell'errore
                    System.out.println("Errore durante il salvataggio dei punti: " + error.getMessage());
                    // Qui potresti anche inviare un evento di errore se vuoi
                })
                .doOnSuccess(response -> {
                    // Log del successo
                    System.out.println("Salvataggio punti riuscito: " );
                    // Esegui un'azione asincrona se necessario
                    Mono.fromRunnable(() -> {
                        // Codice per l'evento asincrono
                    }).subscribe();
                });
    }

    public Mono<ResponseDTO> saveLogFamily(LogFamilyDTO logFamilyDTO) {
        return webClientFamily.post()
                .uri(familyPath+"/log")
                .bodyValue(logFamilyDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class);
    }

}
