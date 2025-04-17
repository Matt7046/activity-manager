package com.familyService.processor;

import com.common.configurations.structure.NotificationComponent;
import com.common.data.family.OperationTypeLogFamily;
import com.common.dto.auth.Point;
import com.common.dto.family.LogFamilyDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.PointDTO;
import com.common.dto.user.UserPointDTO;
import com.common.dto.family.FamilyNotificationDTO;
import com.common.structure.status.ActivityHttpStatus;
import com.common.structure.exception.NotFoundException;
import com.familyService.service.FamilyService;
import com.common.configurations.rabbitmq.RabbitMQProducer;
import com.familyService.service.FamilyWebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import java.util.ArrayList;
import java.util.Date;

@Component
public class FamilyPointsProcessor {

    @Autowired
    private FamilyWebService familyWebService;
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
        return familyWebService.savePointsByFamily(userPointDTO)
                .flatMap(pointsUserOptional -> {
                    saveLogFamily(createLogFamily(userPointDTO));
                    inviaNotifica(userPointDTO);
                    PointDTO point = pointsUserOptional.orElse(null);
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

    public  Mono<ResponseDTO> logFamilyByEmail(UserPointDTO userPointDTO, Sort sort) {
        return  Mono.just(familyService.getLogFamily(userPointDTO, sort));
    }
}
