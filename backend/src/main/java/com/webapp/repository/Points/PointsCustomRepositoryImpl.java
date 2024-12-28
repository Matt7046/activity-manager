package com.webapp.repository.Points;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.webapp.EncryptDecryptConverter;
import com.webapp.data.Points;

import Exception.ArithmeticCustomException;

public class PointsCustomRepositoryImpl implements PointsCustomRepository {

	@Lazy
	@Autowired
	private PointsRepository pointsRepository;
	@Autowired
	private EncryptDecryptConverter encryptDecryptConverter;

	public String savePoints(Points pointsSave, Long usePoints) throws Exception {
		// Verifica se esiste già un documento con l'identificativo
		Points existingUser = null;
		Points user = new Points();
		if (pointsSave.getEmail() != null) {
			String emailCrypt = encryptDecryptConverter.convert(pointsSave.getEmail());
			existingUser = pointsRepository.findByEmail(emailCrypt);
			if (existingUser == null) {
				// Se esiste, aggiorna i campi
				user.setPoints(100L);
				user.setEmail(pointsSave.getEmail());
			} else {
				usePoints = usePoints != null ? usePoints : 0L;
				Long newPoints = existingUser.getPoints() - usePoints;
				if (newPoints < 0L) {
					throw new ArithmeticCustomException("I punti devono essere maggiori di zero.");
				}
				user = existingUser;
				user.setEmail(pointsSave.getEmail());
				user.setPoints(newPoints);
			}
			user = pointsRepository.save(user);
		}
		return existingUser.get_id();// Restituisci l'ID aggiornato
	}
}