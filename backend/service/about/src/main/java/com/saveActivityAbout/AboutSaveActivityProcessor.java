package com.saveActivityAbout;

import com.common.dto.ActivityDTO;
import com.common.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatusCode;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.config.StateMachineFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Component
public class AboutSaveActivityProcessor {

    @Autowired
    @Qualifier("webClientActivity")
    private WebClient webClientActivity;

    @Autowired
    @Qualifier("aboutActivitySaveStateMachineFactory")
    private StateMachineFactory<State, Event> stateMachineFactory;


    public Mono<ResponseDTO> callActivitySaveService(ActivityDTO activityDTO) {
        return Mono.fromCallable(() -> {
                    StateMachine<State, Event> stateMachine = stateMachineFactory.getStateMachine();
                    stateMachine.start();
                    stateMachine.sendEvent(Event.PROCESS_ACTIVITY);
                    return stateMachine;
                })
                .subscribeOn(Schedulers.boundedElastic())  // ✅ Esegui in un thread separato
                .flatMap(stateMachine -> processActivity(stateMachine, activityDTO));
    }


    private Mono<ResponseDTO> processActivity(StateMachine<State, Event> stateMachine, ActivityDTO activityDTO) {
         return webClientActivity.post()
                .uri("/api/activity/dati")
                .bodyValue(activityDTO)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> {
                    return Mono.error(new RuntimeException("Errore 4xx")); // Passa l'errore
                })
                 .bodyToMono(ResponseDTO.class)
                 .flatMap(responseDTO -> Mono.fromCallable(() -> responseDTO)
                         .subscribeOn(Schedulers.boundedElastic()))
                 .doOnSuccess(res -> stateMachine.sendEvent(Event.SUCCESS))
                 .doOnError(error -> stateMachine.sendEvent(Event.ERROR));
    }
}
