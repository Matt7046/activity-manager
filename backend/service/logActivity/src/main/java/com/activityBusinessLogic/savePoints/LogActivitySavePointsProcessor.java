package com.activityBusinessLogic.savePoints;

import com.common.data.OperationTypeLogFamily;
import com.common.dto.LogFamilyDTO;
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
import java.util.Date;

@Component
public class LogActivitySavePointsProcessor {

    @Autowired
    @Qualifier("webClientPoint")
    private WebClient webClientPoint;
    @Autowired
    @Qualifier("webClientFamily")
    private WebClient webClientFamily;
    @Autowired
    LogActivityService logActivityService;
    private StateMachineFactory<State, Event> stateMachineFactory;

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
        LogFamilyDTO logFamily = new LogFamilyDTO();
        logFamily.setOperations(OperationTypeLogFamily.OPERATIVE);
        logFamily.setDate(new Date());
        logFamily.setPerformedByEmail(logActivityDTO.getEmailUserCurrent());
        logFamily.setReceivedByEmail(logActivityDTO.getEmail());
        return webClientPoint.post()
                .uri("/api/point/dati/standard")
                .bodyValue(pointsDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .flatMap(response ->
                        saveLog(logActivityDTO)
                                .doOnSuccess(res -> stateMachine.sendEvent(Event.LOG_FAMILY))
                                .doOnError(error -> compensate(stateMachine, pointsDTO))
                                .subscribeOn(Schedulers.boundedElastic()))
                .flatMap(response ->
                        saveLogFamily(logFamily)
                                .subscribeOn(Schedulers.boundedElastic())
                                .doOnSuccess(res -> Mono.fromRunnable(() -> stateMachine.sendEvent(Event.SUCCESS))
                                        .subscribeOn(Schedulers.boundedElastic())
                                        .subscribe()
                                )
                                .doOnError(error -> compensate(stateMachine, pointsDTO))
                                .thenReturn(response)
                                .doOnError(error -> compensateFamily(stateMachine, pointsDTO))
                                .subscribeOn(Schedulers.boundedElastic()));
    }

    private Mono<ResponseDTO> saveLogFamily(LogFamilyDTO logFamilyDTO) {
        if (logFamilyDTO.getReceivedByEmail().equals(logFamilyDTO.getPerformedByEmail())) {
            return Mono.just(new ResponseDTO(null, HttpStatus.OK, new ArrayList<>()));
        }
        return Mono.fromCallable(() -> stateMachineFactory.getStateMachine())
                .flatMap(stateMachine ->
                        webClientFamily.post()
                                .uri("/api/family/log")
                                .bodyValue(logFamilyDTO)
                                .retrieve()
                                .bodyToMono(ResponseDTO.class)
                                .subscribeOn(Schedulers.boundedElastic())
                );
    }


    public Mono<ResponseDTO> saveLog(LogActivityDTO logActivityDTO) {
        return Mono.fromCallable(() -> {
            StateMachine<State, Event> stateMachine = stateMachineFactory.getStateMachine();
            LogActivity sub = logActivityService.saveLogActivity(logActivityDTO);
            stateMachine.sendEvent(Event.LOG_FAMILY);
            return new ResponseDTO(LogActivityMapper.INSTANCE.toDTO(sub), HttpStatus.OK.value(), new ArrayList<>());
        });
    }

    private void compensate(StateMachine<State, Event> stateMachine, PointsDTO pointsDTO) {
        webClientPoint.post()
                .uri("/api/point/dati/standard/rollback")
                .bodyValue(pointsDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .flatMap(response -> {
                    // Puoi fare log o qualsiasi altra cosa con `response`
                    System.out.println("Rollback response: " + response);
                    return Mono.just(response);
                })
                .doOnSuccess(res -> stateMachine.sendEvent(Event.COMPENSATED))
                .doOnError(error -> {
                    // Logging error
                    System.err.println("Rollback failed: " + error.getMessage());
                })
                .subscribe(); // Avvia la catena reattiva
    }

    private void compensateFamily(StateMachine<State, Event> stateMachine, PointsDTO pointsDTO) {
        //compensate(stateMachine, pointsDTO);
        Mono.fromCallable(() -> {
                // CALL COMPENSATE FAMILY
                    stateMachine.sendEvent(Event.COMPENSATED_FAMILY);
                    return stateMachine;
                })
                .subscribeOn(Schedulers.boundedElastic());
    }
}
