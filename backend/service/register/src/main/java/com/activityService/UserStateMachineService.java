package com.activityService;

import com.common.dto.PointsDTO;
import com.common.dto.ResponseDTO;
import com.saveUserRegister.RegisterSaveUserProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UserStateMachineService {

    @Autowired
    private RegisterSaveUserProcessor registerSaveUserProcessor;

    public Mono<ResponseDTO> saveUserByPoints(PointsDTO pointsDTO) {
       return registerSaveUserProcessor.saveUserByPoints(pointsDTO);
    }
}
