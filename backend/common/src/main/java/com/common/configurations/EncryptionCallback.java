package com.common.configurations;

import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.data.mongodb.core.mapping.event.AfterLoadEvent;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;
import com.common.data.LogActivity;
import com.common.data.Points;

@Component
public class EncryptionCallback {
    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;

    @Autowired
    private MongoConverter mongoConverter;


    // Prima che il documento venga convertito e salvato nel DB
    @EventListener
    public <T> void handleBeforeConvert(BeforeConvertEvent<T> event) {
        if (event.getSource() instanceof Points user) {
            try {
                if (user.getEmail() != null) {
                    user.setEmail(encryptDecryptConverter.convert(user.getEmail())); // Crittografa l'email //
                                                                                     // salvataggio
                }
                if (user.getEmailFamily() != null) {
                    user.setEmailFamily(encryptDecryptConverter.convert(user.getEmailFamily())); // Crittografa l'email
                }
                if (user.getEmailFigli() != null) {
                    user.setEmailFigli(user.getEmailFigli().stream().map(email -> {
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
        if (source instanceof Points) {
            Points point = mongoConverter.read(Points.class, event.getSource());
            try {
                if (point.getEmail() != null) {
                    // Decrittografa l'email dopo il caricamento
                    point.setEmail(encryptDecryptConverter.decrypt(point.getEmail()));
                }
                if (point.getEmailFamily() != null) {
                    // Decrittografa l'email dopo il caricamento
                    point.setEmailFamily(encryptDecryptConverter.decrypt(point.getEmailFamily()));
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
