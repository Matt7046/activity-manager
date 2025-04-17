package com.userPointService.service;
import com.common.data.user.UserPoint;
import com.common.dto.user.UserPointDTO;
import com.common.mapper.UserPointMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.repository.userPoint.UserPointRepository;

import java.util.List;

@Service
public class UserPointService {
    @Autowired
    private UserPointRepository pointsRepository;

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
        UserPoint points = UserPointMapper.INSTANCE.fromDTO(userPointDTO);
        return pointsRepository.savePoint(points, userPointDTO.getUsePoints(), userPointDTO.getOperation());
    }

    public UserPoint rollbackSavePoint(UserPointDTO userPointDTO) throws Exception {
        UserPoint points = UserPointMapper.INSTANCE.fromDTO(userPointDTO);
        return pointsRepository.savePoint(points, userPointDTO.getUsePoints(), !userPointDTO.getOperation());
    }


    public UserPoint save(UserPointDTO userPointDTO) throws Exception {
        UserPoint sub = UserPointMapper.INSTANCE.fromDTO(userPointDTO);

        return pointsRepository.save(sub);
    }

       public Boolean saveUser(UserPointDTO userPointDTO) throws Exception {
        UserPoint points = UserPointMapper.INSTANCE.fromDTO(userPointDTO);
        return pointsRepository.saveUser(points);
    }  

    
	public Long getTypeUser(UserPointDTO pointsSave) throws Exception {
        UserPoint points = UserPointMapper.INSTANCE.fromDTO(pointsSave);
        return  pointsRepository.getTypeUser(points);
    }

    public UserPoint saveUserImage(UserPointDTO userPointDTO) throws Exception {
        UserPoint points = UserPointMapper.INSTANCE.fromDTO(userPointDTO);
        return pointsRepository.saveUserImage(points);
    }
}
