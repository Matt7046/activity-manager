package com.notificationService.processor;

import com.common.data.user.UserPoint;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.common.mapper.UserPointMapper;
import com.common.structure.status.ActivityHttpStatus;
import com.notificationService.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class EmailProcessor {

    @Autowired
    private EmailService emailService;
    @Autowired
    private UserPointMapper userPointMapper;


    public Mono<ResponseDTO> sendPasswordEmailChild(UserPointDTO userPointDTO) throws Exception {
        UserPoint userPoint = userPointMapper.fromDTO(userPointDTO);

        userPoint = emailService.sendPasswordEmailChild(userPoint);
        UserPointDTO response = userPointMapper.toDTO(userPoint);
        return Mono.just(new ResponseDTO(response, ActivityHttpStatus.OK.value(), new ArrayList<>()));
    }
}
