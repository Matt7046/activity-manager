package com.familyService;

import com.common.dto.LogFamilyDTO;
import com.common.dto.UserPointDTO;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.common.dto.ResponseDTO;
import reactor.core.publisher.Mono;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(origins = "https://webapp-tn6q.onrender.com")
@RequestMapping("api/family")
public class FamilyController {

    @Autowired
    private FamilyWebService familyWebService;

    @PostMapping("/dati")
    public Mono<ResponseDTO> savePointsByFamily(@RequestBody UserPointDTO userPointDTO) {
        return familyWebService.savePointsByFamily(userPointDTO);
    }

    @PostMapping("/log")
    public Mono<ResponseDTO> saveLogFamily(@RequestBody LogFamilyDTO logFamilyDTO) {
        return familyWebService.saveLogFamily(logFamilyDTO);
    }
}
