package com.familyService;

import com.activityBusinessLogic.savePointsFamily.FamilySavePointsProcessor;
import com.common.dto.LogActivityDTO;
import com.common.dto.LogFamilyDTO;
import com.common.dto.PointsDTO;
import com.common.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class FamilyStateMachineService {

    @Autowired
    private FamilySavePointsProcessor familySavePointsProcessor;

    public Mono<ResponseDTO> savePointsByFamily(PointsDTO pointsDTO) {
        return familySavePointsProcessor.savePointsByFamily(pointsDTO);
    }

    public Mono<ResponseDTO> saveLogFamily(LogFamilyDTO logFamilyDTO) {
        return familySavePointsProcessor.saveLogFamily(logFamilyDTO);
    }
}
