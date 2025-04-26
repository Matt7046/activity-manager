package com.activityService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import com.common.dto.activity.ActivityDTO;
import com.common.mapper.ActivityMapper;
import com.activityService.repository.ActivityRepository;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.activity.Activity;


import java.util.List;

@Service
public class ActivityService {
    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;
    @Autowired
    ActivityMapper activityMapper;
    @Autowired
    @Qualifier("webClientActivity")
    private WebClient webClientActivity;

    @Transactional
    public List<Activity> findAll() {
        return activityRepository.findAll();
    }

    @Transactional
    public Activity findByIdentificativo(String identificativo) {
        return activityRepository.findByIdentificativo(identificativo);
    }
    @Transactional
    public Long deleteByIdentificativo(String identificativo) {
        return activityRepository.deleteByIdentificativo(identificativo);
    }
    @Transactional
    public String saveActivity(ActivityDTO activityDTO) {
        Activity activityToSave = activityMapper.fromDTO(activityDTO);
        Activity result = activityRepository.save(activityToSave); // Supponiamo che restituisca una String
        return result.get_id();
    }
    @Transactional
    public Activity save(ActivityDTO ActivityDTO) {
        Activity sub = activityMapper.fromDTO(ActivityDTO);
        return activityRepository.save(sub);
    }
    @Transactional
    public List<Activity> findAllByEmail(String email) {
        return activityRepository.findAllByEmail(encryptDecryptConverter.convert(email));
    }
}
