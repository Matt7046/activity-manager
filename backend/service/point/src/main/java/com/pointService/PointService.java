package com.pointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.common.configurations.EncryptDecryptConverter;
import com.common.data.Point;
import com.common.dto.PointsDTO;
import com.common.mapper.PointsMapper;
import com.repository.point.PointRepository;

import java.util.List;

@Service
public class PointService {
    @Autowired
    private PointRepository pointsRepository;
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    public List<Point> findAll() {
        return pointsRepository.findAll();
    }

    public Point findByEmail(String identificativo, Long type) {

        return pointsRepository.findByEmail(identificativo, type);
    }

    public Point getPointByEmail(String email) throws Exception {
        return pointsRepository.getPointByEmail(email);
    }

    public List<Point> getPointsListByEmail(String email) throws Exception {
        return pointsRepository.getPointsListByEmail(email);
    }

    public Point savePoint(PointsDTO pointsDTO) throws Exception {
        Point points = PointsMapper.INSTANCE.fromDTO(pointsDTO);
        return pointsRepository.savePoint(points, pointsDTO.getUsePoints(), pointsDTO.getOperation());
    }

    public Point rollbackSavePoint(PointsDTO pointsDTO) throws Exception {
        Point points = PointsMapper.INSTANCE.fromDTO(pointsDTO);
        return pointsRepository.savePoint(points, pointsDTO.getUsePoints(), !pointsDTO.getOperation());
    }


    public Point save(PointsDTO pointsDTO) throws Exception {
        Point sub = PointsMapper.INSTANCE.fromDTO(pointsDTO);

        return pointsRepository.save(sub);
    }

       public Boolean saveUser(PointsDTO pointsDTO) throws Exception {
        Point points = PointsMapper.INSTANCE.fromDTO(pointsDTO);
        return pointsRepository.saveUser(points);
    }  

    
	public Long getTypeUser(PointsDTO pointsSave) throws Exception {
        Point points = PointsMapper.INSTANCE.fromDTO(pointsSave);
        return  pointsRepository.getTypeUser(points);
    }



    

}
