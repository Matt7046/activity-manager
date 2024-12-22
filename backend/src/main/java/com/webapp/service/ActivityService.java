package com.webapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.webapp.data.Activity;
import com.webapp.dto.ActivityDTO;
import com.webapp.mapper.ActivityMapper;
import com.webapp.repository.Activity.ActivityRepository;

import java.util.List;

@Service
public class ActivityService {
    @Autowired
    private ActivityRepository activityRepository;


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

    public Activity save(ActivityDTO ActivityDTO) {
            Activity subDTO = ActivityMapper.INSTANCE.fromDTO(ActivityDTO);

        return activityRepository.save(subDTO);
    }
}
