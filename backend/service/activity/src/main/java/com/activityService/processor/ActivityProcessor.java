package com.activityService.processor;

import com.activityService.service.ActivityService;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.activity.Activity;
import com.common.dto.activity.ActivityDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.common.mapper.ActivityMapper;
import com.common.structure.exception.NotFoundException;
import com.common.structure.status.ActivityHttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ActivityProcessor {
    @Autowired
    private ActivityService activityService;

    @Autowired
    private ActivityMapper activityMapper;

    @Value("${error.document.notFound}")
    private String errorDocument;

    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    public Mono<ResponseDTO> getActivities(UserPointDTO userPointDTO) {
        String email = userPointDTO.getEmail();
        List<Activity> sub = activityService.findAllByEmail(email);
        List<ActivityDTO> subDTO = sub.stream()
                .map(activityMapper::toDTO)
                .collect(Collectors.toList());
        ResponseDTO response = new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        return Mono.just(response);
    }

    public Mono<ResponseDTO> findByIdentificativo(UserPointDTO userPointDTO) {
        Activity item = null;
        ResponseDTO responseDTO = null;
        item = activityService.findByIdentificativo(userPointDTO.get_id());
        if (item == null) {
            throw new NotFoundException(errorDocument + userPointDTO.get_id());
        }

        if (item != null) {
            ActivityDTO subDTO = activityMapper.toDTO(item);
            responseDTO = new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        }
        return Mono.just(responseDTO);
    }

    public Mono<ResponseDTO> saveActivity(ActivityDTO activityDTO) {
        String emailCriypt = encryptDecryptConverter.convert(activityDTO.getEmail());
        activityDTO.setEmail(emailCriypt);
        String _id = activityService.saveActivity(activityDTO);  // Ottieni il Mono<String>
        return Mono.just(new ResponseDTO(_id, ActivityHttpStatus.OK.value(), new ArrayList<>()));
    }

    public Mono<ResponseDTO> deleteByIdentificativo(String identificativo) {
        identificativo = encryptDecryptConverter.decrypt(identificativo);
        return Mono.just(activityService.deleteByIdentificativo(identificativo))
                .map(result -> new ResponseDTO(result, ActivityHttpStatus.OK.value(), new ArrayList<>()));  // Mappa il risultato in un ResponseDTO

    }
}