package com.activityManager;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Date;

public class JwtUtil {

    // Crea una chiave segreta in modo sicuro
    protected static final SecretKey SECRET_KEY = new SecretKeySpec(
        "this_is_a_very_long_secret_key_256bit".getBytes(), "HMACSHA256");
    // Metodo per generare il token
    public static String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 ora
                .signWith(SECRET_KEY) // Firma con la chiave segreta
                .compact();
    }

    // Metodo per validare il token
    public static Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY) // Usa la stessa chiave per la validazione
                .build()
                .parseClaimsJws(token)
                .getBody(); // Estrai il corpo del token
    }

 
}
