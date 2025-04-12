package com.authService.service;

import com.common.dto.UserPointDTO;
import com.common.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import com.authService.processor.UserAuthPointsProcessor;

@Service
public class UserWebService {

    @Autowired
    private UserAuthPointsProcessor userAuthPointsProcessor;

    public Mono<ResponseDTO> getUserType(UserPointDTO userPointDTO) {
       return userAuthPointsProcessor.getUserType(userPointDTO);
    }
}
