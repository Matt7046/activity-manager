package com.familyService.processor;

import com.common.configurations.structure.NotificationComponent;
import com.common.data.family.LogFamily;
import com.common.data.family.OperationTypeLogFamily;
import com.common.data.user.UserPoint;
import com.common.dto.family.LogFamilyDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.PointDTO;
import com.common.dto.user.UserPointDTO;
import com.common.dto.family.FamilyNotificationDTO;
import com.common.mapper.LogFamilyMapper;
import com.common.mapper.UserPointMapper;
import com.common.structure.status.ActivityHttpStatus;
import com.common.structure.exception.NotFoundException;
import com.familyService.service.FamilyService;
import com.common.configurations.rabbitmq.RabbitMQProducer;
import com.familyService.service.FamilyWebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class FamilyPointsProcessor {

    @Autowired
    private FamilyWebService familyWebService;
    @Autowired
    private RabbitMQProducer notificationPublisher;
    @Autowired
    private FamilyService familyService;
    @Autowired
    private LogFamilyMapper logFamilyMapper;
    @Autowired
    private UserPointMapper userPointMapper;
    @Autowired
    private NotificationComponent notificationComponent;

    private String exchangeName;

    @Value("${rabbitmq.exchange.name.notification}")
    private String notificationExchange;

    @Value("${rabbitmq.exchange.routingKey.notification}")
    private String routingKeyNotification;

    @Value("${rabbitmq.exchange.name.point}")
    private String pointExchange;

    @Value("${rabbitmq.exchange.routingKey.point}")
    private String routingKeyPoint;

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
        userPointDTO.setOperation(true);
        return familyWebService.savePointsByFamily(userPointDTO)
                .flatMap(userPoint -> {
                    saveLogFamily(createLogFamily(userPointDTO));
                    inviaNotifica(userPointDTO);
                    return Mono.just((new ResponseDTO(userPoint, ActivityHttpStatus.OK.value(), new ArrayList<>())));
                });
    }

    public Mono<ResponseDTO> saveLogFamily(LogFamilyDTO logFamilyDTO) {
        try {
            LogFamily family = logFamilyMapper.fromDTO(logFamilyDTO);
            family = familyService.saveLogFamily(family);
            logFamilyDTO = logFamilyMapper.toDTO(family);
            ResponseDTO response = new ResponseDTO(logFamilyDTO, ActivityHttpStatus.OK.value(),
                    new ArrayList<>());
            return Mono.just(response);
        } catch (Exception e) {
            notificationComponent.inviaNotifica(logFamilyDTO.getPoint(), pointExchange, routingKeyPoint);
            throw new NotFoundException(e.getMessage());
        }
    }

    public Mono<ResponseDTO> logFamilyByEmail(UserPointDTO userPointDTO) throws Exception {
        Integer page = userPointDTO.getUnpaged() != null && userPointDTO.getUnpaged() ? 0 : userPointDTO.getPage();
        Integer size = userPointDTO.getUnpaged() != null && userPointDTO.getUnpaged() ? Integer.MAX_VALUE : userPointDTO.getSize();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc(userPointDTO.getField())));
        UserPoint userPoint = userPointMapper.fromDTO(userPointDTO);
        List<LogFamily> familyList = familyService.getLogFamily(userPoint, pageable);
        List<LogFamilyDTO> logFamilyDTOList = familyList.stream()
                .map(logFamilyMapper::toDTO).collect(Collectors.toList());
        ResponseDTO response = new ResponseDTO(logFamilyDTOList, ActivityHttpStatus.OK.value(),
                new ArrayList<>());
        return Mono.just(response);
    }

    private LogFamilyDTO createLogFamily(UserPointDTO userPointDTO) {
        LogFamilyDTO dto = new LogFamilyDTO();
        dto.setDate(new Date());
        OperationTypeLogFamily operations = userPointDTO.getUsePoints() < 0L ? OperationTypeLogFamily.FAMILY_REMOVE : OperationTypeLogFamily.FAMILY_ADD;
        dto.setOperations(operations);
        dto.setPerformedByEmail(userPointDTO.getEmailUserCurrent());
        dto.setReceivedByEmail(userPointDTO.getEmail());
        dto.setPoint(userPointDTO);
        return dto;
    }
    private FamilyNotificationDTO getFamilyNotificationDTO(UserPointDTO userPointDTO) {
        StringBuilder builder = new StringBuilder(userPointDTO.getUsePoints().toString());
        String message = userPointDTO.getUsePoints() < 0L ? messageRemove : messageAdd;
        builder.append(message).append(userPointDTO.getEmail());
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


}
