package com.authService;

import com.common.dto.PointsDTO;
import com.common.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import com.userAuth.UserAuthPointsProcessor;

@Service
public class UserStateMachineService {

    @Autowired
    private UserAuthPointsProcessor userAuthPointsProcessor;

    public Mono<ResponseDTO> getUserType(PointsDTO pointsDTO) {
       return userAuthPointsProcessor.getUserType(pointsDTO);
    }
}
