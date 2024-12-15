package com.webapp.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.webapp.data.SubPromise;
import com.webapp.repository.SubPromiseRepository;

import java.util.List;

@Service
public class SubPromiseService {
    @Autowired
    private SubPromiseRepository subPromiseRepository;

    public List<SubPromise> findAll() {
        return subPromiseRepository.findAll();
    }  
    
    public SubPromise findByIdentificativo(Long identificativo) {
        
        return subPromiseRepository.findByIdentificativo(identificativo);
    }

    public Long deleteByIdentificativo(Long identificativo) {
        
        return subPromiseRepository.deleteByIdentificativo(identificativo);
    }


}
