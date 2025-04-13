package com.repository.activity;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.activity.Activity;

public class ActivityCustomRepositoryImpl implements ActivityCustomRepository {

    @Lazy
    @Autowired
    private ActivityRepository ActivityRepository;

    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;

    public String saveActivity(Activity activity) {
        // Verifica se esiste già un documento con l'identificativo
        String emailCriypt = encryptDecryptConverter.convert(activity.getEmail());
        activity.setEmail(emailCriypt);
        activity = ActivityRepository.save(activity);
        return activity.get_id();// Restituisci l'ID aggiornato

    }
}