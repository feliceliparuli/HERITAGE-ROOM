package com.heritageroom.heritageroom.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Entity
@Data
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Il nome della camera è obbligatorio")
    private String name;

    @NotNull(message = "Il prezzo per notte è obbligatorio")
    @Positive(message = "Il prezzo deve essere positivo")
    private Double pricePerNight;

    @NotNull(message = "Il numero massimo di ospiti è obbligatorio")
    @Positive(message = "Il numero massimo di ospiti deve essere positivo")
    private Integer maxGuests = 2;
}
