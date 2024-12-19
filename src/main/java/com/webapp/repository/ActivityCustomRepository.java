package com.webapp.repository;




import java.util.List;

import org.springframework.data.mongodb.repository.Query;

import com.webapp.data.Activity;
import com.webapp.dto.ActivityDTO;

public interface ActivityCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
    
    public String saveActivity(ActivityDTO ActivityDTO);

}