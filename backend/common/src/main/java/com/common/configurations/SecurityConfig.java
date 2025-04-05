package com.common.configurations;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig implements WebFluxConfigurer {

    @Autowired
    PropertiesKey propertiesKey;

    @Value("${app.secret.crypt.user.key}")
    private String secretKey;

    @Value("${app.address1}")
    private String address1;

    @Value("${app.address2}")
    private String address2;
    
    @Value("${app.security.roles}")
    private String roles;

    @Value("${app.security.username}")
    private String username;
    
    @Value("${app.security.crypt}")
    private String crypt;

    @Value("${app.page.address}")
    private String policyAddress;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        
        registry.addMapping("/**")
                .allowedOrigins(address1, address2)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true); // Aggiungi questo se invii cookie o header di autenticazione
    }

    @Bean
    public MapReactiveUserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        String encryptedPassword = passwordEncoder.encode(secretKey);
        StringBuilder builder = new StringBuilder();
        builder.append("{").append(crypt).append("}");
        UserDetails user = User.builder()
                .username(username)
                .password(builder.toString() + encryptedPassword) // Password crittografata
                .roles(roles)
                .build();
        return new MapReactiveUserDetailsService(user);
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .authorizeExchange(exchanges -> exchanges
                .pathMatchers(policyAddress).permitAll() // Consenti accesso pubblico alla Privacy Policy
                                .pathMatchers("/ws/**").permitAll()                         .pathMatchers("/api/auth/token").permitAll()
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Permetti l'accesso pubblico a
                                                                             // "/api/auth/token"
                        .anyExchange().authenticated() // Richiedi autenticazione per tutte le altre richieste
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(Customizer.withDefaults()) // Configura il decoder JWT automaticamente
                )
                .cors(Customizer.withDefaults())  // Abilita CORS
                .csrf(ServerHttpSecurity.CsrfSpec::disable);  // Disabilita CSRF per le API

        return http.build();
    }

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        return NimbusReactiveJwtDecoder.withSecretKey(propertiesKey.getSecretKey()).build();
    }

    // Questo AuthenticationManager viene automaticamente configurato da Spring
    // Security 6
    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserDetailsService userDetailsService,
            PasswordEncoder encoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        // authProvider.setPasswordEncoder(encoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(List<AuthenticationProvider> authenticationProviders) {
        return new ProviderManager(authenticationProviders);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
