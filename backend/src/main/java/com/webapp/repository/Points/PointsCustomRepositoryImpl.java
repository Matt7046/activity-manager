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
		if (pointsSave.getEmail() != null) {
			String emailCrypt = encryptDecryptConverter.convert(pointsSave.getEmail());
			existingUser = pointsRepository.findByEmail(emailCrypt);
			if (existingUser == null) {
				// Se esiste, aggiorna i campi
				pointsSave.setPoints(100L);
			} else {
				usePoints = usePoints != null ? usePoints : 0L;
				Long newPoints = existingUser.getPoints() - usePoints;
				if (newPoints < 0L) {
					throw new ArithmeticCustomException("I punti devono essere maggiori di zero.");
				}
				pointsSave.set_id(existingUser.get_id());			
				pointsSave.setPoints(newPoints);
			}
			pointsSave = pointsRepository.save(pointsSave);
		}
		return pointsSave.get_id();// Restituisci l'ID aggiornato
	}
}