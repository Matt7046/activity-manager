package com.familyLogService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.userPointService.dto.family.LogFamilyDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.common.security.ReactiveJwt;
import com.familyLogService.processor.FamilyLogProcessor;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/family-log")
public class FamilyLogController {

    @Autowired
    private FamilyLogProcessor processor;
    @Autowired
    private ReactiveJwt reactiveJwt;

    @PostMapping("/log")
    public Mono<ResponseDTO> saveLogFamily(@RequestBody LogFamilyDTO logFamilyDTO) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> {
                    logFamilyDTO.setPerformedByEmail(principal);
                    return processor.saveLogFamily(logFamilyDTO);
                });
    }

    @PostMapping("/log/tutor")
    public Mono<ResponseDTO> logFamilyByEmail(@RequestBody UserPointDTO userPointDTO) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> processor.logFamilyByEmail(userPointDTO, principal));
    }
}
