package com.webapp.repository.LogAttivita;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import com.webapp.data.LogActivity;
import org.springframework.data.domain.Sort;
public class LogActivityCustomRepositoryImpl implements LogActivityCustomRepository {

	@Lazy
	@Autowired
	private LogActivityRepository logAttivitaRepository;

	@Override
	public List<LogActivity> findLogByEmail(String email, Sort sort) {
		// Verifica se esiste già un documento con l'identificativo
		List<LogActivity> logAttivita = null;
		if (email != null) {
			logAttivita = logAttivitaRepository.findLogByEmail(email, sort);
		}
		return logAttivita;
	}
}