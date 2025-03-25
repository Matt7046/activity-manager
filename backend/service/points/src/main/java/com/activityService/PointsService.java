package com.activityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.common.configurations.EncryptDecryptConverter;
import com.common.data.Points;
import com.common.dto.PointsDTO;
import com.common.mapper.PointsMapper;
import com.repository.points.PointsRepository;

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

        return pointsRepository.findByEmail(identificativo, type);
    }

    public Points getPointsByEmail(String email) throws Exception {
        return pointsRepository.getPointsByEmail(email);
    }

    public List<Points> getPointsListByEmail(String email) throws Exception {
        return pointsRepository.getPointsListByEmail(email);
    }

    public Points savePoints(PointsDTO pointsDTO, Boolean operation) throws Exception {
        Points points = PointsMapper.INSTANCE.fromDTO(pointsDTO);
        return pointsRepository.savePoints(points, pointsDTO.getUsePoints(), operation);
    }

    public Points save(PointsDTO pointsDTO) throws Exception {
        Points sub = PointsMapper.INSTANCE.fromDTO(pointsDTO);

        return pointsRepository.save(sub);
    }

       public Boolean saveUser(PointsDTO pointsDTO) throws Exception {
        Points points = PointsMapper.INSTANCE.fromDTO(pointsDTO);
        return pointsRepository.saveUser(points);
    }  

    
	public Long getTypeUser(PointsDTO pointsSave) throws Exception {
        Points points = PointsMapper.INSTANCE.fromDTO(pointsSave);
        return  pointsRepository.getTypeUser(points);
    }



    

}
