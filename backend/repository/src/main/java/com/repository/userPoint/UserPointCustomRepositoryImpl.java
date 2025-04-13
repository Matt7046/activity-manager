package com.repository.userPoint;


import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import com.common.data.UserPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.common.configurations.EncryptDecryptConverter;
import com.common.exception.ArithmeticCustomException;

public class UserPointCustomRepositoryImpl implements UserPointCustomRepository {

	@Lazy
	@Autowired
	private UserPointRepository PointRepository;
	@Autowired
	private EncryptDecryptConverter encryptDecryptConverter;

	public Long getTypeUser(UserPoint userPointSave) throws Exception {
		String email = encryptDecryptConverter.convert(userPointSave.getEmailFamily());
		List<UserPoint> existUserPointOnFigli = PointRepository.findByOnFigli(email);
		UserPoint existUserPoint = PointRepository.findByEmailOnEmail(email);
		Long type;
		type = (isExistPointValid(existUserPoint)) ? 1L
				: isExistPointOnFigliValid(existUserPointOnFigli) ? 0L
						: 2L;

		return type;
	}

	private boolean isExistPointValid(Object existPoint) {
		return existPoint != null;
	}

	private boolean isExistPointOnFigliValid(Collection<?> existPointOnFigli) {
		return existPointOnFigli != null && !existPointOnFigli.isEmpty();
	}

	public Boolean saveUser(UserPoint userPointSave) throws Exception {
		Boolean newUSer = false;
		if (userPointSave.getEmail() != null && !userPointSave.getEmailFigli().isEmpty()) {
			newUSer = true;
			userPointSave.setType(1L);
			userPointSave.getPoints().stream()
					.forEach(point -> point.setPoints(100L));
			PointRepository.save(userPointSave);
		}
		return newUSer;
	}

	public UserPoint getPointByEmail(String email) throws Exception {
		String emailCriypt = encryptDecryptConverter.convert(email);

		UserPoint existingUserPoint = PointRepository.findByEmailOnEmail(emailCriypt);
		if (existingUserPoint == null) {
			List<UserPoint> userPointList = PointRepository.findByOnFigli(emailCriypt);
			existingUserPoint = !userPointList.isEmpty() ? userPointList.get(0) : null;
		}
		if (existingUserPoint == null) {
			return new UserPoint();
		}
		existingUserPoint.setEmailFigli(existingUserPoint.getEmailFigli().stream().map(x ->
				encryptDecryptConverter.decrypts(x)).collect(Collectors.toList())); // Crittografa l'email

		return existingUserPoint;
	}

	public UserPoint savePoint(UserPoint userPointSave, Long usePoint, Boolean operation) throws Exception {
		String emailCriypt = encryptDecryptConverter.convert(userPointSave.getEmailFamily());

		UserPoint existingUserPoint = PointRepository.findByEmailOnEmail(emailCriypt);
		if (existingUserPoint == null) {
			List<UserPoint> userPointList = PointRepository.findByOnFigli(emailCriypt);
			existingUserPoint = !userPointList.isEmpty() ? userPointList.get(0) : null;
		}

		existingUserPoint.getPoints().stream()
				.filter(point -> userPointSave.getEmailFamily().equals(point.getEmail())) // Filtra per email
				.findFirst() // Trova il primo match
				.ifPresent(point -> {
					// Calcola i nuovi punti
					Long updatedPoint = point.getPoints() + (operation ? usePoint : -usePoint);

					// Verifica che i punti non siano negativi
					if (updatedPoint < 0L) {
						throw new ArithmeticCustomException("I punti devono essere maggiori o uguali a zero.");
					}

					// Aggiorna i punti solo se la condizione è soddisfatta
					point.setPoints(updatedPoint);
				});
		// Aggiorna i punti per l'utente esistente
		// existingUserPoint.setPoint(new PointUser(newPoint, emailCriypt));
		existingUserPoint.setEmail(encryptDecryptConverter.decrypt(existingUserPoint.getEmail()));
		existingUserPoint.setEmailFamily(encryptDecryptConverter.decrypt(existingUserPoint.getEmailFamily()));
		existingUserPoint.setEmailFigli(existingUserPoint.getEmailFigli().stream()
				.map(figlio -> encryptDecryptConverter.decrypt(figlio))
				.collect(Collectors.toList()));
		PointRepository.save(existingUserPoint);
		return existingUserPoint;

	}

	@Override
	public List<UserPoint> getPointsListByEmail(String email) throws Exception {
		String emailCriypt = encryptDecryptConverter.convert(email);

		List<UserPoint> userPointList = PointRepository.findByOnFigli(emailCriypt);
		return userPointList;
	}
}