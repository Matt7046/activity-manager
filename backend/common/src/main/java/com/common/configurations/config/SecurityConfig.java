package com.common.configurations.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;

import com.common.configurations.structure.PropertiesKey;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig implements WebFluxConfigurer {

    @Autowired
    PropertiesKey propertiesKey;

    @Value("${app.address1}")
    private String address1;

    @Value("${app.address2}")
    private String address2;

    @Value("${app.address3}")
    private String address3;

    @Value("${app.page.address.home}")
    private String homeAddress;

    @Value("${app.page.address.token}")
    private String tokenAddress;

    @Value("${app.page.address.policy}")
    private String policyAddress;

    @Value("${app.page.address.login}")
    private String loginAddress;

    @Value("${app.page.address.all}")
    private String allAddress;

    @Value("${app.page.address.webSocket}")
    private String webSocketAddress;

    @Value("${app.page.address.sitemap}")
    private String sitemapAddress;

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/**")
                .allowedOrigins(address1, address2, address3)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers(policyAddress).permitAll()
                        .pathMatchers(homeAddress).permitAll()
                        .pathMatchers(tokenAddress).permitAll()
                        .pathMatchers(webSocketAddress).permitAll()
                        .pathMatchers(loginAddress).permitAll()
                        .pathMatchers("/api/userpoint/dati/user").permitAll()
                        .pathMatchers(sitemapAddress).permitAll()
                        .pathMatchers(HttpMethod.OPTIONS, allAddress).permitAll()
                        .anyExchange().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(Customizer.withDefaults()))
                .cors(Customizer.withDefaults())
                .csrf(ServerHttpSecurity.CsrfSpec::disable);

        return http.build();
    }

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        return NimbusReactiveJwtDecoder.withSecretKey(propertiesKey.getSecretKey()).build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
