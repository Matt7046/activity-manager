package com.webapp.repository.LogAttivita;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import com.webapp.data.LogAttivita;
import org.springframework.data.domain.Sort;
public class LogAttivitaCustomRepositoryImpl implements LogAttivitaCustomRepository {

	@Lazy
	@Autowired
	private LogAttivitaRepository logAttivitaRepository;

	@Override
	public List<LogAttivita> findLogByEmail(String email, Sort sort) {
		// Verifica se esiste già un documento con l'identificativo
		List<LogAttivita> logAttivita = null;
		if (email != null) {
			logAttivita = logAttivitaRepository.findLogByEmail(email, sort);
		}
		return logAttivita;
	}
}