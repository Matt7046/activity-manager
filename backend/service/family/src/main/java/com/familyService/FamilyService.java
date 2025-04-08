package com.familyService;

import com.common.dto.PointsDTO;
import com.common.dto.PointRDTO;
import com.common.transversal.PointsUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.common.dto.ResponseDTO;

import java.util.ArrayList;
import java.util.List;


@Service
public class FamilyService {

    @Value("${message.document.points}")
    private String message;

    public ResponseDTO savePointsByFamily(List<PointsUser> filteredList, PointsDTO pointsDTO) {
        // Creare l'oggetto PointsRDTO
        PointRDTO record = new PointRDTO(
                filteredList.get(0).getPoints(),
                message
                        + filteredList.get(0).getPoints());
        ResponseDTO response = new ResponseDTO(record, HttpStatus.OK.value(),
                new ArrayList<>());
        return response;
    }
}
