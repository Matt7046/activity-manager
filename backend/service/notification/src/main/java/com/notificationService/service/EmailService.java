package com.notificationService.service;

import com.common.configurations.config.EmailAuthService;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.user.UserPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private EmailAuthService mailSenderService;

    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;

    @Transactional
    public UserPoint sendPasswordEmailChild(UserPoint userPoint, List<UserPoint> userChild,
            List<String> addedChildEmailsPlain) {
        if (userChild != null && !userChild.isEmpty()) {
            userChild.forEach(x -> {
                try {
                    mailSenderService.sendEmail(encryptDecryptConverter.decrypt(x.getEmail()), "Nuovo utente",
                            encryptDecryptConverter.decrypt(x.getPassword()));
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            });
        }
        List<String> parentSummary = addedChildEmailsPlain;
        if ((parentSummary == null || parentSummary.isEmpty()) && userChild != null && !userChild.isEmpty()) {
            parentSummary = userChild.stream().map(c -> encryptDecryptConverter.decrypt(c.getEmail())).toList();
        }
        if (parentSummary != null && !parentSummary.isEmpty()) {
            try {
                String parentEmail = encryptDecryptConverter.decrypt(userPoint.getEmail());
                String body = "Hai aggiunto i seguenti figli al tuo account: " + String.join(", ", parentSummary);
                mailSenderService.sendEmail(parentEmail, "Conferma aggiunta figli", body);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return userPoint;
    }

    @Transactional
    public UserPoint sendPasswordEmail(UserPoint userPoint)  {
            try {
                mailSenderService.sendEmail(encryptDecryptConverter.decrypt(userPoint.getEmail()), "Reset Password",encryptDecryptConverter.decrypt(userPoint.getPassword()));
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        
        return userPoint;
    }
}
