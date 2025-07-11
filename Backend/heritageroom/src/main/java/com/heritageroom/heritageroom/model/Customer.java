package com.heritageroom.heritageroom.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Il nome è obbligatorio")
    private String name;

    @NotNull(message = "L'email è obbligatoria")
    @Email(message = "Formato email non valido")
    private String email;

    @NotNull(message = "Il numero di cellulare è obbligatorio")
    private String phone;
}
