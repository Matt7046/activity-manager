package com.registerService.processor;

import com.common.dto.user.UserPointDTO;
import com.common.dto.structure.ResponseDTO;
import com.registerService.service.UserWebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class RegisterSaveUserProcessor {
    @Autowired
    private UserWebService userWebService;

    public Mono<ResponseDTO> saveUserByPoints(UserPointDTO userPointDTO) {
        return userWebService.processUser(userPointDTO);
    }


}
