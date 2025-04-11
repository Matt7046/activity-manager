package com.activityBusinessLogic.savePoints;

import com.common.configurations.RabbitMQProducer;
import com.common.data.OperationTypeLogFamily;
import com.common.dto.*;
import com.common.dto.UserPointDTO;
import com.common.exception.ActivityHttpStatus;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.logActivityService.LogActivityService;
import com.common.data.LogActivity;
import com.common.mapper.LogActivityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
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
    private LogActivityService logActivityService;
    @Value("${app.rabbitmq.exchange.point.exchangeName}")
    private String exchange;
    @Value("${app.rabbitmq.exchange.point.routingKey.logActivity}")
    private String routingKeyLogActivity;
    @Value("${app.rabbitmq.exchange.point.routingKey.logFamily}")
    private String routingKeyLogFamily;
    @Autowired
    private RabbitMQProducer notificationPublisher;


    public Mono<ResponseDTO> savePoints(LogActivityDTO logActivityDTO) {
        return processPoints(logActivityDTO);
    }

    private Mono<ResponseDTO> processPoints(LogActivityDTO logActivityDTO) {
        UserPointDTO userPointDTO = new UserPointDTO(logActivityDTO);
        userPointDTO.setOperation(false);
        LogFamilyDTO logFamilyDTO = new LogFamilyDTO();
        logFamilyDTO.setOperations(OperationTypeLogFamily.OPERATIVE);
        logFamilyDTO.setDate(new Date());
        logFamilyDTO.setPerformedByEmail(logActivityDTO.getEmailUserCurrent());
        logFamilyDTO.setReceivedByEmail(logActivityDTO.getEmail());
        return webClientPoint.post()
                .uri("/api/point/dati/standard")
                .bodyValue(userPointDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .flatMap(response ->
                        saveLog(userPointDTO, logActivityDTO)
                )
                .subscribeOn(Schedulers.boundedElastic())
                .flatMap(response -> {
                    logFamilyDTO.setPoint(userPointDTO);
                    return saveLogFamily(response, logFamilyDTO)
                            .subscribeOn(Schedulers.boundedElastic());
                });
    }

    public Mono<ResponseDTO> saveLog(UserPointDTO point, LogActivityDTO logActivityDTO) {
        logActivityDTO.setPoint(point);
        return Mono.fromCallable(() -> {
            LogActivity sub = logActivityService.saveLogActivity(logActivityDTO);
            return new ResponseDTO(LogActivityMapper.INSTANCE.toDTO(sub), ActivityHttpStatus.OK.value(), new ArrayList<>());
        }).doOnError(response1 -> {
            // Invia l'evento dopo il salvataggio del log in modo asincrono
            Mono.fromRunnable(() -> {
                inviaNotifica(logActivityDTO.getPoint(), routingKeyLogActivity);
            }).subscribe();  // Avvia il runnable senza bloccare il flusso
        });
    }

    private Mono<ResponseDTO> saveLogFamily(ResponseDTO response, LogFamilyDTO logFamilyDTO) {
        if (logFamilyDTO.getReceivedByEmail().equals(logFamilyDTO.getPerformedByEmail())) {
            return Mono.just(new ResponseDTO(logFamilyDTO, ActivityHttpStatus.OK.value(), new ArrayList<>()));
        }
        StringBuilder builder = new StringBuilder();
        return webClientFamily.post()
                .uri("/api/family/log")
                .bodyValue(logFamilyDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .doOnSuccess(response1 -> {
                    // Azioni con la response
                    if (!response1.getErrors().isEmpty()) {
                        inviaNotifica(logFamilyDTO.getPoint(), routingKeyLogActivity);
                        ObjectMapper mapper = new ObjectMapper();
                        LogActivityDTO dto = mapper.convertValue(response.getJsonText(), LogActivityDTO.class);
                        logActivityService.deleteLogActivity(dto);
                    }
                })
                .subscribeOn(Schedulers.boundedElastic());
    }

    private void inviaNotifica(InterfaceDTO dto, String routingKey) {
        try {
            String jsonMessage = new ObjectMapper().writeValueAsString(dto);
            notificationPublisher.sendMessage(exchange, routingKey, jsonMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

}
