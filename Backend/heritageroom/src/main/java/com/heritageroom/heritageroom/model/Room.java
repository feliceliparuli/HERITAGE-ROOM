package com.heritageroom.heritageroom.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Il nome della stanza è obbligatorio")
    private String name;

    @NotNull(message = "Il prezzo per notte è obbligatorio")
    private Double pricePerNight;

    private String description;

    private Integer maxGuests;
}
