package com.activityService.service;

import com.common.data.activity.event.ActivityCreateEvent;
import com.activityService.dto.GPTResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
public class ActivityWebAIService {

    private static final Logger log = LoggerFactory.getLogger(ActivityWebAIService.class);
    private static final String GPT_MODEL = "gpt-4o-mini";
    private static final int LOG_BODY_MAX = 4000;

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
                GIOCHI
                LETTURA
                GENERICO
                
                Regole:
                - Rispondi SOLO con una parola
                - NON aggiungere testo
                - NON aggiungere punteggiatura
                - Se non sei sicuro, rispondi GENERICO
                
                Esempi:
                Basket -> SPORT
                Museo -> ARTE
                D&D -> GIOCHI
                
                Attività: %s
                """.formatted(event.nome());

        Mono<String> response = callAI(prompt);


        return response;
    }

    private Mono<String> callAI(String prompt) {

        return webClientGPT.post()
                .uri("/chat/completions")
                .bodyValue(Map.of(
                        "model", GPT_MODEL,
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
                )
                .subscribeOn(Schedulers.boundedElastic())
                .doOnError(this::logOpenAiFailure);
    }

    /**
     * Log leggibile per diagnostica (mai token o header Authorization).
     */
    private void logOpenAiFailure(Throwable error) {
        if (error instanceof WebClientResponseException w) {
            String body = truncateForLog(safeResponseBody(w), LOG_BODY_MAX);
            log.error(
                    "[OpenAI] chat/completions model={} HTTP {} — body: {}",
                    GPT_MODEL,
                    w.getStatusCode().value(),
                    body.isEmpty() ? "(vuoto)" : body,
                    w);
            return;
        }
        if (error instanceof WebClientRequestException w) {
            log.error("[OpenAI] errore di rete / TLS verso api.openai.com: {}", w.getMessage(), w);
            return;
        }
        log.error("[OpenAI] errore imprevisto ({}): {}", error.getClass().getSimpleName(), error.getMessage(), error);
    }

    private  String safeResponseBody(WebClientResponseException w) {
        try {
            return w.getResponseBodyAsString(StandardCharsets.UTF_8);
        } catch (Exception e) {
            return "(impossibile leggere il body: " + e.getMessage() + ")";
        }
    }

    private  String truncateForLog(String s, int max) {
        if (s == null || s.isEmpty()) {
            return "";
        }
        String t = s.replace("\r", " ").replace("\n", " ");
        return t.length() <= max ? t : t.substring(0, max) + "…(troncato)";
    }

}
