package com.webapp.repository.Activity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.webapp.data.Activity;
import com.webapp.dto.ActivityDTO;

public class ActivityCustomRepositoryImpl implements ActivityCustomRepository {

    @Lazy
    @Autowired
    private ActivityRepository ActivityRepository;

    public String saveActivity(ActivityDTO activityDTO) {
        // Verifica se esiste già un documento con l'identificativo
        Activity existingActivity = null;
        if (activityDTO.get_id() != null) {
            existingActivity = ActivityRepository.findByIdentificativo(activityDTO.get_id());
        }

        if (existingActivity != null) {
            // Se esiste, aggiorna i campi
            Activity newActivity = new Activity();
            newActivity.set_id(existingActivity.get_id());
            newActivity.setNome(activityDTO.getNome());
            newActivity.setSubTesto(activityDTO.getSubTesto());
            newActivity.setPoints(activityDTO.getPoints());
            existingActivity = ActivityRepository.save(newActivity);

            return existingActivity.get_id();// Restituisci l'ID aggiornato
        } else {
            // Se non esiste, crea un nuovo documento
            Activity newActivity = new Activity();
            newActivity.setNome(activityDTO.getNome());
            newActivity.setSubTesto(activityDTO.getSubTesto());
            newActivity.setPoints(activityDTO.getPoints());
            newActivity = ActivityRepository.save(newActivity);
            return newActivity.get_id(); // Restituisci l'ID del nuovo documento
        }
    }
}