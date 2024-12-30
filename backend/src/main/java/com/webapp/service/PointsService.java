package com.webapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.webapp.EncryptDecryptConverter;
import com.webapp.data.Points;
import com.webapp.dto.PointsDTO;
import com.webapp.mapper.PointsMapper;
import com.webapp.repository.Points.PointsRepository;

import java.util.List;

@Service
public class PointsService {
    @Autowired
    private PointsRepository pointsRepository;
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    public List<Points> findAll() {
        return pointsRepository.findAll();
    }

    public Points findByEmail(String identificativo, Long type) {

        return pointsRepository.findByEmail(identificativo,type);
    }

    public Long getUserType(PointsDTO pointsDTO) throws Exception {
        Points points = PointsMapper.INSTANCE.fromDTO(pointsDTO);
        return pointsRepository.getUserType(points);
    }

    public Boolean saveFamily(PointsDTO pointsDTO) throws Exception {
        Points points = PointsMapper.INSTANCE.fromDTO(pointsDTO);
        return pointsRepository.saveFamily(points);
    }

    public Points getPointsByEmail(String email) throws Exception {
        return pointsRepository.getPointsByEmail(email);    }


    public Points savePointsByTypeStandard(PointsDTO pointsDTO, Boolean operation) throws Exception {
        Points points = PointsMapper.INSTANCE.fromDTO(pointsDTO);
        return pointsRepository.savePointsByTypeStandard(points, pointsDTO.getUsePoints(), operation);
    }

    public Points save(PointsDTO pointsDTO) throws Exception {
        Points sub = PointsMapper.INSTANCE.fromDTO(pointsDTO);

        return pointsRepository.save(sub);
    }


}
