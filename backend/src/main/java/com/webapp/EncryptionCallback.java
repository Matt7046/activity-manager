package com.webapp;

import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.mapping.event.AfterLoadEvent;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;

import com.webapp.data.LogActivity;
import com.webapp.data.Points;

@Component
public class EncryptionCallback {

    private final EncryptDecryptConverter encryptDecryptConverter;

    public EncryptionCallback(EncryptDecryptConverter encryptDecryptConverter) {
        this.encryptDecryptConverter = encryptDecryptConverter;
    }

    // Prima che il documento venga convertito e salvato nel DB
    @EventListener
    public void handleBeforeConvert(BeforeConvertEvent<?> event) {
        if (event.getSource() instanceof Points) {
            Points user = (Points) event.getSource();
            try {
                if (user.getEmail() != null) {
                    user.setEmail(encryptDecryptConverter.convert(user.getEmail())); // Crittografa l'email prima del
                                                                                      // salvataggio
                }
                if (user.getEmailFamily() != null) {
                    user.setEmailFamily(encryptDecryptConverter.convert(user.getEmailFamily())); // Crittografa l'email prima del
                                                                                      // salvataggio
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if (event.getSource() instanceof LogActivity) {
            LogActivity user = (LogActivity) event.getSource();
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

    // Dopo che il documento è stato caricato dal DB
    @EventListener
    public void handleAfterLoad(AfterLoadEvent<?> event) {
        Object source = event.getSource(); // Ottieni l'oggetto generico

        if (source instanceof Points) {
            Points points = (Points) source; // Cast a Points

            try {
                if (points.getEmail() != null) {
                    // Decrittografa l'email dopo il caricamento
                    points.setEmail(encryptDecryptConverter.decrypt(points.getEmail()));
                }
                if (points.getEmailFamily() != null) {
                    // Decrittografa l'email dopo il caricamento
                    points.setEmailFamily(encryptDecryptConverter.decrypt(points.getEmailFamily()));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if (source instanceof LogActivity) {
            LogActivity log = (LogActivity) source; // Cast a Points

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
