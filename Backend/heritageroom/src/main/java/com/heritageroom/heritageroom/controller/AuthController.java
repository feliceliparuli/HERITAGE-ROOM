package com.heritageroom.heritageroom.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new RuntimeException("Utente non autenticato");
        }

        UserDetails user = (UserDetails) authentication.getPrincipal();

        Map<String, Object> response = new HashMap<>();
        response.put("email", user.getUsername());
        response.put("role", user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("UNKNOWN"));

        return response;
    }
}
