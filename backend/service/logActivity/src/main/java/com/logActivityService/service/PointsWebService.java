package com.logActivityService.service;

import com.logActivityService.processor.LogActivitySavePointsProcessor;
import com.common.dto.LogActivityDTO;
import com.common.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PointsWebService {

    @Autowired
    private LogActivitySavePointsProcessor logActivityProcessor;

    public Mono<ResponseDTO> savePoints(LogActivityDTO logActivityDTO) {
       return logActivityProcessor.savePoints(logActivityDTO);
    }
}
