package com.activityManager.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.activityManager.configurations.EncryptDecryptConverter;
import com.activityManager.data.Points;
import com.activityManager.dto.PointsDTO;
import com.activityManager.mapper.PointsMapper;
import com.activityManager.repository.points.PointsRepository;


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
