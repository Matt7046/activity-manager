package com.webapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.webapp.EncryptDecryptConverter;
import com.webapp.data.Activity;
import com.webapp.data.LogActivity;
import com.webapp.dto.ActivityDTO;
import com.webapp.dto.LogActivityDTO;
import com.webapp.dto.PointsDTO;
import com.webapp.mapper.ActivityMapper;
import com.webapp.mapper.LogActivityMapper;
import com.webapp.repository.Activity.ActivityRepository;
import com.webapp.repository.LogAttivita.LogActivityRepository;

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
