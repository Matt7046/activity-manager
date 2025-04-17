package com.repository.family;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.user.UserPoint;
import com.repository.userPoint.UserPointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import java.util.List;

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
		Long type;
		if (existPoints != null) {
			type = 1L;
		} else if (existPointsOnFigli != null && !existPointsOnFigli.isEmpty()) {
			type = 0L;
		} else {
			// Gestisci il caso in cui entrambi sono null, se necessario
			type = 2L; // O un altro valore predefinito appropriato
		}

		return type;// Restituisci l'ID aggiornato
	}

	public Boolean saveUser(UserPoint pointsSave) throws Exception {
		Boolean newUSer = false;
		String email = encryptDecryptConverter.convert(pointsSave.getEmail());

		if (pointsSave.getEmail() != null && !pointsSave.getEmailFigli().isEmpty()) {
			newUSer = true;
			pointsSave.setType(1L);
			pointsSave.getPoints().stream()
					// .filter(point -> emailCrypt.equals(point.email())) // Filtra per email
					// .findFirst() // Trova il primo match
					.forEach(point -> point.setPoints(100L)); // Aggior
			// pointsSave.setPoints(new Point(100L, email));
			pointsRepository.save(pointsSave);

		}
		return newUSer;// Restituisci l'ID aggiornato
	}

}