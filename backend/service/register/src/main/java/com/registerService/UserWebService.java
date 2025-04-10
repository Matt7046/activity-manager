package com.registerService;

import com.common.dto.UserPointDTO;
import com.common.dto.ResponseDTO;
import com.saveUserRegister.RegisterSaveUserProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UserWebService {

    @Autowired
    private RegisterSaveUserProcessor registerSaveUserProcessor;

    public Mono<ResponseDTO> saveUserByPoints(UserPointDTO userPointDTO) {
       return registerSaveUserProcessor.saveUserByPoints(userPointDTO);
    }
}
