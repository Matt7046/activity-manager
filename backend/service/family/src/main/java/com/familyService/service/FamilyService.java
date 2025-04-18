package com.familyService.service;

import com.common.data.family.LogFamily;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.common.structure.status.ActivityHttpStatus;
import com.common.dto.family.LogFamilyDTO;
import com.common.mapper.LogFamilyMapper;
import com.repository.family.FamilyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
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

    public ResponseDTO saveLogFamily(LogFamilyDTO logFamilyDTO) {

        LogFamily family = LogFamilyMapper.INSTANCE.fromDTO(logFamilyDTO);
        family = repository.save(family);
        logFamilyDTO = LogFamilyMapper.INSTANCE.toDTO(family);
        ResponseDTO response = new ResponseDTO(logFamilyDTO, ActivityHttpStatus.OK.value(),
                new ArrayList<>());
        return response;
    }

    public ResponseDTO getLogFamily(UserPointDTO user, Pageable pageable) {

      List<LogFamily> familyList = repository.findLogByEmail(user.getEmail(), pageable);
        List<LogFamilyDTO> logFamilyDTOList =  familyList.stream()
                .map(LogFamilyMapper.INSTANCE::toDTO) .collect(Collectors.toList());
        ResponseDTO response = new ResponseDTO(logFamilyDTOList, ActivityHttpStatus.OK.value(),
                new ArrayList<>());
        return response;
    }

}
