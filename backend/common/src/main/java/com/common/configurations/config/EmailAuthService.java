package com.common.configurations.config;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

@Service
public class EmailAuthService {

    @Value("${spring.mail.from}")
    private String emailFrom;
    @Value("${email.username}")
    private String username;
    @Value("${email.password}")
    private String password;

    public void sendEmail(String toEmail, String subject, String body) {
        // Configurazione SMTP di Gmail
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        // Crea una sessione con autenticazione
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });
        try {
            // Crea il messaggio
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username)); // Mittente
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(toEmail)           // Destinatario
            );
            message.setSubject(subject);
            message.setText(body);

            // Invia l'email
            Transport.send(message);

            System.out.println("Email inviata con successo");

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}

