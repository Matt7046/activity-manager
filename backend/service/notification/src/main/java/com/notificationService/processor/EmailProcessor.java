package com.notificationService.processor;

import com.common.data.user.UserPoint;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.common.dto.user.UserPointWithChildDTO;
import com.common.mapper.UserPointMapper;
import com.common.structure.status.ActivityHttpStatus;
import com.notificationService.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class EmailProcessor {

    @Autowired
    private EmailService emailService;
    @Autowired
    private UserPointMapper userPointMapper;


    public Mono<ResponseDTO> sendPasswordEmailChild(UserPointWithChildDTO userPointDTO) throws Exception {
        UserPoint userPoint = userPointMapper.fromDTO(userPointDTO.getUserPoint());
        List<UserPoint> userChild =  userPointDTO.getUserPointChild().stream().map(userPointMapper::fromDTO).collect(Collectors.toList());
        userPoint = emailService.sendPasswordEmailChild(userPoint,userChild);
        UserPointDTO response = userPointMapper.toDTO(userPoint);
        return Mono.just(new ResponseDTO(response, ActivityHttpStatus.OK.value(), new ArrayList<>()));
    }
}
