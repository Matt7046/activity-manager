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
        Activity existingActivity = null;
        if (ActivityDTO.get_id() != null) {
            existingActivity = ActivityRepository.findByIdentificativo(ActivityDTO.get_id());
        }

        if (existingActivity != null) {
            // Se esiste, aggiorna i campi
            Activity newActivity = new Activity();
            newActivity.set_id(existingActivity.get_id());
            newActivity.setNome(ActivityDTO.getNome());
            newActivity.setSubTesto(ActivityDTO.getSubTesto());
            existingActivity = ActivityRepository.save(newActivity);

            return existingActivity.get_id();// Restituisci l'ID aggiornato
        } else {
            // Se non esiste, crea un nuovo documento
            Activity newActivity = new Activity();
            newActivity.setNome(ActivityDTO.getNome());
            newActivity.setSubTesto(ActivityDTO.getSubTesto());
            newActivity = ActivityRepository.save(newActivity);
            return newActivity.get_id(); // Restituisci l'ID del nuovo documento
        }
    }
}