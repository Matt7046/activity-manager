package com.common.configurations.encrypt;

import java.util.stream.Collectors;

import com.common.data.user.UserPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.data.mongodb.core.mapping.event.AfterLoadEvent;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;
import com.common.data.activity.LogActivity;

@Component
public class EncryptionCallback {
    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;

    @Autowired
    private MongoConverter mongoConverter;


    // Prima che il documento venga convertito e salvato nel DB
    @EventListener
    public <T> void handleBeforeConvert(BeforeConvertEvent<T> event) {
        if (event.getSource() instanceof UserPoint userPoint) {
            try {
                if (userPoint.getEmail() != null) {
                    userPoint.setEmail(encryptDecryptConverter.convert(userPoint.getEmail())); // Crittografa l'email //
                                                                                     // salvataggio
                }
                if (userPoint.getEmailFamily() != null) {
                    userPoint.setEmailFamily(encryptDecryptConverter.convert(userPoint.getEmailFamily())); // Crittografa l'email
                }
                if (userPoint.getEmailFigli() != null) {
                    userPoint.setEmailFigli(userPoint.getEmailFigli().stream().map(email -> {
                        return encryptDecryptConverter.convert(email);
                    }).collect(Collectors.toList())); // Crittografa l'email
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if (event.getSource() instanceof LogActivity user) {
            try {
                if (user.getEmail() != null) {
                    user.setEmail(encryptDecryptConverter.convert(user.getEmail())); // Crittografa l'email prima del
                                                                                     // salvataggio
                }
                
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @EventListener
    public void handleAfterLoad(AfterLoadEvent<?> event) {
        Object source = event.getSource(); // Ottieni l'oggetto generico
        if (source instanceof UserPoint) {
            UserPoint userPoint = mongoConverter.read(UserPoint.class, event.getSource());
            try {
                if (userPoint.getEmail() != null) {
                    // Decrittografa l'email dopo il caricamento
                    userPoint.setEmail(encryptDecryptConverter.decrypt(userPoint.getEmail()));
                }
                if (userPoint.getEmailFamily() != null) {
                    // Decrittografa l'email dopo il caricamento
                    userPoint.setEmailFamily(encryptDecryptConverter.decrypt(userPoint.getEmailFamily()));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if (source instanceof LogActivity) {
            LogActivity log = mongoConverter.read(LogActivity.class, event.getSource());
            try {
                if (log.getEmail() != null) {
                    // Decrittografa l'email dopo il caricamento
                    log.setEmail(encryptDecryptConverter.decrypt(log.getEmail()));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
