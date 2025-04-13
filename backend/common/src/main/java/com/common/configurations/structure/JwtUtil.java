package com.common.configurations.structure;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    @Autowired
    PropertiesKey propertiesKey;

    // Crea una chiave segreta in modo sicuro
  
    // Metodo per generare il token
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 ora
                .signWith(propertiesKey.getSecretKey()) // Firma con la chiave segreta
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
