package com.activityBusinessLogic.savePointsFamily;

import com.common.data.OperationTypeLogFamily;
import com.familyService.FamilyService;
import com.common.configurations.RabbitMQProducer;
import com.common.dto.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.config.StateMachineFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.ArrayList;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class FamilySavePointsProcessor {

    @Autowired
    @Qualifier("webClientPoint")
    private WebClient webClientPoint;
    ;
    @Autowired
    private RabbitMQProducer notificationPublisher;
    @Autowired
    private FamilyService familyService;

    @Value("${app.rabbitmq.exchange}")
    private String exchange;

    @Value("${app.rabbitmq.routingKey}")
    private String routingKey;

    @Value("${message.document.add}")
    private String messageAdd;

    @Value("${message.document.remove}")
    private String messageRemove;

    @Value("${notification.service}")
    private String serviceName;


    private final StateMachineFactory<State, Event> stateMachineFactory;

    public FamilySavePointsProcessor(StateMachineFactory<State, Event> stateMachineFactory) {
        this.stateMachineFactory = stateMachineFactory;
    }

    public Mono<ResponseDTO> savePointsByFamily(PointsDTO pointsDTO) {
        return Mono.fromCallable(() -> {
                    StateMachine<State, Event> stateMachine = stateMachineFactory.getStateMachine();
                    stateMachine.start();
                    stateMachine.sendEvent(Event.PROCESS_POINTS);
                    return stateMachine;
                })
                .subscribeOn(Schedulers.boundedElastic())  // ✅ Esegui in un thread separato
                .flatMap(stateMachine -> processPoints(stateMachine, pointsDTO));
    }

    private Mono<ResponseDTO> processPoints(StateMachine<State, Event> stateMachine, PointsDTO pointsDTO) {
        String email = pointsDTO.getEmailFamily();
        pointsDTO.setOperation(true);

        return webClientPoint.post()
                .uri("/api/point/dati/standard")
                .bodyValue(pointsDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .flatMap(responseDTO -> Mono.fromCallable(() -> {
                    PointsDTO subDTO = new ObjectMapper().convertValue(responseDTO.jsonText(), PointsDTO.class);
                    return subDTO.getPoints().stream()
                            .filter(point -> email.equals(point.getEmail()))
                            .collect(Collectors.toList());
                }).subscribeOn(Schedulers.boundedElastic()))
                .flatMap(filteredList -> {
                    inviaNotifica(pointsDTO);
                   Mono<ResponseDTO> result =  saveLog(createLogFamily(pointsDTO));
                    saveLogEvent();
                    return result;
                })
                .doOnSuccess(res -> stateMachine.sendEvent(Event.SUCCESS))
                .doOnError(error -> compensate(stateMachine, pointsDTO));
    }

    private LogFamilyDTO createLogFamily(PointsDTO pointsDTO) {
        LogFamilyDTO dto = new LogFamilyDTO();
        dto.setDate(new Date());
        OperationTypeLogFamily operations = pointsDTO.getUsePoints() < 0L ? OperationTypeLogFamily.FAMILY_REMOVE : OperationTypeLogFamily.FAMILY_ADD;
        dto.setOperations(operations);
        dto.setPerformedByEmail(pointsDTO.getEmailUserCurrent());
        dto.setReceivedByEmail(pointsDTO.getEmailFamily());
        return dto;
    }

    public Mono<ResponseDTO> saveLog(LogFamilyDTO logFamilyDTO) {
        return Mono.fromCallable(() -> {
            StateMachine<State, Event> stateMachine = stateMachineFactory.getStateMachine();
            ResponseDTO sub = familyService.saveLogFamily(logFamilyDTO);
            return sub;
        });
    }
    public Mono<ResponseDTO> saveLogEvent() {
        return Mono.fromCallable(() -> {
            StateMachine<State, Event> stateMachine = stateMachineFactory.getStateMachine();
            stateMachine.sendEvent(Event.SUCCESS);
            return new ResponseDTO(Event.SUCCESS, HttpStatus.OK, new ArrayList<>()) ;
        });
    }



    private void inviaNotifica(PointsDTO pointsDTO) {
        StringBuilder builder = new StringBuilder(pointsDTO.getUsePoints().toString());
        String message = pointsDTO.getUsePoints() < 0L ? messageRemove : messageAdd;
        builder.append(message).append(pointsDTO.getEmail());
        FamilyNotificationDTO dto = new FamilyNotificationDTO(builder.toString());
        dto.setServiceName(serviceName);
        dto.setUserReceiver(pointsDTO.getEmailFamily());
        dto.setUserSender(pointsDTO.getEmailUserCurrent());
        dto.setMessage(dto.getPointsNew());
        dto.setDateSender(new Date());
        try {
            String jsonMessage = new ObjectMapper().writeValueAsString(dto);
            notificationPublisher.sendMessage(exchange, routingKey, jsonMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
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
