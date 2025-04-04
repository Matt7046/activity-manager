package com.activityService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.common.dto.PointsDTO;
import com.common.dto.ResponseDTO;
import reactor.core.publisher.Mono;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.activityBusinessLogic.savePointsFamily.FamilySavePointsProcessor;

@RestController
@CrossOrigin(origins = "https://webapp-tn6q.onrender.com")
@RequestMapping("api/family")
public class FamilyController {

    @Autowired
    private FamilyStateMachineService familyStateMachineService;

    @PostMapping("/dati")
    public Mono<ResponseDTO> savePointsByFamily(@RequestBody PointsDTO pointsDTO) {
        return familyStateMachineService.savePointsByFamily(pointsDTO);
    }
}
