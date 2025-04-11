package com.repository.family;

import com.common.data.UserPoint;

public interface FamilyCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
    
    public Long getTypeUser(UserPoint points) throws Exception;

    public Boolean saveUser(UserPoint points) throws Exception;

}