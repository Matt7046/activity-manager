package com.webapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.webapp.data.Points;
import com.webapp.dto.PointsDTO;
import com.webapp.mapper.PointsMapper;
import com.webapp.repository.PointsRepository;

import java.util.List;

@Service
public class PointsService {
    @Autowired
    private PointsRepository pointsRepository;


    public List<Points> findAll() {
        return pointsRepository.findAll();
    }

    public Points findByEmail(String identificativo)  {

        return pointsRepository.findByEmail(identificativo);
    } 

    public String savePoints(PointsDTO ActivityDTO) {
        return pointsRepository.savePoints(ActivityDTO);       
    }

    public Points save(PointsDTO pointsDTO) {
            Points subDTO = PointsMapper.INSTANCE.fromDTO(pointsDTO);

        return pointsRepository.save(subDTO);
    }
}
