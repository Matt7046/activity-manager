package com.familyPointService.processor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.common.configurations.structure.NotificationComponent;
import com.common.data.family.LogFamily;
import com.common.data.family.OperationTypeLogFamily;
import com.userPointService.dto.family.FamilyNotificationDTO;
import com.userPointService.dto.family.LogFamilyDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.common.dto.user.UserPointWithChildDTO;
import com.userPointService.mapper.LogFamilyMapper;
import com.common.structure.exception.NotFoundException;
import com.common.structure.messages.NotFoundMessages;
import com.common.structure.status.ActivityHttpStatus;
import com.familyLogService.service.FamilyLogService;
import com.userPointService.processor.UserPointProcessor;

import reactor.core.publisher.Mono;

@Component
public class FamilyPointsProcessor {

    @Autowired
    private UserPointProcessor userPointProcessor;
    @Autowired
    private FamilyLogService familyLogService;
    @Autowired
    private LogFamilyMapper logFamilyMapper;
    @Autowired
    private NotificationComponent notificationComponent;
    @Autowired
    private NotFoundMessages notFoundMessages;

    @Value("${rabbitmq.exchange.name.notification}")
    private String notificationExchange;

    @Value("${rabbitmq.routingKey.notification}")
    private String routingKeyNotification;

    @Value("${message.document.add}")
    private String messageAdd;

    @Value("${message.document.remove}")
    private String messageRemove;

    @Value("${notification.service}")
    private String serviceName;

    @Value("${rabbitmq.exchange.name.point}")
    private String pointExchange;

    @Value("${rabbitmq.routingKey.point}")
    private String routingKeyPoint;

    public Mono<ResponseDTO> savePointsByFamily(UserPointDTO userPointDTO) {
        userPointDTO.setOperation(true);
        return userPointProcessor.savePoints(userPointDTO, userPointDTO.getEmailUserCurrent())
                .flatMap(responseDTO -> {
                    persistLogFamilyFromUserPoint(userPointDTO);
                    inviaNotifica(userPointDTO);
                    return Mono.just(responseDTO);
                });
    }

    private void persistLogFamilyFromUserPoint(UserPointDTO userPointDTO) {
        LogFamilyDTO logFamilyDTO = createLogFamily(userPointDTO);
        try {
            LogFamily family = logFamilyMapper.fromDTO(logFamilyDTO);
            familyLogService.saveLogFamily(family);
        } catch (Exception e) {
            notificationComponent.inviaNotifica(logFamilyDTO.getPoint(), pointExchange, routingKeyPoint);
            throw new NotFoundException(notFoundMessages.persistLogFamily());
        }
    }

    private LogFamilyDTO createLogFamily(UserPointDTO userPointDTO) {
        LogFamilyDTO dto = new LogFamilyDTO();
        dto.setDate(new Date());
        OperationTypeLogFamily operations = userPointDTO.getUsePoints() < 0L ? OperationTypeLogFamily.FAMILY_REMOVE
                : OperationTypeLogFamily.FAMILY_ADD;
        dto.setOperations(operations);
        dto.setPerformedByEmail(userPointDTO.getEmailUserCurrent());
        dto.setReceivedByEmail(userPointDTO.getEmail());
        dto.setPoint(userPointDTO);
        dto.setUsePoints(userPointDTO.getUsePoints());
        return dto;
    }

    private FamilyNotificationDTO getFamilyNotificationDTO(UserPointDTO userPointDTO) {
        StringBuilder builder = new StringBuilder(userPointDTO.getUsePoints().toString());
        String message = userPointDTO.getUsePoints() < 0L ? messageRemove : messageAdd;
        builder.append(message).append(userPointDTO.getEmailUserCurrent());
        FamilyNotificationDTO dto = new FamilyNotificationDTO(builder.toString());
        dto.setServiceName(serviceName);
        dto.setUserReceiver(userPointDTO.getEmail());
        dto.setUserSender(userPointDTO.getEmailUserCurrent());
        dto.setMessage(dto.getPointsNew());
        dto.setDateSender(new Date());
        return dto;
    }

    private void inviaNotifica(UserPointDTO userPointDTO) {
        FamilyNotificationDTO dto = getFamilyNotificationDTO(userPointDTO);
        notificationComponent.inviaNotifica(dto, notificationExchange, routingKeyNotification);
    }

    public Mono<ResponseDTO> updateChildByEmail(UserPointWithChildDTO userPoint) {
        return userPointProcessor.updateChildByEmail(userPoint, userPoint.getUserPoint().getEmailUserCurrent());
    }
}
