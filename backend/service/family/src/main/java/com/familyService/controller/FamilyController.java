package com.familyService.controller;

import com.common.dto.family.LogFamilyDTO;
import com.common.dto.user.UserPointDTO;
import com.common.dto.user.UserPointWithChildDTO;
import com.familyService.processor.FamilyPointsProcessor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.common.dto.structure.ResponseDTO;
import reactor.core.publisher.Mono;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/family")
public class FamilyController {

    @Autowired
    private FamilyPointsProcessor familyPointsProcessor;

    @PostMapping("/dati")
    public Mono<ResponseDTO> savePointsByFamily(@RequestBody UserPointDTO userPointDTO) {
        return familyPointsProcessor.savePointsByFamily(userPointDTO);
    }

    @PostMapping("/log")
    public Mono<ResponseDTO> saveLogFamily(@RequestBody LogFamilyDTO logFamilyDTO) {
        return familyPointsProcessor.saveLogFamily(logFamilyDTO);
    }

    @PostMapping("/log/tutor")
    public Mono<ResponseDTO> getLogActivityByEmail(@RequestBody UserPointDTO userPointDTO) {
        return familyPointsProcessor.logFamilyByEmail(userPointDTO);
    }

    @PostMapping("/dati/child")
    public Mono<ResponseDTO> updateChildByEmail(@RequestBody UserPointWithChildDTO body) {
        return familyPointsProcessor.updateChildByEmail(body);
    }
}
