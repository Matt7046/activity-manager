package com.userPointService.service;

import com.common.confProperties.ArithmeticProperties;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.user.UserPoint;
import com.common.dto.auth.Point;
import com.common.dto.user.UserPointDTO;
import com.common.mapper.UserPointMapper;
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

    public UserPoint getPointByEmail(String email) {
        String emailCriypt = encryptDecryptConverter.convert(email);

        UserPoint existingUserPoint = userPointRepository.findByEmailOnEmail(emailCriypt);
        if (existingUserPoint == null) {
            List<UserPoint> userPointList = userPointRepository.findByOnFigli(emailCriypt);
            existingUserPoint = !userPointList.isEmpty() ? userPointList.get(0) : null;
        }
        if (existingUserPoint == null) {
            return new UserPoint();
        }
        existingUserPoint.setEmailFigli(existingUserPoint.getEmailFigli().stream().map(x ->
                encryptDecryptConverter.decrypts(x)).collect(Collectors.toList())); // Crittografa l'email

        return existingUserPoint;
    }

    public List<UserPoint> getPointsListByEmail(String email) throws Exception {
        String emailCriypt = encryptDecryptConverter.convert(email);
        List<UserPoint> userPointList = userPointRepository.findByOnFigli(emailCriypt);
        return userPointList;
    }

    public UserPoint savePoint(UserPointDTO userPointDTO) throws Exception {
        UserPoint userPointSave = UserPointMapper.INSTANCE.fromDTO(userPointDTO);
        String emailCriypt = encryptDecryptConverter.convert(userPointSave.getEmailFamily());

        UserPoint existingUserPoint = userPointRepository.findByEmailOnEmail(emailCriypt);
        if (existingUserPoint == null) {
            List<UserPoint> userPointList = userPointRepository.findByOnFigli(emailCriypt);
            existingUserPoint = !userPointList.isEmpty() ? userPointList.get(0) : null;
        }

        assert existingUserPoint != null;
        existingUserPoint.getPoints().stream()
                .filter(point -> emailCriypt != null && emailCriypt.equals(point.getEmail()))
                .findFirst()
                .ifPresent(point -> {
                    long delta = userPointDTO.getOperation() ? userPointDTO.getUsePoints() : -userPointDTO.getUsePoints();
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

    public UserPoint rollbackSavePoint(UserPointDTO userPointDTO) throws Exception {
        userPointDTO.setOperation(!userPointDTO.getOperation());
        return savePoint(userPointDTO);
    }

    public UserPoint save(UserPointDTO userPointDTO) throws Exception {
        UserPoint sub = UserPointMapper.INSTANCE.fromDTO(userPointDTO);
        return userPointRepository.save(sub);
    }

    public Boolean saveUser(UserPointDTO userPointDTO) throws Exception {
        UserPoint userPointSave = UserPointMapper.INSTANCE.fromDTO(userPointDTO);
        Boolean newUSer = false;
        if (userPointSave.getEmail() != null && !userPointSave.getEmailFigli().isEmpty()) {
            newUSer = true;
            userPointSave.setType(1L);
            userPointSave.getPoints()
                    .forEach(point -> point.setPoints(100L));
            userPointRepository.save(userPointSave);
        }
        return newUSer;
    }


    public Long getTypeUser(UserPointDTO pointsSave) throws Exception {
        UserPoint points = UserPointMapper.INSTANCE.fromDTO(pointsSave);
        String email = encryptDecryptConverter.convert(pointsSave.getEmailFamily());
        List<UserPoint> existUserPointOnFigli = userPointRepository.findByOnFigli(email);
        UserPoint existUserPoint = userPointRepository.findByEmailOnEmail(email);
        return Optional.ofNullable(existUserPoint)
                .map(p -> 1L)
                .orElseGet(() ->
                        (existUserPointOnFigli != null && !existUserPointOnFigli.isEmpty()) ? 0L : 2L
                );
    }

    public UserPoint saveUserImage(UserPointDTO userPointDTO) throws Exception {
        UserPoint points = UserPointMapper.INSTANCE.fromDTO(userPointDTO);
        String emailCriypt = encryptDecryptConverter.convert(userPointDTO.getEmailFamily());
        UserPoint existingUserPoint = userPointRepository.findFirstMatchByEmailOrFigli(emailCriypt);
        assert existingUserPoint != null;
        existingUserPoint =decryptExistingUserPoint(existingUserPoint);
        List<Point> updatedPoints = existingUserPoint.getPoints().stream()
                .map(point -> ovverideNameImage(points, point))
                .collect(Collectors.toList());
        existingUserPoint.setPoints(updatedPoints);
        return userPointRepository.save(existingUserPoint);
    }

    private UserPoint decryptExistingUserPoint(UserPoint existingUserPoint) {
        existingUserPoint.setEmail(encryptDecryptConverter.decrypt(existingUserPoint.getEmail()));
        existingUserPoint.setEmailFamily(encryptDecryptConverter.decrypt(existingUserPoint.getEmailFamily()));
        existingUserPoint.setEmailFigli(existingUserPoint.getEmailFigli().stream()
                .map(figlio -> encryptDecryptConverter.decrypt(figlio))
                .collect(Collectors.toList()));
        existingUserPoint.setPoints(existingUserPoint.getPoints().stream()
                .peek(point -> point.setEmail(encryptDecryptConverter.decrypt(point.getEmail())))
                .collect(Collectors.toList()));
        return existingUserPoint;
    }


    private Point ovverideNameImage(UserPoint userPointSave, Point point) {
        if (!point.getEmail().equals(userPointSave.getEmailFamily())) {
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

