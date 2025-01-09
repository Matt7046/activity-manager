package com.activityManager.configurations;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PropertiesKey {


    @Value("${app.secret.key}")
    private String secretKey;

    @Value("${app.secret.crypt.key}")
    private String secretCryptKey;

    public SecretKey getSecretKey() {
        // Converti la stringa letta in un SecretKey
        return new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
    }

    public SecretKey getSecretCryptKey() {
        return new SecretKeySpec(secretCryptKey.getBytes(), "AES");
    }
}