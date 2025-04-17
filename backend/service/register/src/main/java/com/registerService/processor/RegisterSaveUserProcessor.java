package com.registerService.processor;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.dto.user.PointDTO;
import com.common.dto.user.UserPointDTO;
import com.common.dto.structure.ResponseDTO;
import com.registerService.service.UserWebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RegisterSaveUserProcessor {
    @Autowired
    private UserWebService userWebService;

    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;

    public Mono<ResponseDTO> saveUserByPoints(UserPointDTO userPointDTO) {
        List<PointDTO> updatedPoints = userPointDTO.getPoints().stream().map(x->{
            x.setEmail(encryptDecryptConverter.convert(x.getEmail()));
            return x;
        }).collect(Collectors.toList());
        userPointDTO.setPoints(updatedPoints);
        return userWebService.processUser(userPointDTO);
    }


}
