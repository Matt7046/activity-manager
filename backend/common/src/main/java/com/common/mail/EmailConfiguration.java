package com.common.mail;

import com.common.configurations.config.EmailAuthService;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(EmailProperties.class)
public class EmailConfiguration {

    @Bean
    public EmailSender emailSender(EmailProperties properties) {
        if (!properties.isOperational()) {
            return new DisabledEmailSender();
        }
        String provider = properties.getProvider() == null
                ? "gmail-oauth"
                : properties.getProvider().trim().toLowerCase();
        if ("gmail-oauth".equals(provider)) {
            return new GmailOAuthEmailSender(properties);
        }
        throw new IllegalStateException(
                "email.provider non supportato: " + properties.getProvider()
                        + " (valori: gmail-oauth, disabled)");
    }

    /** Solo dove è caricata {@link EmailConfiguration} (es. notification-service con scan {@code com.common.mail}). */
    @Bean
    public EmailAuthService emailAuthService(EmailSender emailSender, EmailProperties emailProperties) {
        return new EmailAuthService(emailSender, emailProperties);
    }
}
