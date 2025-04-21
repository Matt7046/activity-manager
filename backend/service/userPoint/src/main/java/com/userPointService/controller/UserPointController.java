package com.userPointService.controller;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.dto.user.UserPointDTO;
import com.common.dto.structure.ResponseDTO;
import com.userPointService.processor.UserPointProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/userpoint")
public class UserPointController {
    @Autowired
    private UserPointProcessor processor;

    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;

    @Value("${error.document.notFound}")
    private String errorDocument;

    @Value("${error.document.points}")
    private String message;


    @PostMapping("find")
    public Mono<ResponseDTO> findByEmail(@RequestBody UserPointDTO userPointDTO)  {
        return processor.findByEmail(userPointDTO);

    }

    @PostMapping("child")
    public Mono<ResponseDTO> getEmailChild(@RequestBody UserPointDTO userPointDTO) {
        return processor.getEmailChild(userPointDTO);
    }

    @PostMapping("/dati")
    public Mono<ResponseDTO> getTypeUser(@RequestBody UserPointDTO userPointDTO)  {
        return processor.getTypeUser(userPointDTO);
    }

    @PostMapping("/dati/user")
    public Mono<ResponseDTO> saveUser(@RequestBody UserPointDTO userPointDTO) {
        return processor.saveUser(userPointDTO);
    }


    @PostMapping("/dati/user/operation")
    public Mono<ResponseDTO> savePoints(@RequestBody UserPointDTO userPointDTO) {
        return processor.savePoints(userPointDTO);

    }

    @PostMapping("/dati/user/image")
    public Mono<ResponseDTO> saveUserImage(@RequestBody UserPointDTO userPointDTO)  {
        return processor.saveUserImage(userPointDTO);
    }

}
