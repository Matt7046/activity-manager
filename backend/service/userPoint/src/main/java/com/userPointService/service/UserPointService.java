package com.userPointService.service;

import com.common.data.user.UserPoint;
import com.common.structure.exception.ArithmeticCustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.userPointService.repository.UserPointRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserPointService {
    @Autowired
    private UserPointRepository userPointRepository;

    @Value("${error.document.arithmetic}")
    private String arithmeticProperties;

    public List<UserPoint> findAll() {
        return userPointRepository.findAll();
    }

    public UserPoint findByEmailAndType(String identificativo, Long type) {
        return userPointRepository.findByEmailAndType(identificativo, type);
    }

    public UserPoint getEmailChild(UserPoint userPoint) {
        UserPoint existingUserPoint = userPointRepository.findUserByEmail(userPoint.getEmailUserCurrent());

        if (existingUserPoint == null) {
            return new UserPoint();
        }
        return existingUserPoint;
    }

    public UserPoint getUserByEmail(UserPoint userPoint) {
        UserPoint existingUserPoint = userPointRepository.findUserByEmail(userPoint.getEmailUserCurrent());
        if (existingUserPoint == null) {
            UserPoint userPointList = userPointRepository.findByOnFigli(userPoint.getEmailUserCurrent());
            existingUserPoint = userPointList != null ? userPointList : null;
        }
        if (existingUserPoint == null) {
            return new UserPoint();
        }
        return existingUserPoint;

    }

    public UserPoint findByOnFigli(UserPoint userPoint) {
        return userPointRepository.findByOnFigli(userPoint.getEmail());
    }

    public UserPoint savePoint(UserPoint userPoint) {

        UserPoint existingUserPoint = userPointRepository.findUserByEmail(userPoint.getEmail());
        Integer delta = userPoint.getOperation() ? userPoint.getUsePoints() : -userPoint.getUsePoints();
        Integer updatedPoint = existingUserPoint.getPoints() + delta;
        if (updatedPoint < 0) {
            throw new ArithmeticCustomException(arithmeticProperties);
        }
        existingUserPoint.setPoints(updatedPoint);
        userPointRepository.save(existingUserPoint);
        return existingUserPoint;
    }

    public UserPoint rollbackSavePoint(UserPoint userPoint) {
        userPoint.setOperation(!userPoint.getOperation());
        return savePoint(userPoint);
    }

    public UserPoint saveUser(UserPoint userPoint, List<UserPoint> userChild) {
        userPoint = userPointRepository.save(userPoint);
        userPointRepository.saveAll(userChild);
        return userPoint;
    }

    public Long getTypeUser(UserPoint point) {
        UserPoint existUserPointOnFigli = userPointRepository.findUserByEmail(point.getEmailUserCurrent());
        return existUserPointOnFigli != null ? existUserPointOnFigli.getType() : 2L;
    }

    public UserPoint saveUserImage(UserPoint userPoint) throws Exception {

        UserPoint existingUserPoint = userPointRepository.findUserByEmail(userPoint.getEmailChild());
        UserPoint updatedPoints = ovverideNameImage(userPoint, existingUserPoint);
        return userPointRepository.save(updatedPoints);
    }


    private UserPoint ovverideNameImage(UserPoint userPointSave, UserPoint point) {
        if (!userPointSave.getEmail().equals(point.getEmail())) {
            return point;
        }
        List<String> existingNames = Optional.ofNullable(point.getNameImages()).orElse(new ArrayList<>());
        boolean nameExists = existingNames.stream().anyMatch(name -> verifyNameImage(name, userPointSave));

        List<String> updatedNames = existingNames.stream().map(name -> verifyNameImage(name, userPointSave) ? userPointSave.getNameImage() : name).collect(Collectors.toList());
        if (!nameExists) {
            updatedNames.add(userPointSave.getNameImage());
        }
        point.setNameImages(updatedNames);
        return point;
    }

    private boolean verifyNameImage(String x, UserPoint userPointSave) {
        // Estrai la parte finale dell'URL dopo l'ultimo "/"
        String fileNamex = x.substring(x.lastIndexOf('/') + 1);
        String fileNamexWithoutExtension = fileNamex.contains(".") ? fileNamex.substring(0, fileNamex.lastIndexOf('.')) : fileNamex;

        String fileNameUserPoint = userPointSave.getNameImage().substring(userPointSave.getNameImage().lastIndexOf('/') + 1);
        String fileNameWithoutExtension = fileNameUserPoint.contains(".") ? fileNameUserPoint.substring(0, fileNameUserPoint.lastIndexOf('.')) : fileNameUserPoint;
        // Confronta con il nome immagine atteso
        return fileNamexWithoutExtension.equals(fileNameWithoutExtension);
    }

    public UserPoint login(UserPoint userPointLogin) {
        UserPoint existingUserPoint = userPointRepository.findByPointEmailAndPassword(userPointLogin.getEmail(), userPointLogin.getPassword());
        if (existingUserPoint == null) {
            return new UserPoint();
        }
        return existingUserPoint;
    }
}

