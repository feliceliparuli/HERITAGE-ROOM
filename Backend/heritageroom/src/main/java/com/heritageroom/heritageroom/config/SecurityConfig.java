package com.heritageroom.heritageroom.config;

import com.heritageroom.heritageroom.security.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final NoPopupAuthEntryPoint noPopupAuthEntryPoint;

    @Autowired
    public SecurityConfig(CustomUserDetailsService userDetailsService,
                          PasswordEncoder passwordEncoder,
                          NoPopupAuthEntryPoint noPopupAuthEntryPoint) {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.noPopupAuthEntryPoint = noPopupAuthEntryPoint;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // ✅ Endpoints pubblici
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/customers/register",
                                "/api/customers/email/**"
                        ).permitAll()
                        // Tutto il resto richiede autenticazione
                        .anyRequest().authenticated()
                )
                .httpBasic(httpBasic -> httpBasic
                        // evita il popup del browser
                        .authenticationEntryPoint(noPopupAuthEntryPoint)
                )
                .build();
    }
}
