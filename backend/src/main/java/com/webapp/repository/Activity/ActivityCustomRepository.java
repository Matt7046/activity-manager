package com.webapp.repository.Activity;

import com.webapp.dto.ActivityDTO;

public interface ActivityCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
    
    public String saveActivity(ActivityDTO activityDTO);

}