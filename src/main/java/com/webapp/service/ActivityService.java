package com.webapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.webapp.data.Activity;
import com.webapp.dto.ActivityDTO;
import com.webapp.mapper.ActivityMapper;
import com.webapp.repository.ActivityRepository;

import java.util.List;

@Service
public class ActivityService {
    @Autowired
    private ActivityRepository ActivityRepository;


    public List<Activity> findAll() {
        return ActivityRepository.findAll();
    }

    public Activity findByIdentificativo(String identificativo)  {

        return ActivityRepository.findByIdentificativo(identificativo);
    }

    public Long deleteByIdentificativo(String identificativo) {

        return ActivityRepository.deleteByIdentificativo(identificativo);
    }

    public String saveActivity(ActivityDTO ActivityDTO) {
        return ActivityRepository.saveActivity(ActivityDTO);       
    }

    public Activity save(ActivityDTO ActivityDTO) {
            Activity subDTO = ActivityMapper.INSTANCE.fromDTO(ActivityDTO);

        return ActivityRepository.save(subDTO);
    }
}
