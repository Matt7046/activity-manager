package com.authService.service;

import com.common.dto.auth.LoginRequest;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import reactor.core.publisher.Mono;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AuthService {

    @Autowired
    @Qualifier("webClientPublic")
    private WebClient webClientPublic;

    @Value("${app.page.path.userpoint}")
    private String userPointPath;
    @Autowired
    private WebClient webClientPoint;

    @Transactional // Nota: Transactional ha senso solo se interagisci con un DB locale qui
    public Mono<Boolean> checkUserExists(LoginRequest loginRequest) {
        UserPointDTO userPointDTO = new UserPointDTO();
        userPointDTO.setEmail(loginRequest.getEmail());
        userPointDTO.setPassword(loginRequest.getPassword());

        return webClientPublic.post()
                .uri(userPointPath + "/dati/login")
                .bodyValue(userPointDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .map(responseDTO -> responseDTO != null && responseDTO.getJsonText() != null)
                .defaultIfEmpty(false)
                .doOnError(error -> {
                    // Usa un logger reale invece di System.out se possibile
                    System.out.println("Errore durante la chiamata di verifica utente: {}"+ error);
                })
                .doOnNext(exists -> {
                    // doOnNext è più appropriato di doOnSuccess per loggare il valore emesso
                    System.out.println("Esito verifica utente: {}"+exists);
                });
    }
}
