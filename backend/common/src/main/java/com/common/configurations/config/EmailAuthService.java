package com.common.configurations.config;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

@Service
public class EmailAuthService {

    @Value("${email.username}")
    private String username;
    @Value("${email.password}")
    private String password;

    public void sendEmail(String toEmail, String subject, String temporaryPassword) {
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
            message.setContent(buildPasswordEmailHtml(subject, temporaryPassword), "text/html; charset=UTF-8");

            // Invia l'email
            Transport.send(message);

            System.out.println("Email inviata con successo");

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildPasswordEmailHtml(String subject, String temporaryPassword) {
        return """
                <!DOCTYPE html>
                <html lang="it">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <title>%s</title>
                </head>
                <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#1f2937;">
                  <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="padding:24px 0;">
                    <tr>
                      <td align="center">
                        <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #dbe5f2;border-radius:12px;overflow:hidden;">
                          <tr>
                            <td style="background:#0f172a;padding:20px 24px;color:#e5edff;">
                              <h1 style="margin:0;font-size:20px;font-weight:700;">Activity Manager</h1>
                              <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">Comunicazione automatica di sicurezza account</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:24px;">
                              <h2 style="margin:0 0 12px;font-size:18px;color:#0f172a;">%s</h2>
                              <p style="margin:0 0 14px;line-height:1.55;">
                                Ciao, abbiamo ricevuto una richiesta relativa al tuo account Activity Manager.
                                Per consentirti di accedere in sicurezza, abbiamo generato una password temporanea.
                              </p>

                              <div style="margin:18px 0;padding:14px 16px;border:1px solid #93c5fd;background:#eff6ff;border-radius:8px;">
                                <p style="margin:0 0 6px;font-size:13px;color:#1d4ed8;font-weight:700;">Password temporanea</p>
                                <p style="margin:0;font-size:20px;letter-spacing:1px;font-weight:700;color:#0f172a;">%s</p>
                              </div>

                              <p style="margin:0 0 12px;line-height:1.55;">
                                Ti consigliamo di effettuare il login al piu presto e modificare immediatamente la password dalla sezione Impostazioni.
                              </p>
                              <p style="margin:0 0 12px;line-height:1.55;">
                                Se non hai richiesto questa operazione, puoi ignorare questa email.
                              </p>

                              <ul style="margin:0 0 14px;padding-left:20px;line-height:1.55;">
                                <li>Non condividere mai la password con terzi.</li>
                                <li>Usa una password univoca rispetto ad altri servizi.</li>
                                <li>Aggiorna periodicamente le credenziali di accesso.</li>
                              </ul>
                            </td>
                          </tr>
                          <tr>
                            <td style="background:#f8fbff;padding:16px 24px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">
                              Questo messaggio e stato generato automaticamente. Per assistenza, contatta il team Activity Manager.
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(subject, subject, temporaryPassword == null ? "" : temporaryPassword);
    }
}

