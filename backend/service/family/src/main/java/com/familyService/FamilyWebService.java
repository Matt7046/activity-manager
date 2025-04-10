package com.familyService;

import com.activityBusinessLogic.savePointsFamily.FamilySavePointsProcessor;
import com.common.dto.LogFamilyDTO;
import com.common.dto.UserPointDTO;
import com.common.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class FamilyWebService {

    @Autowired
    private FamilySavePointsProcessor familySavePointsProcessor;

    public Mono<ResponseDTO> savePointsByFamily(UserPointDTO userPointDTO) {
        return familySavePointsProcessor.savePointsByFamily(userPointDTO);
    }

    public Mono<ResponseDTO> saveLogFamily(LogFamilyDTO logFamilyDTO) {
        return familySavePointsProcessor.saveLogFamily(logFamilyDTO);
    }
}
