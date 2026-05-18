package com.common.mail;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "email")
public class EmailProperties {

    private boolean enabled = true;
    /** Solo {@code gmail-oauth} o {@code disabled}. */
    private String provider = "gmail-oauth";
    /** Indirizzo Gmail mittente (account autorizzato con OAuth). */
    private String from;
    private final GmailOauth gmailOauth = new GmailOauth();

    public String resolveFromAddress() {
        if (from != null && !from.isBlank()) {
            return from.trim();
        }
        return "";
    }

    public boolean isOperational() {
        if (!enabled || "disabled".equalsIgnoreCase(provider)) {
            return false;
        }
        if (!"gmail-oauth".equalsIgnoreCase(provider)) {
            return false;
        }
        return gmailOauth.isComplete() && !resolveFromAddress().isEmpty();
    }

    @Getter
    @Setter
    public static class GmailOauth {
        private String clientId;
        private String clientSecret;
        private String refreshToken;

        public boolean isComplete() {
            return clientId != null && !clientId.isBlank()
                    && clientSecret != null && !clientSecret.isBlank()
                    && refreshToken != null && !refreshToken.isBlank();
        }
    }
}
