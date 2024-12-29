package com.webapp.repository.Points;

import java.util.ArrayList;
import java.util.List;

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

	public String savePoints(Points pointsSave) throws Exception {
		Long usePoints = pointsSave.getPoints() == null ? 100L : pointsSave.getPoints();
		// Verifica se esiste già un documento con l'identificativo
		Points existingUser = null;
		Points existingUserFamily = null;
		String emailFamily = encryptDecryptConverter.convert(pointsSave.getEmailFamily());
		String email = encryptDecryptConverter.convert(pointsSave.getEmail());
		String _id = null;
		if (pointsSave.getEmailFamily() != null) {
			existingUserFamily = pointsRepository.findByEmailFamilyAndEmail(emailFamily, email);
			if (existingUserFamily == null) {
				// Se esiste, aggiorna i campi
				existingUserFamily = new Points();
				existingUserFamily.setType(1L);
				existingUserFamily.setPoints(usePoints);
				existingUserFamily.setEmail(pointsSave.getEmail());
				existingUserFamily.setEmailFamily(pointsSave.getEmailFamily());
				pointsSave.setType(0L);
				existingUserFamily = pointsRepository.save(existingUserFamily);
			}
			_id = existingUserFamily.getEmail();
		} else {
			existingUser = pointsRepository.findByEmail(email, 0L);
			if (existingUser == null) {
				// Se esiste, aggiorna i campi
				pointsSave.setPoints(usePoints);
				pointsSave = pointsRepository.save(pointsSave);
			}
			_id = pointsSave.getEmail();
		}
		return _id;// Restituisci l'ID aggiornato
	}

	public Points savePointsByTypeStandard(Points pointsSave, Long usePoints, Boolean operation) throws Exception {
		// Verifica se esiste già un documento con l'identificativo
		String emailCriypt = encryptDecryptConverter.convert(pointsSave.getEmail());
		Points existingUser = pointsRepository.findByEmail(emailCriypt, 0L);
		List<Points> existingUsersFamily = new ArrayList<>();
		if (pointsSave.getEmail() != null) {
			existingUsersFamily = pointsRepository.findFamilyEmailByEmail(emailCriypt);
		}
		usePoints = usePoints != null ? usePoints : 0L;
		Long newPoints = 0L;
		if (operation == true) {
			newPoints = existingUser.getPoints() + usePoints;
		} else {
			newPoints = existingUser.getPoints() - usePoints;
		}
		if (newPoints < 0L) {
			throw new ArithmeticCustomException("I punti devono essere maggiori di zero.");
		}

		// Aggiorna i punti per l'utente esistente
		existingUser.setPoints(newPoints);
		existingUser.setEmail(encryptDecryptConverter.decrypt(existingUser.getEmail()));
		existingUser.setEmailFamily(encryptDecryptConverter.decrypt(existingUser.getEmailFamily()));
		final long[] pointsWrapper = { newPoints };
		// Utilizzo degli stream per aggiornare i punti per ogni membro della famiglia
		// Aggiorna i punti per ogni membro della famiglia
		existingUsersFamily.forEach(points -> {
			points.setPoints(pointsWrapper[0]);
			try {
				points.setEmail(encryptDecryptConverter.decrypt(points.getEmail()));
				points.setEmailFamily(encryptDecryptConverter.decrypt(points.getEmailFamily()));
			} catch (Exception e) {
				e.printStackTrace(); // Gestione dell'eccezione
			}
		});

		// Salva l'utente aggiornato e i membri della famiglia
		pointsRepository.save(existingUser);
		pointsRepository.saveAll(existingUsersFamily);
		return existingUser;// Restituisci l'ID aggiornato
	}
}