
package com.heritageroom.heritageroom.security;

import com.heritageroom.heritageroom.model.Customer;
import com.heritageroom.heritageroom.repository.CustomerRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;

    public CustomUserDetailsService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Customer customer = customerRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato"));

        return new User(
            customer.getEmail(),
            customer.getPassword(),
            List.of(new SimpleGrantedAuthority("ROLE_" + customer.getRole()))
        );
    }
}
