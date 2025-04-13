package com.repository.register;

import com.common.data.user.UserPoint;

public interface RegisterCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
    
    public Long getTypeUser(UserPoint points) throws Exception;

    public Boolean saveUser(UserPoint points) throws Exception;

}