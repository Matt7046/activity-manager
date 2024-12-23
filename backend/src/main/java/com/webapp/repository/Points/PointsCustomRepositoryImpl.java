package com.webapp.repository.Points;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.webapp.data.Points;
import com.webapp.dto.PointsDTO;

public class PointsCustomRepositoryImpl implements PointsCustomRepository {

	@Lazy
	@Autowired
	private PointsRepository pointsRepository;

	public String savePoints(PointsDTO pointsDTO) {
		// Verifica se esiste già un documento con l'identificativo
		Points existingUser = null;
		if (pointsDTO.getEmail() != null) {
			existingUser = pointsRepository.findByEmail(pointsDTO.getEmail());
			if (existingUser == null) {
				// Se esiste, aggiorna i campi
				Points newUser = new Points();
				newUser.setPoints(100L);
				newUser.setEmail(pointsDTO.getEmail());
				existingUser = pointsRepository.save(newUser);
			}
		}

		return existingUser.get_id();// Restituisci l'ID aggiornato
	}
}