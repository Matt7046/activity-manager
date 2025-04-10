package com.familyService;

import com.common.data.LogFamily;
import com.common.dto.*;
import com.common.exception.ActivityHttpStatus;
import com.common.mapper.LogFamilyMapper;
import com.common.transversal.PointsUser;
import com.repository.family.FamilyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class FamilyService {

    @Value("${message.document.points}")
    private String message;

    @Autowired
    private FamilyRepository repository;

    public ResponseDTO savePointsByFamily(List<PointsUser> filteredList, PointsDTO pointsDTO) {
        // Creare l'oggetto PointsRDTO
        PointRDTO record = new PointRDTO(
                filteredList.get(0).getPoints(),
                message
                        + filteredList.get(0).getPoints());
        ResponseDTO response = new ResponseDTO(record, ActivityHttpStatus.OK.value(),
                new ArrayList<>());
        return response;
    }

    public ResponseDTO saveLogFamily(LogFamilyDTO logFamilyDTO) {

        LogFamily family = LogFamilyMapper.INSTANCE.fromDTO(logFamilyDTO);
        family = repository.save(family);
        logFamilyDTO = LogFamilyMapper.INSTANCE.toDTO(family);
        ResponseDTO response = new ResponseDTO(logFamilyDTO, ActivityHttpStatus.OK.value(),
                new ArrayList<>());
        return response;
    }
}
