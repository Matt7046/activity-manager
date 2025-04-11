package com.activityService;

import com.common.dto.UserPointDTO;
import com.common.exception.ActivityHttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.common.configurations.EncryptDecryptConverter;
import com.common.data.Activity;
import com.common.dto.ActivityDTO;
import com.common.dto.ResponseDTO;

import com.common.exception.NotFoundException;
import com.common.mapper.ActivityMapper;

import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/activity")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @Value("${error.document.notFound}")
    private String errorDocument;
    
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    @PostMapping("/activities")
    public ResponseDTO getActivities(@RequestBody UserPointDTO userPointDTO) {
        String email = userPointDTO.getEmail();
        List<Activity> sub = activityService.findAllByEmail(email);
        List<ActivityDTO> subDTO = sub.stream()
                .map(ActivityMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());
        ResponseDTO response = new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        return response;
    }

    @PostMapping("/find")
    public ResponseDTO findByIdentificativo(@RequestBody UserPointDTO userPointDTO) {
        Activity item = null;
        ResponseDTO responseDTO = null;
        item = activityService.findByIdentificativo(userPointDTO.get_id());
        if (item == null) {
            throw new NotFoundException(errorDocument + userPointDTO.get_id());
        }

        if (item != null) {
            ActivityDTO subDTO = ActivityMapper.INSTANCE.toDTO(item);
            responseDTO = new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        }

        return responseDTO;
    }

    @PostMapping("/dati")
    public Mono<ResponseDTO> saveActivity(@RequestBody ActivityDTO activityDTO) {
        return activityService.saveActivity(activityDTO)  // Ottieni il Mono<String>
                .map(result -> new ResponseDTO(result, ActivityHttpStatus.OK.value(), new ArrayList<>()));  // Mappa il risultato in un ResponseDTO
    }

     @DeleteMapping("toggle/{identificativo}")
    public Mono<ResponseDTO> deleteByIdentificativo(@PathVariable String identificativo) throws Exception {
        identificativo = encryptDecryptConverter.decrypts(identificativo);   
        return Mono.just(activityService.deleteByIdentificativo(identificativo))
        .map(result -> new ResponseDTO(result, ActivityHttpStatus.OK.value(), new ArrayList<>()));  // Mappa il risultato in un ResponseDTO
       
    }
}
