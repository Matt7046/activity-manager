package com.common.configurations.structure;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.common.security.EmailNormalization;

@Component
public class JwtUtil {

    @Autowired
    PropertiesKey propertiesKey;

    public String generateToken(String userEmail) {
        String subject = EmailNormalization.normalize(userEmail);
        if (subject == null || subject.isEmpty()) {
            throw new IllegalArgumentException("Email utente obbligatoria per il token.");
        }
        return Jwts.builder()
                .subject(subject)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(propertiesKey.getSecretKey())
                .compact();
    }

    public Claims validateToken(String token) {
        return Jwts.parser()
                .verifyWith(propertiesKey.getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
