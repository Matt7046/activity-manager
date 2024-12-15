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
import java.util.Random;

@Service
public class SubPromiseService {
    @Autowired
    private SubPromiseRepository subPromiseRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<SubPromise> findAll() {
        return subPromiseRepository.findAll();
    }

    public SubPromise findByIdentificativo(String identificativo) {

        return subPromiseRepository.findByIdentificativo(identificativo);
    }

    public Long deleteByIdentificativo(String identificativo) {

        return subPromiseRepository.deleteByIdentificativo(identificativo);
    }

    public String saveSubPromise(SubPromiseDTO subPromiseDTO) {
        // Verifica se esiste già un documento con l'identificativo
        SubPromise existingPromise = null;
        if (subPromiseDTO.get_id() != null) {
            existingPromise = subPromiseRepository.findByIdentificativo(subPromiseDTO.get_id());
        }

        if (existingPromise != null) {
            // Se esiste, aggiorna i campi
            existingPromise.setNome(subPromiseDTO.getNome());
            existingPromise.setSubTesto(subPromiseDTO.getSubTesto());
            existingPromise = subPromiseRepository.save(existingPromise);

            return existingPromise.get_id();// Restituisci l'ID aggiornato
        } else {

             // Se non esiste, crea un nuovo documento
            SubPromise newPromise = new SubPromise();
            newPromise.setNome(subPromiseDTO.getNome());
            newPromise.setSubTesto(subPromiseDTO.getSubTesto());
            try {
                newPromise = subPromiseRepository.save(newPromise);
            } catch (Exception e) {
                // Log dell'errore per un'analisi successiva
                System.err.println("Errore durante il salvataggio del documento SubPromise: " + e.getMessage());
            }
            return newPromise.get_id(); // Restituisci l'ID del nuovo documento
        }
    }
}
