package com.activityBusinessLogic.savePointsFamily;

import com.common.data.OperationTypeLogFamily;
import com.common.exception.NotFoundException;
import com.familyService.FamilyService;
import com.common.configurations.RabbitMQProducer;
import com.common.dto.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import java.util.ArrayList;
import java.util.Date;

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

    @Value("${app.rabbitmq.notification.exchange.exchangeName}")
    private String notificationExchange;

    @Value("${app.rabbitmq.notification.exchange.routingKey}")
    private String notificationRoutingKey;

    @Value("${app.rabbitmq.point.exchange.exchangeName}")
    private String pointExchange;

    @Value("${app.rabbitmq.point.exchange.routingKey}")
    private String pointRoutingKey;

    @Value("${message.document.add}")
    private String messageAdd;

    @Value("${message.document.remove}")
    private String messageRemove;

    @Value("${notification.service}")
    private String serviceName;

    public Mono<ResponseDTO> savePointsByFamily(PointsDTO pointsDTO) {

        return processPoints(pointsDTO);

    }

    private Mono<ResponseDTO> processPoints(PointsDTO pointsDTO) {
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
                            .findFirst();
                }).subscribeOn(Schedulers.boundedElastic()))
                .flatMap(point -> {
                    saveLogFamily(createLogFamily(pointsDTO));
                    inviaNotifica(pointsDTO);
                    return Mono.just((new ResponseDTO(point,HttpStatus.OK.value(), new ArrayList<>())));
                });
    }

    private LogFamilyDTO createLogFamily(PointsDTO pointsDTO) {
        LogFamilyDTO dto = new LogFamilyDTO();
        dto.setDate(new Date());
        OperationTypeLogFamily operations = pointsDTO.getUsePoints() < 0L ? OperationTypeLogFamily.FAMILY_REMOVE : OperationTypeLogFamily.FAMILY_ADD;
        dto.setOperations(operations);
        dto.setPerformedByEmail(pointsDTO.getEmailUserCurrent());
        dto.setReceivedByEmail(pointsDTO.getEmailFamily());
        dto.setPoint(pointsDTO);
        return dto;
    }

    public Mono<ResponseDTO> saveLogFamily(LogFamilyDTO logFamilyDTO) {

            ResponseDTO sub = null;
            try {
                sub = familyService.saveLogFamily(logFamilyDTO);
            } catch (Exception e) {
                inviaNotifica(logFamilyDTO.getPoint(), pointRoutingKey);
                throw new NotFoundException(e.getMessage());
            }
            return Mono.just(sub);

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
            notificationPublisher.sendMessage(notificationExchange, notificationRoutingKey, jsonMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private void inviaNotifica(InterfaceDTO dto, String routingKey) {
        try {
            String jsonMessage = new ObjectMapper().writeValueAsString(dto);
            notificationPublisher.sendMessage(pointExchange, routingKey, jsonMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

}
