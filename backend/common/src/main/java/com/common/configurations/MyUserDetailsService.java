package com.common.configurations;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.secret.crypt.user.key}")
    private String secretKey;

    @Override
    public UserDetails loadUserByUsername(String email) {
        // Logica per caricare l'utente dal database o dalla memoria
        // In questo esempio, ritorniamo un utente fittizio
        String encryptedPassword = passwordEncoder.encode(secretKey);
        return User.builder()
            .username(email)
            .password("{bcrypt}"+ encryptedPassword) // Usa una password crittografata con BCrypts // Usa una password crittografata con BCrypt
            .roles("USER")
            .build();
    }
}