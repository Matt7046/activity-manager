package com.activityService;

import com.common.dto.FamilyNotificationDTO;
import com.common.dto.PointsDTO;
import com.common.dto.PointsRDTO;
import com.common.transversal.PointsUser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.common.dto.ResponseDTO;

import java.util.ArrayList;
import java.util.List;


@Service
public class FamilyService {

    public ResponseDTO savePointsByFamily(List<PointsUser> filteredList, PointsDTO pointsDTO) {
        // Creare l'oggetto PointsRDTO
        PointsRDTO record = new PointsRDTO(
                filteredList.get(0).getPoints(),
                "I Points a disposizione sono: "
                        + filteredList.get(0).getPoints());
        ResponseDTO response = new ResponseDTO(record, HttpStatus.OK.value(),
                new ArrayList<>());
        return response;
    }
}
