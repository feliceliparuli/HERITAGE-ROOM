package com.heritageroom.heritageroom.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La stanza è obbligatoria")
    @ManyToOne
    private Room room;

    @NotNull(message = "Il cliente è obbligatorio")
    @ManyToOne
    private Customer customer;

    @NotNull(message = "La data di arrivo è obbligatoria")
    private LocalDate checkIn;

    @NotNull(message = "La data di partenza è obbligatoria")
    private LocalDate checkOut;

    @Positive(message = "Il numero di notti deve essere positivo")
    private Integer nights;

    @Positive(message = "Il prezzo deve essere positivo")
    private Double totalPrice;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public String getCustomerEmail() {
        return customer != null ? customer.getEmail() : null;
    }

    public void setCustomerEmail(String email) {
        if (this.customer == null) {
            this.customer = new Customer();
        }
        this.customer.setEmail(email);
    }
}