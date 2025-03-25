package com.repository.points;


import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.common.configurations.EncryptDecryptConverter;
import com.common.data.Points;
import com.common.exception.ArithmeticCustomException;

public class PointsCustomRepositoryImpl implements PointsCustomRepository {

	@Lazy
	@Autowired
	private PointsRepository pointsRepository;
	@Autowired
	private EncryptDecryptConverter encryptDecryptConverter;

	public Long getTypeUser(Points pointsSave) throws Exception {
		String email = encryptDecryptConverter.convert(pointsSave.getEmailFamily());
		List<Points> existPointsOnFigli = pointsRepository.findByOnFigli(email);
		Points existPoints = pointsRepository.findByEmailOnEmail(email);
		Long type;
		if (existPoints != null) {
			type = 1L;
		} else if (existPointsOnFigli != null && !existPointsOnFigli.isEmpty()) {
			type = 0L;
		} else {
			type = 2L; 
		}

		return type;
	}

	public Boolean saveUser(Points pointsSave) throws Exception {
		Boolean newUSer = false;
		if (pointsSave.getEmail() != null && !pointsSave.getEmailFigli().isEmpty()) {
			newUSer = true;
			pointsSave.setType(1L);
			pointsSave.getPoints().stream()				
					.forEach(point -> point.setPoints(100L)); 		
			pointsRepository.save(pointsSave);
		}
		return newUSer;
	}

	public Points getPointsByEmail(String email) throws Exception {
		String emailCriypt = encryptDecryptConverter.convert(email);

		Points existingUser = pointsRepository.findByEmailOnEmail(emailCriypt);
		if (existingUser == null) {
			List<Points> userList = pointsRepository.findByOnFigli(emailCriypt);
			existingUser = !userList.isEmpty() ? userList.get(0) : null;
		}
		if (existingUser == null) {
			return new Points();
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

	public Points savePoints(Points pointsSave, Long usePoints, Boolean operation) throws Exception {
		String emailCriypt = encryptDecryptConverter.convert(pointsSave.getEmailFamily());

		Points existingUser = pointsRepository.findByEmailOnEmail(emailCriypt);
		if (existingUser == null) {
			List<Points> userList = pointsRepository.findByOnFigli(emailCriypt);
			existingUser = !userList.isEmpty() ? userList.get(0) : null;
		}

		existingUser.getPoints().stream()
				.filter(point -> pointsSave.getEmailFamily().equals(point.getEmail())) // Filtra per email
				.findFirst() // Trova il primo match
				.ifPresent(point -> {
					// Calcola i nuovi punti
					Long updatedPoints = point.getPoints() + (operation ? usePoints : -usePoints);

					// Verifica che i punti non siano negativi
					if (updatedPoints < 0L) {
						throw new ArithmeticCustomException("I punti devono essere maggiori o uguali a zero.");
					}

					// Aggiorna i punti solo se la condizione è soddisfatta
					point.setPoints(updatedPoints);
				});
		// Aggiorna i punti per l'utente esistente
		// existingUser.setPoints(new PointsUser(newPoints, emailCriypt));
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