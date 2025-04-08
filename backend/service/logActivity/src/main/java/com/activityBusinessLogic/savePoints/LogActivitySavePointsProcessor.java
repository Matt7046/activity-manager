package com.activityBusinessLogic.savePoints;

import com.logActivityService.LogActivityService;
import com.common.data.LogActivity;
import com.common.dto.LogActivityDTO;
import com.common.dto.PointsDTO;
import com.common.dto.ResponseDTO;
import com.common.mapper.LogActivityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.config.StateMachineFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.ArrayList;

@Component
public class LogActivitySavePointsProcessor {

    @Autowired
    @Qualifier("webClientPoint")
    private WebClient webClientPoint;
    @Qualifier("webClientLogActivity")
    private WebClient webClientLogActivity;
    @Autowired
    LogActivityService logActivityService;
    private  StateMachineFactory<State, Event> stateMachineFactory;
    public LogActivitySavePointsProcessor(StateMachineFactory<State, Event> stateMachineFactory) {
        this.stateMachineFactory = stateMachineFactory;
    }



    public Mono<ResponseDTO> savePoints(LogActivityDTO logActivityDTO) {
        return Mono.fromCallable(() -> {
                    StateMachine<State, Event> stateMachine = stateMachineFactory.getStateMachine();
                    stateMachine.start();
                    stateMachine.sendEvent(Event.PROCESS_POINTS);
                    return stateMachine;
                })
                .subscribeOn(Schedulers.boundedElastic())  // ✅ Esegui in un thread separato
                .flatMap(stateMachine -> processPoints(stateMachine, logActivityDTO));
    }

    private Mono<ResponseDTO> processPoints(StateMachine<State, Event> stateMachine, LogActivityDTO logActivityDTO) {
        PointsDTO pointsDTO = new PointsDTO(logActivityDTO);

        return webClientPoint.post()
                .uri("/api/point/dati/standard")
                .bodyValue(pointsDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .flatMap(response ->
                     saveLog(logActivityDTO)
                            .doOnSuccess(res -> stateMachine.sendEvent(Event.SUCCESS))
                            .doOnError(error -> stateMachine.sendEvent(Event.ERROR))
                .subscribeOn(Schedulers.boundedElastic()) // Evita problemi di thread bloccanti
                .doOnError(error -> compensate(stateMachine, pointsDTO)));
    }


    public Mono<ResponseDTO> saveLog(LogActivityDTO logActivityDTO) {
        return Mono.fromCallable(() -> {
            StateMachine<State, Event> stateMachine = stateMachineFactory.getStateMachine();
            LogActivity sub = logActivityService.saveLogActivity(logActivityDTO);
            stateMachine.sendEvent(Event.SUCCESS);
            return new ResponseDTO(LogActivityMapper.INSTANCE.toDTO(sub), HttpStatus.OK.value(), new ArrayList<>());
        });
    }


    private void compensate( StateMachine<State, Event> stateMachine,PointsDTO pointsDTO) {
        webClientPoint.post()
                .uri("/api/point/dati/standard/rollback")
                .bodyValue(pointsDTO)
                .retrieve()
                .toBodilessEntity()
                .subscribeOn(Schedulers.boundedElastic()); // Evita problemi di thread bloccanti
        stateMachine.sendEvent(Event.COMPENSATED);
    }
}
