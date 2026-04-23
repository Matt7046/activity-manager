package com.activityService.service;

import com.common.data.activity.event.ActivityCreateEvent;
import com.common.dto.structure.GPTResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.Map;

@Service
public class ActivityWebAIService {

    @Autowired
    @Qualifier("webClientGPT")
    private WebClient webClientGPT;

    public Mono<String> categorize(ActivityCreateEvent event) {

        String prompt = """
                Classifica l'attività in UNA SOLA categoria tra queste:
                
                SPORT
                STUDIO
                ARTE
                FAI DA TE
                GIARDINAGGIO
                AGRICOLTURA
                TECNOLOGIA
                GIOCHI DA TAVOLO
                GENERICO
                
                Regole:
                - Rispondi SOLO con una parola
                - NON aggiungere testo
                - NON aggiungere punteggiatura
                - Se non sei sicuro, rispondi GENERIC
                
                Esempi:
                Basket -> SPORT
                Museo -> ARTE
                D&D -> GIOCHI DA TAVOLO
                
                Attività: %s
                """.formatted(event.nome());

        Mono<String> response = callAI(prompt);


        return response;
    }

    private Mono<String> callAI(String prompt) {

        return webClientGPT.post()
                .uri("/chat/completions")
                .bodyValue(Map.of(
                        "model", "gpt-4o-mini",
                        "messages", List.of(
                                Map.of("role", "user", "content", prompt)
                        )
                ))
                .retrieve()
                .bodyToMono(GPTResponse.class)
                .map(response -> response.getChoices()
                        .get(0)
                        .getMessage()
                        .getContent()
                        .trim()
                ).subscribeOn(Schedulers.boundedElastic());
    }

}
