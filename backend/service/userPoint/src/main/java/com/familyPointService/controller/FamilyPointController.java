package com.familyPointService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.common.dto.user.UserPointWithChildDTO;
import com.common.security.ReactiveJwt;
import com.familyPointService.processor.FamilyPointsProcessor;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/family-point")
public class FamilyPointController {

    @Autowired
    private FamilyPointsProcessor processor;
    @Autowired
    private ReactiveJwt reactiveJwt;

    @PostMapping("/dati")
    public Mono<ResponseDTO> savePointsByFamily(@RequestBody UserPointDTO userPointDTO) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> {
                    userPointDTO.setEmailUserCurrent(principal);
                    return processor.savePointsByFamily(userPointDTO);
                });
    }

    @PostMapping("/dati/child")
    public Mono<ResponseDTO> updateChildByEmail(@RequestBody UserPointWithChildDTO body) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> {
                    body.getUserPoint().setEmailUserCurrent(principal);
                    return processor.updateChildByEmail(body);
                });
    }
}
