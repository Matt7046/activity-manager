package com.webapp.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.webapp.data.SubPromise;
import com.webapp.dto.SubPromiseDTO;
import com.webapp.repository.SubPromiseRepository;

import java.util.List;

@Service
public class SubPromiseService {
    @Autowired
    private SubPromiseRepository subPromiseRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<SubPromise> findAll() {
        return subPromiseRepository.findAll();
    }  
    
    public SubPromise findByIdentificativo(Long identificativo) {
        
        return subPromiseRepository.findByIdentificativo(identificativo);
    }

    public Long deleteByIdentificativo(Long identificativo) {
        
        return subPromiseRepository.deleteByIdentificativo(identificativo);
    }

    public Long saveSubPromise(SubPromiseDTO subPromiseDTO) {
        // Verifica se esiste già un documento con l'identificativo
        SubPromise existingPromise = subPromiseRepository.findByIdentificativo(subPromiseDTO.getIdentificativo());
        
        if (existingPromise != null) {
            // Se esiste, aggiorna i campi
            existingPromise.setNome(subPromiseDTO.getNome());
            existingPromise.setSubTesto(subPromiseDTO.getSubTesto());
            subPromiseRepository.save(existingPromise); // Salva i cambiamenti
            return existingPromise.getIdentificativo(); // Restituisci l'ID aggiornato
        } else {
            // Se non esiste, crea un nuovo documento
            SubPromise newPromise = new SubPromise();
            newPromise.setIdentificativo(subPromiseDTO.getIdentificativo());
            newPromise.setNome(subPromiseDTO.getNome());
            newPromise.setSubTesto(subPromiseDTO.getSubTesto());
            subPromiseRepository.save(newPromise); // Salva il nuovo oggetto
            return newPromise.getIdentificativo(); // Restituisci l'ID del nuovo documento
        }
    }
}




