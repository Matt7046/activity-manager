package com.authService.processor;

import com.authService.service.UserWebService;
import com.common.dto.user.UserPointDTO;
import com.common.dto.structure.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class UserAuthPointsProcessor {

    @Autowired
    UserWebService userWebService;

    public Mono<ResponseDTO> getUserType(UserPointDTO userPointDTO) {
        return  userWebService.processUser(userPointDTO);
    }
}
