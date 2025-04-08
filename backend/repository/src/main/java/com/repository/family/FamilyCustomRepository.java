package com.repository.family;

import com.common.data.Point;

public interface FamilyCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
    
    public Long getTypeUser(Point points) throws Exception;

    public Boolean saveUser(Point points) throws Exception;  

}