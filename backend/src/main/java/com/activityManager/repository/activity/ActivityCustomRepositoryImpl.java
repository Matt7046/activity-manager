package com.activityManager.repository.activity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.activityManager.EncryptDecryptConverter;
import com.activityManager.data.Activity;

public class ActivityCustomRepositoryImpl implements ActivityCustomRepository {

    @Lazy
    @Autowired
    private ActivityRepository ActivityRepository;

    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;

    public String saveActivity(Activity activity) {
        // Verifica se esiste già un documento con l'identificativo
        Activity existingActivity = null;
        if (activity.get_id() != null) {
            existingActivity = ActivityRepository.findByIdentificativo(activity.get_id());
        }

        String emailCriypt = encryptDecryptConverter.convert(activity.getEmail());
        activity.setEmail(emailCriypt);
        existingActivity = ActivityRepository.save(activity);

        return existingActivity.get_id();// Restituisci l'ID aggiornato

    }
}