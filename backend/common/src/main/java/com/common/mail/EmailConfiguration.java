package com.common.mail;

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
}
