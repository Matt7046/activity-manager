package com.webapp.repository;




import java.util.List;

import org.springframework.data.mongodb.repository.Query;

import com.webapp.data.SubPromise;
import com.webapp.dto.SubPromiseDTO;

public interface SubPromiseCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
    
    public String saveSubPromise(SubPromiseDTO subPromiseDTO);

}