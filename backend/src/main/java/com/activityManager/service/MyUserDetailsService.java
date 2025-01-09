package com.activityManager.service;

import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
@Service
public class MyUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String email) {
        // Logica per caricare l'utente dal database o dalla memoria
        // In questo esempio, ritorniamo un utente fittizio
        return User.builder()
            .username(email)
            .password("{noop}"+ "qwertyuiop") // Usa una password crittografata con BCrypts // Usa una password crittografata con BCrypt
            .roles("USER")
            .build();
    }
}