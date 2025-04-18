package com.repository.family;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.user.UserPoint;
import com.repository.userPoint.UserPointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import java.util.List;
import java.util.Optional;

public class FamilyCustomRepositoryImpl implements FamilyCustomRepository {

    @Lazy
    @Autowired
    private UserPointRepository pointsRepository;
    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;

    public Long getTypeUser(UserPoint pointsSave) throws Exception {
        String email = encryptDecryptConverter.convert(pointsSave.getEmailFamily());
        List<UserPoint> existPointsOnFigli = pointsRepository.findByOnFigli(email);
        UserPoint existPoints = pointsRepository.findByEmailOnEmail(email);
        Long type = Optional.ofNullable(existPoints)
                .map(p -> 1L)
                .orElseGet(() ->
                        (existPointsOnFigli != null && !existPointsOnFigli.isEmpty()) ? 0L : 2L
                );

        return type;// Restituisci l'ID aggiornato
    }

    public Boolean saveUser(UserPoint pointsSave) throws Exception {
        Boolean newUSer = false;
        if (pointsSave.getEmail() != null && !pointsSave.getEmailFigli().isEmpty()) {
            newUSer = true;
            pointsSave.setType(1L);
            pointsSave.getPoints()
                    .forEach(point -> point.setPoints(100L)); // Aggior
            pointsRepository.save(pointsSave);

        }
        return newUSer;// Restituisci l'ID aggiornato
    }

}