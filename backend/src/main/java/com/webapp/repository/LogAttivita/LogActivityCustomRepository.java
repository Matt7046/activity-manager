package com.webapp.repository.LogAttivita;

import java.util.List;

import org.springframework.data.domain.Sort;

import com.webapp.data.LogActivity;

public interface LogActivityCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
    
    public List<LogActivity> findLogByEmail(String email, Sort sort);

}