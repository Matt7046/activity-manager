package com.webapp.repository.Points;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.webapp.EncryptDecryptConverter;
import com.webapp.data.Points;
import com.webapp.dto.PointsDTO;

import Exception.ArithmeticCustomException;

public class PointsCustomRepositoryImpl implements PointsCustomRepository {

	@Lazy
	@Autowired
	private PointsRepository pointsRepository;
	@Autowired
	private EncryptDecryptConverter encryptDecryptConverter;

	public String savePoints(PointsDTO pointsDTO) throws Exception {
		// Verifica se esiste già un documento con l'identificativo
		Points existingUser = null;
		Points user = new Points();
		if (pointsDTO.getEmail() != null) {
			String emailCrypt = encryptDecryptConverter.convert(pointsDTO.getEmail());
			existingUser = pointsRepository.findByEmail(emailCrypt);
			if (existingUser == null) {
				// Se esiste, aggiorna i campi
				user.setPoints(100L);
				user.setEmail(pointsDTO.getEmail());
			} else {
				Long usePoints = pointsDTO.getUsePoints() != null ? pointsDTO.getUsePoints() : 0L;
				Long newPoints = existingUser.getPoints() - usePoints;
				if (newPoints < 0L) {
					throw new ArithmeticCustomException("I punti devono essere maggiori di zero.");
				}
				user = existingUser;
				user.setEmail(pointsDTO.getEmail());
				user.setPoints(newPoints);
			}
			user = pointsRepository.save(user);
		}
		return existingUser.get_id();// Restituisci l'ID aggiornato
	}
}