package com.repository.userPoint;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.common.data.user.UserPoint;
import com.common.dto.auth.Point;
import com.common.confProperties.ArithmeticProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.structure.exception.ArithmeticCustomException;

public class UserPointCustomRepositoryImpl implements UserPointCustomRepository {

    @Lazy
    @Autowired
    private UserPointRepository pointRepository;
    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;
    @Autowired
    private ArithmeticProperties arithmeticProperties;

    @Override
    public Long getTypeUser(UserPoint userPointSave) {
        String email = encryptDecryptConverter.convert(userPointSave.getEmailFamily());
        List<UserPoint> existUserPointOnFigli = pointRepository.findByOnFigli(email);
        UserPoint existUserPoint = pointRepository.findByEmailOnEmail(email);
        return Optional.ofNullable(existUserPoint)
                .map(p -> 1L)
                .orElseGet(() ->
                        (existUserPointOnFigli != null && !existUserPointOnFigli.isEmpty()) ? 0L : 2L
                );
    }

    @Override
    public Boolean saveUser(UserPoint userPointSave) {
        Boolean newUSer = false;
        if (userPointSave.getEmail() != null && !userPointSave.getEmailFigli().isEmpty()) {
            newUSer = true;
            userPointSave.setType(1L);
            userPointSave.getPoints()
                    .forEach(point -> point.setPoints(100L));
            pointRepository.save(userPointSave);
        }
        return newUSer;
    }
    @Override
    public UserPoint getPointByEmail(String email) {
        String emailCriypt = encryptDecryptConverter.convert(email);

        UserPoint existingUserPoint = pointRepository.findByEmailOnEmail(emailCriypt);
        if (existingUserPoint == null) {
            List<UserPoint> userPointList = pointRepository.findByOnFigli(emailCriypt);
            existingUserPoint = !userPointList.isEmpty() ? userPointList.get(0) : null;
        }
        if (existingUserPoint == null) {
            return new UserPoint();
        }
        existingUserPoint.setEmailFigli(existingUserPoint.getEmailFigli().stream().map(x ->
                encryptDecryptConverter.decrypts(x)).collect(Collectors.toList())); // Crittografa l'email

        return existingUserPoint;
    }
    @Override
    public UserPoint savePoint(UserPoint userPointSave, Long usePoint, Boolean operation) {
        String emailCriypt = encryptDecryptConverter.convert(userPointSave.getEmailFamily());

        UserPoint existingUserPoint = pointRepository.findByEmailOnEmail(emailCriypt);
        if (existingUserPoint == null) {
            List<UserPoint> userPointList = pointRepository.findByOnFigli(emailCriypt);
            existingUserPoint = !userPointList.isEmpty() ? userPointList.get(0) : null;
        }

        assert existingUserPoint != null;
        existingUserPoint.getPoints().stream()
                .filter(point -> emailCriypt != null && emailCriypt.equals(point.getEmail()))
                .findFirst()
                .ifPresent(point -> {
                    long delta = operation ? usePoint : -usePoint;
                    long updatedPoint = point.getPoints() + delta;
                    if (updatedPoint < 0) {
                        throw new ArithmeticCustomException(arithmeticProperties.getArithmetic());
                    }
                    point.setPoints(updatedPoint);
                });

        // Aggiorna i punti per l'utente esistente
        // existingUserPoint.setPoint(new PointUser(newPoint, emailCriypt));
        existingUserPoint.setEmail(encryptDecryptConverter.decrypt(existingUserPoint.getEmail()));
        existingUserPoint.setEmailFamily(encryptDecryptConverter.decrypt(existingUserPoint.getEmailFamily()));
        existingUserPoint.setEmailFigli(existingUserPoint.getEmailFigli().stream()
                .map(figlio -> encryptDecryptConverter.decrypt(figlio))
                .collect(Collectors.toList()));
        pointRepository.save(existingUserPoint);
        return existingUserPoint;

    }
    @Override
    public UserPoint saveUserImage(UserPoint userPointSave) {
        String emailCriypt = encryptDecryptConverter.convert(userPointSave.getEmailFamily());

        UserPoint existingUserPoint = pointRepository.findByEmailOnEmail(emailCriypt);
        if (existingUserPoint == null) {
            List<UserPoint> userPointList = pointRepository.findByOnFigli(emailCriypt);
            existingUserPoint = !userPointList.isEmpty() ? userPointList.get(0) : null;
        }
        assert existingUserPoint != null;
        existingUserPoint.setEmail(encryptDecryptConverter.decrypt(existingUserPoint.getEmail()));
        existingUserPoint.setEmailFamily(encryptDecryptConverter.decrypt(existingUserPoint.getEmailFamily()));
        existingUserPoint.setEmailFigli(existingUserPoint.getEmailFigli().stream()
                .map(figlio -> encryptDecryptConverter.decrypt(figlio))
                .collect(Collectors.toList()));
        List<Point> updatedPoints = existingUserPoint.getPoints().stream()
                .map(point ->  ovverideNameImage(userPointSave, point))
                .collect(Collectors.toList());

        existingUserPoint.setPoints(updatedPoints);
        pointRepository.save(existingUserPoint);
        return existingUserPoint;
    }

    @Override
    public List<UserPoint> getPointsListByEmail(String email) {
        String emailCriypt = encryptDecryptConverter.convert(email);

        List<UserPoint> userPointList = pointRepository.findByOnFigli(emailCriypt);
        return userPointList;
    }

    private Point ovverideNameImage(UserPoint userPointSave, Point point) {
        String encryptedEmail = encryptDecryptConverter.convert(userPointSave.getEmailFamily());

        if (!point.getEmail().equals(encryptedEmail)) {
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