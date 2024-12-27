package com.webapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.webapp.data.Activity;
import com.webapp.data.LogActivity;
import com.webapp.dto.ActivityDTO;
import com.webapp.dto.LogActivityDTO;
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
        return activityRepository.saveActivity(ActivityDTO);       
    }

    public LogActivity saveLogActivity(LogActivityDTO ActivityDTO) {
        LogActivity subDTO = LogActivityMapper.INSTANCE.fromDTO(ActivityDTO);
        return logRepository.save(subDTO) ;
    }

    public Activity save(ActivityDTO ActivityDTO) {
            Activity subDTO = ActivityMapper.INSTANCE.fromDTO(ActivityDTO);

        return activityRepository.save(subDTO);
    }
}
