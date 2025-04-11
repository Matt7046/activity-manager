package com.pointService;
import com.common.data.UserPoint;
import com.common.dto.UserPointDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.common.configurations.EncryptDecryptConverter;
import com.common.mapper.PointsMapper;
import com.repository.point.PointRepository;

import java.util.List;

@Service
public class PointService {
    @Autowired
    private PointRepository pointsRepository;
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    public List<UserPoint> findAll() {
        return pointsRepository.findAll();
    }

    public UserPoint findByEmail(String identificativo, Long type) {

        return pointsRepository.findByEmail(identificativo, type);
    }

    public UserPoint getPointByEmail(String email) throws Exception {
        return pointsRepository.getPointByEmail(email);
    }

    public List<UserPoint> getPointsListByEmail(String email) throws Exception {
        return pointsRepository.getPointsListByEmail(email);
    }

    public UserPoint savePoint(UserPointDTO userPointDTO) throws Exception {
        UserPoint points = PointsMapper.INSTANCE.fromDTO(userPointDTO);
        return pointsRepository.savePoint(points, userPointDTO.getUsePoints(), userPointDTO.getOperation());
    }

    public UserPoint rollbackSavePoint(UserPointDTO userPointDTO) throws Exception {
        UserPoint points = PointsMapper.INSTANCE.fromDTO(userPointDTO);
        return pointsRepository.savePoint(points, userPointDTO.getUsePoints(), !userPointDTO.getOperation());
    }


    public UserPoint save(UserPointDTO userPointDTO) throws Exception {
        UserPoint sub = PointsMapper.INSTANCE.fromDTO(userPointDTO);

        return pointsRepository.save(sub);
    }

       public Boolean saveUser(UserPointDTO userPointDTO) throws Exception {
        UserPoint points = PointsMapper.INSTANCE.fromDTO(userPointDTO);
        return pointsRepository.saveUser(points);
    }  

    
	public Long getTypeUser(UserPointDTO pointsSave) throws Exception {
        UserPoint points = PointsMapper.INSTANCE.fromDTO(pointsSave);
        return  pointsRepository.getTypeUser(points);
    }



    

}
