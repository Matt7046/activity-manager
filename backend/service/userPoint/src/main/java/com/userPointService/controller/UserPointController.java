package com.userPointService.controller;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.user.UserPoint;
import com.common.dto.auth.Point;
import com.common.dto.user.PointDTO;
import com.common.dto.user.PointRDTO;
import com.common.dto.user.UserPointDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserDTO;
import com.common.structure.status.ActivityHttpStatus;
import com.common.structure.exception.NotFoundException;
import com.common.mapper.UserPointMapper;
import com.userPointService.processor.UserPointProcessor;
import com.userPointService.service.UserPointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Optional;

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
    public Mono<ResponseDTO> findByEmail(@RequestBody UserPointDTO userPointDTO) throws Exception {
        return processor.findByEmail(userPointDTO);

    }

    @PostMapping("child")
    public Mono<ResponseDTO> getEmailChild(@RequestBody UserPointDTO userPointDTO) throws Exception {
        return processor.getEmailChild(userPointDTO);
    }

    @PostMapping("/dati")
    public Mono<ResponseDTO> getUserType(@RequestBody UserPointDTO userPointDTO) throws Exception {
        return processor.getUserType(userPointDTO);
    }

    @PostMapping("/dati/user")
    public Mono<ResponseDTO> saveUser(@RequestBody UserPointDTO userPointDTO) {
        return processor.saveUser(userPointDTO);
    }


    @PostMapping("/dati/user/operation")
    public Mono<ResponseDTO> savePoints(@RequestBody UserPointDTO userPointDTO) throws Exception {
        return processor.savePoints(userPointDTO);

    }

    @PostMapping("/dati/user/image")
    public Mono<ResponseDTO> saveUserImage(@RequestBody UserPointDTO userPointDTO) throws Exception {
        return processor.saveUserImage(userPointDTO);
    }

}
