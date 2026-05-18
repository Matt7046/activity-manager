package com.common.mail;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.Base64;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleAuthException;
import com.google.auth.oauth2.UserCredentials;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.ByteArrayOutputStream;
import java.util.Properties;

public class GmailOAuthEmailSender implements EmailSender {

    private static final Logger log = LoggerFactory.getLogger(GmailOAuthEmailSender.class);
    private static final String GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send";

    private final EmailProperties properties;
    private final Gmail gmail;

    public GmailOAuthEmailSender(EmailProperties properties) {
        this.properties = properties;
        try {
            EmailProperties.GmailOauth oauth = properties.getGmailOauth();
            UserCredentials credentials = UserCredentials.newBuilder()
                    .setClientId(oauth.getClientId())
                    .setClientSecret(oauth.getClientSecret())
                    .setRefreshToken(oauth.getRefreshToken())
                    .build();
            HttpRequestInitializer requestInitializer = new HttpCredentialsAdapter(
                    credentials.createScoped(GMAIL_SEND_SCOPE));

            this.gmail = new Gmail.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    requestInitializer)
                    .setApplicationName("activity-manager")
                    .build();
        } catch (Exception e) {
            throw new IllegalStateException("Impossibile inizializzare Gmail API (OAuth)", e);
        }
    }

    @Override
    public void sendHtml(String toEmail, String subject, String htmlBody) {
        try {
            Session session = Session.getInstance(new Properties());
            MimeMessage mimeMessage = new MimeMessage(session);
            mimeMessage.setFrom(new InternetAddress(properties.resolveFromAddress()));
            mimeMessage.addRecipient(javax.mail.Message.RecipientType.TO, new InternetAddress(toEmail));
            mimeMessage.setSubject(subject, "UTF-8");
            mimeMessage.setContent(htmlBody, "text/html; charset=UTF-8");

            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            mimeMessage.writeTo(buffer);
            String encoded = Base64.encodeBase64URLSafeString(buffer.toByteArray());

            Message message = new Message().setRaw(encoded);
            gmail.users().messages().send("me", message).execute();
            log.info("[email] Gmail API (OAuth) inviata a {}", toEmail);
        } catch (GoogleJsonResponseException e) {
            throw new IllegalStateException(
                    "Gmail API errore " + e.getStatusCode() + ": " + e.getDetails(), e);
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Invio email Gmail OAuth fallito verso " + toEmail + " – " + oauthHint(e), e);
        }
    }

    private static String oauthHint(Throwable e) {
        Throwable root = e;
        while (root.getCause() != null) {
            root = root.getCause();
        }
        if (root instanceof GoogleAuthException gae && gae.getMessage() != null) {
            return gae.getMessage();
        }
        String msg = root.getMessage();
        if (msg != null && msg.contains("oauth2.googleapis.com/token")) {
            return "token OAuth non valido: rigenera GMAIL_OAUTH_REFRESH_TOKEN con lo stesso "
                    + "GMAIL_OAUTH_CLIENT_ID/SECRET (non usare il client Playground 407408718192)";
        }
        return msg != null ? msg : root.getClass().getSimpleName();
    }
}
