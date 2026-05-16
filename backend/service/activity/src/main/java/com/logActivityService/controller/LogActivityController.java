package com.logActivityService.controller;

import com.common.dto.user.UserPointDTO;
import com.activityService.dto.LogActivityDTO;
import com.common.security.ReactiveJwt;
import com.logActivityService.processor.LogActivityProcessor;
import com.common.dto.structure.ResponseDTO;
import reactor.core.publisher.Mono;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/logactivity")
public class LogActivityController {

    @Autowired
    private LogActivityProcessor logActivityProcessor;
    @Autowired
    private ReactiveJwt reactiveJwt;

    @PostMapping("/log")
    public Mono<ResponseDTO> logActivityByEmail(@RequestBody UserPointDTO userPointDTO) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> {
                    userPointDTO.setEmailUserCurrent(principal);
                    return logActivityProcessor.logAttivitaByEmail(userPointDTO);
                });
    }

    @PostMapping("/dati")
    public Mono<ResponseDTO> savePointsAndLog(@RequestBody LogActivityDTO logActivityDTO) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> {
                    logActivityDTO.setEmailUserCurrent(principal);
                    return logActivityProcessor.savePoints(logActivityDTO);
                });
    }
}
