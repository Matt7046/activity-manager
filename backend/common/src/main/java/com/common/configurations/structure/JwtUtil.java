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
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 ora
                .signWith(propertiesKey.getSecretKey())
                .compact();
    }

    // Metodo per validare il token
    public  Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey((propertiesKey.getSecretKey())) // Usa la stessa chiave per la validazione
                .build()
                .parseClaimsJws(token)
                .getBody(); // Estrai il corpo del token
    }
}
