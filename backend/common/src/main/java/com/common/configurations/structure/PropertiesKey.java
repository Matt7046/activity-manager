package com.common.configurations.structure;

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

    @Value("${app.algorithm1}")
    private String algorith1;

    @Value("${app.algorithm2}")
    private String algorith2;

    public SecretKey getSecretCryptKey() {
        return new SecretKeySpec(secretCryptKey.getBytes(), algorith1);
    }

    public SecretKey getSecretKey() {
        // Converti la stringa letta in un SecretKey
        return new SecretKeySpec(secretKey.getBytes(), algorith2);
    }   
}