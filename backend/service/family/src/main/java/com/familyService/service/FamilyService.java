package com.familyService.service;

import com.common.data.LogFamily;
import com.common.dto.*;
import com.common.exception.ActivityHttpStatus;
import com.common.mapper.LogFamilyMapper;
import com.common.authDTO.PointsUser;
import com.repository.family.FamilyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FamilyService {

    @Value("${message.document.points}")
    private String message;

    @Autowired
    private FamilyRepository repository;

    public ResponseDTO savePointsByFamily(List<PointsUser> filteredList, UserPointDTO userPointDTO) {
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

    public ResponseDTO getLogFamily(UserPointDTO user, Sort sort) {

      List<LogFamily> familyList = repository.findLogByEmail(user.getEmail(), sort);
        List<LogFamilyDTO> logFamilyDTOList =  familyList.stream()
                .map(LogFamilyMapper.INSTANCE::toDTO) .collect(Collectors.toList());
        ResponseDTO response = new ResponseDTO(logFamilyDTOList, ActivityHttpStatus.OK.value(),
                new ArrayList<>());
        return response;
    }

}
