package com.logActivityService.controller;

import com.common.dto.user.UserPointDTO;
import com.logActivityService.processor.LogActivityProcessor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.common.dto.activity.LogActivityDTO;
import com.common.dto.structure.ResponseDTO;
import reactor.core.publisher.Mono;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/logactivity")
public class LogActivityController {

    @Autowired
    private LogActivityProcessor logActivityProcessor;

    @PostMapping("/log")
    public Mono<ResponseDTO> logActivityByEmail(@RequestBody UserPointDTO userPointDTO) {
        return  logActivityProcessor.logAttivitaByEmail(userPointDTO);
    }

    @PostMapping("/dati")
    public Mono<ResponseDTO> savePointsAndLog(@RequestBody LogActivityDTO logActivityDTO) {
        return logActivityProcessor.savePoints(logActivityDTO);
    }
}
