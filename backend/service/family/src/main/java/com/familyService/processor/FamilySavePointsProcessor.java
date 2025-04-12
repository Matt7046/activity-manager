package com.familyService.processor;

import com.common.configurations.NotificationComponent;
import com.common.data.OperationTypeLogFamily;
import com.common.dto.LogFamilyDTO;
import com.common.dto.ResponseDTO;
import com.common.dto.UserPointDTO;
import com.common.dto.FamilyNotificationDTO;
import com.common.exception.ActivityHttpStatus;
import com.common.exception.NotFoundException;
import com.common.authDTO.PointsUser;
import com.familyService.service.FamilyService;
import com.common.configurations.RabbitMQProducer;

import com.fasterxml.jackson.databind.ObjectMapper;
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
public class FamilySavePointsProcessor {

    @Autowired
    @Qualifier("webClientPoint")
    private WebClient webClientPoint;
    ;
    @Autowired
    private RabbitMQProducer notificationPublisher;
    @Autowired
    private FamilyService familyService;
    @Autowired
    private NotificationComponent notificationComponent;
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

    public Mono<ResponseDTO> savePointsByFamily(UserPointDTO userPointDTO) {

        return processPoints(userPointDTO);

    }

    private Mono<ResponseDTO> processPoints(UserPointDTO userPointDTO) {
        String email = userPointDTO.getEmailFamily();
        userPointDTO.setOperation(true);

        return webClientPoint.post()
                .uri("/api/point/dati/standard")
                .bodyValue(userPointDTO)
                .retrieve()
                .bodyToMono(ResponseDTO.class)
                .flatMap(responseDTO -> Mono.fromCallable(() -> {
                    UserPointDTO subDTO = new ObjectMapper().convertValue(responseDTO.getJsonText(), UserPointDTO.class);
                    return subDTO.getPoints().stream()
                            .filter(point -> email.equals(point.getEmail()))
                            .findFirst();
                }).subscribeOn(Schedulers.boundedElastic()))
                .flatMap(pointsUserOptional -> {
                    saveLogFamily(createLogFamily(userPointDTO));
                    inviaNotifica(userPointDTO);
                    PointsUser point = pointsUserOptional.orElse(null);
                    return Mono.just((new ResponseDTO(point, ActivityHttpStatus.OK.value(), new ArrayList<>())));
                });
    }

    private LogFamilyDTO createLogFamily(UserPointDTO userPointDTO) {
        LogFamilyDTO dto = new LogFamilyDTO();
        dto.setDate(new Date());
        OperationTypeLogFamily operations = userPointDTO.getUsePoints() < 0L ? OperationTypeLogFamily.FAMILY_REMOVE : OperationTypeLogFamily.FAMILY_ADD;
        dto.setOperations(operations);
        dto.setPerformedByEmail(userPointDTO.getEmailUserCurrent());
        dto.setReceivedByEmail(userPointDTO.getEmailFamily());
        dto.setPoint(userPointDTO);
        return dto;
    }

    public Mono<ResponseDTO> saveLogFamily(LogFamilyDTO logFamilyDTO) {

            ResponseDTO sub = null;
            try {
                sub = familyService.saveLogFamily(logFamilyDTO);
            } catch (Exception e) {
                notificationComponent.inviaNotifica(logFamilyDTO.getPoint(),pointExchange, pointRoutingKey);
                throw new NotFoundException(e.getMessage());
            }
            return Mono.just(sub);
    }

    private void inviaNotifica(UserPointDTO userPointDTO) {
        FamilyNotificationDTO dto = getFamilyNotificationDTO(userPointDTO);
        notificationComponent.inviaNotifica(dto,notificationExchange,notificationRoutingKey);
    }

    private FamilyNotificationDTO getFamilyNotificationDTO(UserPointDTO userPointDTO) {
        StringBuilder builder = new StringBuilder(userPointDTO.getUsePoints().toString());
        String message = userPointDTO.getUsePoints() < 0L ? messageRemove : messageAdd;
        builder.append(message).append(userPointDTO.getEmail());
        FamilyNotificationDTO dto = new FamilyNotificationDTO(builder.toString());
        dto.setServiceName(serviceName);
        dto.setUserReceiver(userPointDTO.getEmailFamily());
        dto.setUserSender(userPointDTO.getEmailUserCurrent());
        dto.setMessage(dto.getPointsNew());
        dto.setDateSender(new Date());
        return dto;
    }
}
