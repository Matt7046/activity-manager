package com.activityManager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.activityManager.configurations.EncryptDecryptConverter;
import com.activityManager.data.Activity;
import com.activityManager.data.LogActivity;
import com.activityManager.dto.ActivityDTO;
import com.activityManager.dto.LogActivityDTO;
import com.activityManager.dto.PointsDTO;
import com.activityManager.mapper.ActivityMapper;
import com.activityManager.mapper.LogActivityMapper;
import com.activityManager.repository.activity.ActivityRepository;
import com.activityManager.repository.logAttivita.LogActivityRepository;

import java.util.List;

@Service
public class ActivityService {
    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private LogActivityRepository logRepository;

    @Autowired
    private LogActivityRepository logAttivitaRepository;

     @Autowired
    EncryptDecryptConverter encryptDecryptConverter;


    public List<Activity> findAll() {
        return activityRepository.findAll();
    }

    public Activity findByIdentificativo(String identificativo)  {

        return activityRepository.findByIdentificativo(identificativo);
    }

    public Long deleteByIdentificativo(String identificativo) {

        return activityRepository.deleteByIdentificativo(identificativo);
    }

    public String saveActivity(ActivityDTO ActivityDTO) {
        Activity sub = ActivityMapper.INSTANCE.fromDTO(ActivityDTO);
        return activityRepository.saveActivity(sub);       
    }

    public LogActivity saveLogActivity(LogActivityDTO ActivityDTO) {
        LogActivity sub = LogActivityMapper.INSTANCE.fromDTO(ActivityDTO);
        return logRepository.save(sub) ;
    }

    public Activity save(ActivityDTO ActivityDTO) {
            Activity sub = ActivityMapper.INSTANCE.fromDTO(ActivityDTO);

        return activityRepository.save(sub);
    }

    
    public List<LogActivity> logAttivitaByEmail(PointsDTO pointsDTO, Sort sort) {
        return logAttivitaRepository.findLogByEmail(encryptDecryptConverter.convert(pointsDTO.getEmail()), sort);
    }

    public List<Activity> findAllByEmail(String email) {
        return activityRepository.findAllByEmail(encryptDecryptConverter.convert(email));
    }
}
