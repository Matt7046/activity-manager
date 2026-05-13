package com.familyLogService.processor;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import com.common.configurations.structure.NotificationComponent;
import com.common.data.family.LogFamily;
import com.common.data.user.UserPoint;
import com.common.dto.family.LogFamilyDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.common.mapper.LogFamilyMapper;
import com.common.mapper.UserPointMapper;
import com.common.structure.exception.NotFoundException;
import com.common.structure.messages.NotFoundMessages;
import com.common.structure.status.ActivityHttpStatus;
import com.familyLogService.service.FamilyLogService;
import com.userPointService.service.UserPointAccessService;

import reactor.core.publisher.Mono;

@Component
public class FamilyLogProcessor {

    @Autowired
    private FamilyLogService familyLogService;
    @Autowired
    private LogFamilyMapper logFamilyMapper;
    @Autowired
    private UserPointMapper userPointMapper;
    @Autowired
    private NotificationComponent notificationComponent;
    @Autowired
    private UserPointAccessService userPointAccessService;
    @Autowired
    private NotFoundMessages notFoundMessages;

    @Value("${rabbitmq.exchange.name.point}")
    private String pointExchange;

    @Value("${rabbitmq.routingKey.point}")
    private String routingKeyPoint;

    public Mono<ResponseDTO> saveLogFamily(LogFamilyDTO logFamilyDTO) {
        return Mono.fromCallable(() -> {
            String actor = logFamilyDTO.getPerformedByEmail();
            userPointAccessService.requireSelf(actor, actor);
            userPointAccessService.requireCanAccess(actor, logFamilyDTO.getReceivedByEmail());
            try {
                LogFamily family = logFamilyMapper.fromDTO(logFamilyDTO);
                family = familyLogService.saveLogFamily(family);
                LogFamilyDTO logFamilyDTONew = logFamilyMapper.toDTO(family);
                return new ResponseDTO(logFamilyDTONew, ActivityHttpStatus.OK.value(), new ArrayList<>());
            } catch (Exception e) {
                notificationComponent.inviaNotifica(logFamilyDTO.getPoint(), pointExchange, routingKeyPoint);
                throw new NotFoundException(notFoundMessages.persistLogFamily());
            }
        });
    }

    public Mono<ResponseDTO> logFamilyByEmail(UserPointDTO userPointDTO, String principalEmail) {
        return Mono.fromCallable(() -> {
            userPointAccessService.requireCanAccess(principalEmail, userPointDTO.getEmail());
            int page = userPointDTO.getUnpaged() != null && userPointDTO.getUnpaged() ? 0 : userPointDTO.getPage();
            int size = userPointDTO.getUnpaged() != null && userPointDTO.getUnpaged() ? Integer.MAX_VALUE
                    : userPointDTO.getSize();
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc(userPointDTO.getField())));
            UserPoint userPoint = userPointMapper.fromDTO(userPointDTO);
            List<LogFamily> familyList = familyLogService.getLogFamily(userPoint, pageable);
            List<LogFamilyDTO> logFamilyDTOList = familyList.stream().map(logFamilyMapper::toDTO)
                    .collect(Collectors.toList());
            return new ResponseDTO(logFamilyDTOList, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }
}
