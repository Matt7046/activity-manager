package com.activityService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.common.dto.activity.ActivityDTO;
import com.common.mapper.ActivityMapper;
import com.repository.activity.ActivityRepository;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.activity.Activity;


import reactor.core.publisher.Mono;
import java.util.List;

@Service
public class ActivityService {
    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    @Autowired
    @Qualifier("webClientActivity")
    private WebClient webClientActivity;

    public List<Activity> findAll() {
        return activityRepository.findAll();
    }

    public Activity findByIdentificativo(String identificativo) {

        return activityRepository.findByIdentificativo(identificativo);
    }

    public Long deleteByIdentificativo(String identificativo) {

        return activityRepository.deleteByIdentificativo(identificativo);
    }

    public Mono<String> saveActivity(ActivityDTO activityDTO) {
        Activity activityToSave = ActivityMapper.INSTANCE.fromDTO(activityDTO);
        String result = activityRepository.saveActivity(activityToSave); // Supponiamo che restituisca una String
        return Mono.just(result);
    }

    public Activity save(ActivityDTO ActivityDTO) {
        Activity sub = ActivityMapper.INSTANCE.fromDTO(ActivityDTO);

        return activityRepository.save(sub);
    }

    public List<Activity> findAllByEmail(String email) {
        return activityRepository.findAllByEmail(encryptDecryptConverter.convert(email));
    }
}
