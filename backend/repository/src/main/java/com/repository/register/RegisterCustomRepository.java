package com.repository.register;

import com.common.data.Point;

public interface RegisterCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
    
    public Long getTypeUser(Point points) throws Exception;

    public Boolean saveUser(Point points) throws Exception;  

}