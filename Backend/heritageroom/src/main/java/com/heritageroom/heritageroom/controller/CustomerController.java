package com.heritageroom.heritageroom.controller;

import com.heritageroom.heritageroom.model.Customer;
import com.heritageroom.heritageroom.repository.CustomerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerController(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {
        if (customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email già registrata.");
        }

        customer.setPassword(passwordEncoder.encode(customer.getPassword()));

        if (customer.getRole() == null) {
            customer.setRole("USER");
        }

        Customer saved = customerRepository.save(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody Customer updated) {
        return customerRepository.findById(id)
                .map(customer -> {
                    if (!customer.getEmail().equals(updated.getEmail())) {
                        boolean emailInUse = customerRepository.findByEmail(updated.getEmail())
                                .map(found -> !found.getId().equals(id))
                                .orElse(false);

                        if (emailInUse) {
                            return ResponseEntity.status(HttpStatus.CONFLICT)
                                    .body("Email già utilizzata da un altro utente.");
                        }
                    }

                    customer.setName(updated.getName());
                    customer.setEmail(updated.getEmail());
                    customer.setPhone(updated.getPhone());
                    Customer saved = customerRepository.save(customer);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        return customerRepository.findById(id)
                .map(customer -> {
                    if ("ADMIN".equalsIgnoreCase(customer.getRole())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body("Non puoi eliminare un utente ADMIN.");
                    }
                    customerRepository.deleteById(id);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @GetMapping("/email/{email}")
    public ResponseEntity<Void> checkEmailExists(@PathVariable String email) {
        boolean exists = customerRepository.findByEmail(email).isPresent();
        return exists ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Customer customer) {
        if (customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email già registrata.");
        }

        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        customer.setRole("USER");

        Customer saved = customerRepository.save(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
