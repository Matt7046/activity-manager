package com.webapp.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.webapp.data.Activity;
import com.webapp.dto.ActivityDTO;

public class ActivityCustomRepositoryImpl implements ActivityCustomRepository {

    @Lazy
    @Autowired
    private ActivityRepository ActivityRepository;

    public String saveActivity(ActivityDTO ActivityDTO) {
        // Verifica se esiste già un documento con l'identificativo
        Activity existingPromise = null;
        if (ActivityDTO.get_id() != null) {
            existingPromise = ActivityRepository.findByIdentificativo(ActivityDTO.get_id());
        }

        if (existingPromise != null) {
            // Se esiste, aggiorna i campi
            Activity newPromise = new Activity();
            newPromise.set_id(existingPromise.get_id());
            newPromise.setNome(ActivityDTO.getNome());
            newPromise.setSubTesto(ActivityDTO.getSubTesto());
            existingPromise = ActivityRepository.save(newPromise);

            return existingPromise.get_id();// Restituisci l'ID aggiornato
        } else {
            // Se non esiste, crea un nuovo documento
            Activity newPromise = new Activity();
            newPromise.setNome(ActivityDTO.getNome());
            newPromise.setSubTesto(ActivityDTO.getSubTesto());
            newPromise = ActivityRepository.save(newPromise);
            return newPromise.get_id(); // Restituisci l'ID del nuovo documento
        }
    }
}