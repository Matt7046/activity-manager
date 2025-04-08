package com.repository.point;


import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.common.configurations.EncryptDecryptConverter;
import com.common.data.Point;
import com.common.exception.ArithmeticCustomException;

public class PointCustomRepositoryImpl implements PointCustomRepository {

	@Lazy
	@Autowired
	private PointRepository PointRepository;
	@Autowired
	private EncryptDecryptConverter encryptDecryptConverter;

	public Long getTypeUser(Point PointSave) throws Exception {
		String email = encryptDecryptConverter.convert(PointSave.getEmailFamily());
		List<Point> existPointOnFigli = PointRepository.findByOnFigli(email);
		Point existPoint = PointRepository.findByEmailOnEmail(email);
		Long type;
		type = (isExistPointValid(existPoint)) ? 1L
				: isExistPointOnFigliValid(existPointOnFigli) ? 0L
						: 2L;

		return type;
	}

	private boolean isExistPointValid(Object existPoint) {
		return existPoint != null;
	}

	private boolean isExistPointOnFigliValid(Collection<?> existPointOnFigli) {
		return existPointOnFigli != null && !existPointOnFigli.isEmpty();
	}

	public Boolean saveUser(Point PointSave) throws Exception {
		Boolean newUSer = false;
		if (PointSave.getEmail() != null && !PointSave.getEmailFigli().isEmpty()) {
			newUSer = true;
			PointSave.setType(1L);
			PointSave.getPoints().stream()
					.forEach(point -> point.setPoints(100L));
			PointRepository.save(PointSave);
		}
		return newUSer;
	}

	public Point getPointByEmail(String email) throws Exception {
		String emailCriypt = encryptDecryptConverter.convert(email);

		Point existingUser = PointRepository.findByEmailOnEmail(emailCriypt);
		if (existingUser == null) {
			List<Point> userList = PointRepository.findByOnFigli(emailCriypt);
			existingUser = !userList.isEmpty() ? userList.get(0) : null;
		}
		if (existingUser == null) {
			return new Point();
		}
		existingUser.setEmailFigli(existingUser.getEmailFigli().stream().map(x -> 			
				encryptDecryptConverter.decrypts(x)).collect(Collectors.toList())); // Crittografa l'email

		return existingUser;
	}

	public Point savePoint(Point PointSave, Long usePoint, Boolean operation) throws Exception {
		String emailCriypt = encryptDecryptConverter.convert(PointSave.getEmailFamily());

		Point existingUser = PointRepository.findByEmailOnEmail(emailCriypt);
		if (existingUser == null) {
			List<Point> userList = PointRepository.findByOnFigli(emailCriypt);
			existingUser = !userList.isEmpty() ? userList.get(0) : null;
		}

		existingUser.getPoints().stream()
				.filter(point -> PointSave.getEmailFamily().equals(point.getEmail())) // Filtra per email
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
		// existingUser.setPoint(new PointUser(newPoint, emailCriypt));
		existingUser.setEmail(encryptDecryptConverter.decrypt(existingUser.getEmail()));
		existingUser.setEmailFamily(encryptDecryptConverter.decrypt(existingUser.getEmailFamily()));
		existingUser.setEmailFigli(existingUser.getEmailFigli().stream()
				.map(figlio -> encryptDecryptConverter.decrypt(figlio))
				.collect(Collectors.toList()));
		PointRepository.save(existingUser);
		return existingUser;

	}

	@Override
	public List<Point> getPointsListByEmail(String email) throws Exception {
		String emailCriypt = encryptDecryptConverter.convert(email);

		List<Point> userList = PointRepository.findByOnFigli(emailCriypt);
		return userList;
	}
}