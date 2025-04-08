package com.userAuth;

import com.common.configurations.RabbitMQProducer;
import com.common.dto.PointsDTO;
import com.common.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.config.StateMachineFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Component
public class UserAuthPointsProcessor {

    @Autowired
    @Qualifier("webClientPoint")
    private WebClient webClientPoint;

    private final StateMachineFactory<State, Event> stateMachineFactory;

    public UserAuthPointsProcessor(StateMachineFactory<State, Event> stateMachineFactory) {
        this.stateMachineFactory = stateMachineFactory;
    }

    public Mono<ResponseDTO> getUserType(PointsDTO pointsDTO) {
        return Mono.fromCallable(() -> {
                    StateMachine<State, Event> stateMachine = stateMachineFactory.getStateMachine();
                    stateMachine.start();
                    stateMachine.sendEvent(Event.PROCESS_POINTS);
                    return stateMachine;
                })
                .subscribeOn(Schedulers.boundedElastic())  // ✅ Esegui in un thread separato
                .flatMap(stateMachine -> processUser(stateMachine, pointsDTO));
    }

    private Mono<ResponseDTO> processUser(StateMachine<State, Event> stateMachine, PointsDTO pointsDTO) {
           return webClientPoint.post()
                .uri("/api/point/dati")
                .bodyValue(pointsDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .flatMap(responseDTO -> Mono.fromCallable(() -> responseDTO)
                        .subscribeOn(Schedulers.boundedElastic()))
                .doOnSuccess(res -> stateMachine.sendEvent(Event.SUCCESS))
                .doOnError(error -> stateMachine.sendEvent(Event.ERROR));
    }
}
