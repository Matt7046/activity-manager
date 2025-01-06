package com.activityManager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.activityManager.EncryptDecryptConverter;
import com.activityManager.data.Points;
import com.activityManager.dto.PointsDTO;
import com.activityManager.mapper.PointsMapper;
import com.activityManager.repository.points.PointsRepository;

import java.util.List;

@Service
public class RegisterService {
    @Autowired
    private PointsRepository pointsRepository;
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;


    public Long getTypeUser(PointsDTO pointsDTO) throws Exception {
        Points points = PointsMapper.INSTANCE.fromDTO(pointsDTO);
        return pointsRepository.getTypeUser(points);
    }

    public Boolean saveUser(PointsDTO pointsDTO) throws Exception {
        Points points = PointsMapper.INSTANCE.fromDTO(pointsDTO);
        return pointsRepository.saveUser(points);
    }

   

}
