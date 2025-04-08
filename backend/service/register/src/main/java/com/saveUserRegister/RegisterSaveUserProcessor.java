package com.saveUserRegister;

import com.common.dto.PointsDTO;
import com.common.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.config.StateMachineFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Component
public class RegisterSaveUserProcessor {

    @Autowired
    @Qualifier("webClientPoint")
    private WebClient webClientPoint;

    private final StateMachineFactory<State, Event> stateMachineFactory;

    public RegisterSaveUserProcessor(StateMachineFactory<State, Event> stateMachineFactory) {
        this.stateMachineFactory = stateMachineFactory;
    }

    public Mono<ResponseDTO> saveUserByPoints(PointsDTO pointsDTO) {
        return Mono.fromCallable(() -> {
                    StateMachine<State, Event> stateMachine = stateMachineFactory.getStateMachine();
                    stateMachine.start();
                    stateMachine.sendEvent(Event.PROCESS_USER);
                    return stateMachine;
                })
                .subscribeOn(Schedulers.boundedElastic())  // ✅ Esegui in un thread separato
                .flatMap(stateMachine -> processUser(stateMachine, pointsDTO));
    }

    private Mono<ResponseDTO> processUser(StateMachine<State, Event> stateMachine, PointsDTO pointsDTO) {
        return webClientPoint.post()
                .uri("/api/point/dati/user")
                .bodyValue(pointsDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .flatMap(responseDTO -> Mono.fromCallable(() -> responseDTO)
                        .subscribeOn(Schedulers.boundedElastic()))
                .doOnSuccess(res -> stateMachine.sendEvent(Event.SUCCESS))
                .doOnError(error -> stateMachine.sendEvent(Event.ERROR));


    }


}
