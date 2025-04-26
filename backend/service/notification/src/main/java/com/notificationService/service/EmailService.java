package com.notificationService.service;

import com.common.configurations.config.EmailAuthService;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.user.UserPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmailService {

    @Autowired
    private EmailAuthService mailSenderService;

    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;

    @Transactional
    public UserPoint sendPasswordEmailChild(UserPoint userPoint)  {
        userPoint.getPointFigli().stream().forEach(x -> {
            try {
                mailSenderService.sendEmail(encryptDecryptConverter.decrypt(x.getEmail()), "Nuovo utente",encryptDecryptConverter.decrypt(x.getPassword()));
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
        return userPoint;
    }
}
