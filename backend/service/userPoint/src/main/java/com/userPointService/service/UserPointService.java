package com.userPointService.service;

import com.common.confProperties.ArithmeticProperties;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.user.UserPoint;
import com.common.dto.auth.Point;
import com.common.structure.exception.ArithmeticCustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.repository.userPoint.UserPointRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserPointService {
    @Autowired
    private UserPointRepository userPointRepository;

    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;

    @Autowired
    private ArithmeticProperties arithmeticProperties;

    public List<UserPoint> findAll() {
        return userPointRepository.findAll();
    }

    public UserPoint findByEmail(String identificativo, Long type) {
        return userPointRepository.findByEmail(identificativo, type);
    }

    public UserPoint getPointByEmail(String emailCriypt) {
        UserPoint existingUserPoint = userPointRepository.findByEmailOnEmail(emailCriypt);
        if (existingUserPoint == null) {
            List<UserPoint> userPointList = userPointRepository.findByOnFigli(emailCriypt);
            existingUserPoint = !userPointList.isEmpty() ? userPointList.get(0) : null;
        }
        if (existingUserPoint == null) {
            return new UserPoint();
        }
        existingUserPoint.setEmailFigli(existingUserPoint.getEmailFigli().stream().map(x ->
                encryptDecryptConverter.decrypt(x)).collect(Collectors.toList())); // Crittografa l'email

        return existingUserPoint;
    }

    public UserPoint savePoint(UserPoint userPoint){

        UserPoint existingUserPoint = userPointRepository.findByEmailOnEmail(userPoint.getEmailFamily());
        if (existingUserPoint == null) {
            List<UserPoint> userPointList = userPointRepository.findByOnFigli(userPoint.getEmailFamily());
            existingUserPoint = !userPointList.isEmpty() ? userPointList.get(0) : null;
        }

        assert existingUserPoint != null;
        existingUserPoint.getPointFigli().stream()
                .filter(point -> userPoint.getEmailFamily() != null && userPoint.getEmailFamily().equals(point.getEmail()))
                .findFirst()
                .ifPresent(point -> {
                    long delta = userPoint.getOperation() ? userPoint.getUsePoints() : -userPoint.getUsePoints();
                    long updatedPoint = point.getPoints() + delta;
                    if (updatedPoint < 0) {
                        throw new ArithmeticCustomException(arithmeticProperties.getArithmetic());
                    }
                    point.setPoints(updatedPoint);
                });
        existingUserPoint = decryptExistingUserPoint(existingUserPoint);
        userPointRepository.save(existingUserPoint);
        return existingUserPoint;
    }

    public UserPoint rollbackSavePoint(UserPoint userPoint)  {
        userPoint.setOperation(!userPoint.getOperation());
        return savePoint(userPoint);
    }

    public UserPoint saveUser(UserPoint userPoint) {
           return userPointRepository.save(userPoint);
    }


    public Long getTypeUser(UserPoint point)  {
        List<UserPoint> existUserPointOnFigli = userPointRepository.findByOnFigli(point.getEmailFamily());
        UserPoint existUserPoint = userPointRepository.findByEmailOnEmail(point.getEmailFamily());
        return Optional.ofNullable(existUserPoint)
                .map(p -> 1L)
                .orElseGet(() ->
                        (existUserPointOnFigli != null && !existUserPointOnFigli.isEmpty()) ? 0L : 2L
                );
    }

    public UserPoint saveUserImage(UserPoint userPoint) throws Exception {

        UserPoint existingUserPoint = userPointRepository.findFirstMatchByEmailOrFigli(userPoint.getEmailFamily());
        userPoint.setEmailFamily(encryptDecryptConverter.decrypt(userPoint.getEmailFamily()));
        assert existingUserPoint != null;
        existingUserPoint =decryptExistingUserPoint(existingUserPoint);
        List<Point> updatedPoints = existingUserPoint.getPointFigli().stream()
                .map(point -> ovverideNameImage(userPoint, point))
                .collect(Collectors.toList());
        existingUserPoint.setPointFigli(updatedPoints);
        return userPointRepository.save(existingUserPoint);
    }


    private UserPoint decryptExistingUserPoint(UserPoint existingUserPoint) {
        existingUserPoint.setEmail(encryptDecryptConverter.decrypt(existingUserPoint.getEmail()));
        existingUserPoint.setEmailFamily(encryptDecryptConverter.decrypt(existingUserPoint.getEmailFamily()));
        existingUserPoint.setEmailFigli(existingUserPoint.getEmailFigli().stream()
                .map(figlio -> encryptDecryptConverter.decrypt(figlio))
                .collect(Collectors.toList()));
        existingUserPoint.setPointFigli(existingUserPoint.getPointFigli().stream()
                .peek(point -> point.setEmail(encryptDecryptConverter.decrypt(point.getEmail())))
                .collect(Collectors.toList()));
        return existingUserPoint;
    }

    private Point ovverideNameImage(UserPoint userPointSave, Point point) {
        if (!userPointSave.getEmailFamily().equals(point.getEmail())) {
            return point;
        }
        List<String> existingNames = Optional.ofNullable(point.getNameImage()).orElse(new ArrayList<>());
        boolean nameExists = existingNames.stream()
                .anyMatch(name -> verifyNameImage(name, userPointSave));

        List<String> updatedNames = existingNames.stream()
                .map(name -> verifyNameImage(name, userPointSave)
                        ? userPointSave.getNameImage()
                        : name)
                .collect(Collectors.toList());
        if (!nameExists) {
            updatedNames.add(userPointSave.getNameImage());
        }
        point.setNameImage(updatedNames);
        return point;
    }

    private boolean verifyNameImage(String x, UserPoint userPointSave) {
        // Estrai la parte finale dell'URL dopo l'ultimo "/"
        String fileNamex = x.substring(x.lastIndexOf('/') + 1);
        String fileNamexWithoutExtension = fileNamex.contains(".")
                ? fileNamex.substring(0, fileNamex.lastIndexOf('.'))
                : fileNamex;

        String fileNameUserPoint = userPointSave.getNameImage().substring(userPointSave.getNameImage().lastIndexOf('/') + 1);
        String fileNameWithoutExtension = fileNameUserPoint.contains(".")
                ? fileNameUserPoint.substring(0, fileNameUserPoint.lastIndexOf('.'))
                : fileNameUserPoint;
        // Confronta con il nome immagine atteso
        return fileNamexWithoutExtension.equals(fileNameWithoutExtension);
    }
}

