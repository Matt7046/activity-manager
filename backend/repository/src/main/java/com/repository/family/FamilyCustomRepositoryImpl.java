package com.repository.family;

import com.common.configurations.EncryptDecryptConverter;
import com.common.data.Point;
import com.repository.point.PointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import java.util.List;

public class FamilyCustomRepositoryImpl implements FamilyCustomRepository {

	@Lazy
	@Autowired
	private PointRepository pointsRepository;
	@Autowired
	private EncryptDecryptConverter encryptDecryptConverter;

	public Long getTypeUser(Point pointsSave) throws Exception {
		String email = encryptDecryptConverter.convert(pointsSave.getEmailFamily());
		List<Point> existPointsOnFigli = pointsRepository.findByOnFigli(email);
		Point existPoints = pointsRepository.findByEmailOnEmail(email);
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

	public Boolean saveUser(Point pointsSave) throws Exception {
		Boolean newUSer = false;
		String email = encryptDecryptConverter.convert(pointsSave.getEmail());

		if (pointsSave.getEmail() != null && !pointsSave.getEmailFigli().isEmpty()) {
			newUSer = true;
			pointsSave.setType(1L);
			pointsSave.getPoints().stream()
					// .filter(point -> emailCrypt.equals(point.email())) // Filtra per email
					// .findFirst() // Trova il primo match
					.forEach(point -> point.setPoints(100L)); // Aggior
			// pointsSave.setPoints(new PointsUser(100L, email));
			pointsRepository.save(pointsSave);

		}
		return newUSer;// Restituisci l'ID aggiornato
	}

}