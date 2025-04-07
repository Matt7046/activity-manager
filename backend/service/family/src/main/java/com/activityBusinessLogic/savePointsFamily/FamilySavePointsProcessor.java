package com.activityBusinessLogic.savePointsFamily;

import com.activityService.FamilyService;
import com.common.configurations.RabbitMQProducer;
import com.common.dto.*;
import com.common.transversal.PointsUser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.config.StateMachineFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class FamilySavePointsProcessor {

    @Autowired
    @Qualifier("webClientPoints")
    private WebClient webClientPoints;
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

        return webClientPoints.post()
                .uri("/api/points/dati/standard")
                .bodyValue(pointsDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .flatMap(responseDTO -> Mono.fromCallable(() -> {
                            PointsDTO subDTO = new ObjectMapper().convertValue(responseDTO.jsonText(), PointsDTO.class);
                            List<PointsUser> filteredList = subDTO.getPoints().stream()
                                    .filter(point -> email.equals(point.getEmail()))
                                    .collect(Collectors.toList());

                            inviaNotifica(pointsDTO);
                            return familyService.savePointsByFamily(filteredList, subDTO);
                        })
                        .subscribeOn(Schedulers.boundedElastic()))
                .doOnSuccess(res -> stateMachine.sendEvent(Event.SUCCESS))
                .doOnError(error -> stateMachine.sendEvent(Event.ERROR));
    }


    private void inviaNotifica(PointsDTO pointsDTO) {
        StringBuilder builder = new StringBuilder(pointsDTO.getUsePoints().toString());
        String message = pointsDTO.getUsePoints() < 0L ? messageRemove : messageAdd;
        builder.append(message).append(pointsDTO.getEmail());
        FamilyNotificationDTO dto = new FamilyNotificationDTO(builder.toString());
        dto.setEmailFamily(pointsDTO.getEmailFamily());
        dto.setEmail(pointsDTO.getEmail());
        dto.setServiceName(serviceName);
        dto.setEmailUserReceive(pointsDTO.getEmailFamily());
        dto.setMessage(dto.getPointsNew());
        try {
            String jsonMessage = new ObjectMapper().writeValueAsString(dto);
            notificationPublisher.sendMessage(exchange, routingKey, jsonMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
