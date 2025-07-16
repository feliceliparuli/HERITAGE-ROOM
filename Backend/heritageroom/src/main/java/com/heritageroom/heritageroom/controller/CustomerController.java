package com.heritageroom.heritageroom.controller;

import com.heritageroom.heritageroom.model.Customer;
import com.heritageroom.heritageroom.repository.CustomerRepository;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CustomerController {

    private final CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer con id " + id + " non trovato"));
    }

    @PostMapping
    public Customer createCustomer(@RequestBody @Valid Customer customer) {
        return customerRepository.save(customer);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody @Valid Customer customerDetails) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer con id " + id + " non trovato"));

        existingCustomer.setName(customerDetails.getName());
        existingCustomer.setEmail(customerDetails.getEmail());

        return customerRepository.save(existingCustomer);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCustomer(@PathVariable Long id) {
        if (!customerRepository.existsById(id)) {
            throw new IllegalArgumentException("Customer con id " + id + " non trovato");
        }
        customerRepository.deleteById(id);
    }
}
