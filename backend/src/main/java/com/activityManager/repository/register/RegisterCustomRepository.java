package com.activityManager.repository.register;

import com.activityManager.data.Points;

public interface RegisterCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
    
    public Long getTypeUser(Points points) throws Exception;

    public Boolean saveUser(Points points) throws Exception;  

}