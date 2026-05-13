package com.userPointService.controller;

import com.common.dto.user.UserPointDTO;
import com.common.dto.user.UserPointWithChildDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.security.ReactiveJwt;
import com.userPointService.processor.UserPointProcessor;
import org.springframework.beans.factory.annotation.Autowired;
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
    private ReactiveJwt reactiveJwt;

    @PostMapping("find")
    public Mono<ResponseDTO> findByEmail(@RequestBody UserPointDTO userPointDTO) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> processor.findByEmail(userPointDTO, principal));
    }

    @PostMapping("child")
    public Mono<ResponseDTO> getEmailChild(@RequestBody UserPointDTO userPointDTO) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> processor.getEmailChild(userPointDTO, principal));
    }

    @PostMapping("/dati")
    public Mono<ResponseDTO> getTypeUser(@RequestBody UserPointDTO userPointDTO) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> processor.getTypeUser(userPointDTO, principal));
    }

    @PostMapping("/dati/user")
    public Mono<ResponseDTO> registerUser(@RequestBody UserPointDTO userPointDTO) {
        return processor.register(userPointDTO);
    }

    
      @PostMapping("/dati/user/reset/password")
    public Mono<ResponseDTO> resetPassword(@RequestBody UserPointDTO userPointDTO) {
        return processor.resetPassword(userPointDTO);
    }

    @PostMapping("/dati/user/password")
    public Mono<ResponseDTO> saveUserPassword(@RequestBody UserPointDTO userPointDTO) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> processor.saveUserPassword(userPointDTO, principal));
    }

    @PostMapping("/dati/login")
    public Mono<ResponseDTO> login(@RequestBody UserPointDTO userPointDTO) {
        return processor.login(userPointDTO);
    }

    @PostMapping("/dati/user/operation")
    public Mono<ResponseDTO> savePoints(@RequestBody UserPointDTO userPointDTO) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> processor.savePoints(userPointDTO, principal));
    }

    @PostMapping("/dati/user/image")
    public Mono<ResponseDTO> saveUserImage(@RequestBody UserPointDTO userPointDTO) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> processor.saveUserImage(userPointDTO, principal));
    }

    @PostMapping("/dati/user/status")
    public Mono<ResponseDTO> updateStatus(@RequestBody UserPointDTO userPointDTO) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> processor.updateStatus(userPointDTO, principal));
    }

    @PostMapping("/dati/user/update/child")
    public Mono<ResponseDTO> updateChildByEmail(@RequestBody UserPointWithChildDTO body) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> processor.updateChildByEmail(body, principal));
    }

}
