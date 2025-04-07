package com.logActivityService;

import com.activityBusinessLogic.savePoints.LogActivitySavePointsProcessor;
import com.common.dto.LogActivityDTO;
import com.common.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PointsStateMachineService {

    @Autowired
    private LogActivitySavePointsProcessor logActivityProcessor;

    public Mono<ResponseDTO> savePoints(LogActivityDTO logActivityDTO) {
       return logActivityProcessor.savePoints(logActivityDTO);
    }

    private Mono<ResponseDTO> saveLog(LogActivityDTO logActivityDTO) {
        return logActivityProcessor.saveLog(logActivityDTO);
    }
}
