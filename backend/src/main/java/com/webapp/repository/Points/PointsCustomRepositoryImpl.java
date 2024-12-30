package com.webapp.repository.Points;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

	public Long getUserType(Points pointsSave) throws Exception {
		String email = encryptDecryptConverter.convert(pointsSave.getEmail());
		List<Points> existPointsOnFigli = pointsRepository.findByOnFigli(email);
		Points existPoints = pointsRepository.findByEmailOnEmail(email);
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

	public Boolean saveFamily(Points pointsSave) throws Exception {
		Boolean newUSer = false;

		if (pointsSave.getEmail() != null && !pointsSave.getEmailFigli().isEmpty()) {
			newUSer = true;
			pointsSave.setType(1L);
			pointsSave.setPoints(100L);
			pointsRepository.save(pointsSave);

		}
		return newUSer;// Restituisci l'ID aggiornato
	}

	public Points getPointsByEmail(String email) throws Exception {
		String emailCriypt = encryptDecryptConverter.convert(email);

		Points existingUser = pointsRepository.findByEmailOnEmail(emailCriypt);
		if (existingUser == null) {
			List<Points> userList = pointsRepository.findByOnFigli(emailCriypt);
			existingUser = !userList.isEmpty() ? userList.get(0) : null;
		}
		existingUser.setEmailFigli(existingUser.getEmailFigli().stream().map(x -> {
			try {
				return encryptDecryptConverter.decrypts(x);
			} catch (Exception e) {			
			}
			return x;
		}).collect(Collectors.toList())); // Crittografa l'email
	
		return existingUser;
	}

	public Points savePointsByTypeStandard(Points pointsSave, Long usePoints, Boolean operation) throws Exception {
		// Verifica se esiste già un documento con l'identificativo
		String emailCriypt = encryptDecryptConverter.convert(pointsSave.getEmail());

		Points existingUser = pointsRepository.findByEmailOnEmail(emailCriypt);
		if (existingUser == null) {
			List<Points> userList = pointsRepository.findByOnFigli(emailCriypt);
			existingUser = !userList.isEmpty() ? userList.get(0) : null;
		}

		if (pointsSave.getEmail() != null) {
			// existingUsersFamily = pointsRepository.findFamilyEmailByEmail(emailCriypt);
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
		existingUser.setEmailFigli(existingUser.getEmailFigli().stream()
				.map(figlio -> {
					try {
						return encryptDecryptConverter.decrypt(figlio);
					} catch (Exception e) {
					}
					return "";
				})
				.collect(Collectors.toList()));
		pointsRepository.save(existingUser);
		return existingUser;

	}

	@Override
	public List<Points> getPointsListByEmail(String email) throws Exception {
		String emailCriypt = encryptDecryptConverter.convert(email);

		List<Points> userList = pointsRepository.findByOnFigli(emailCriypt);
		return userList;
	}
}