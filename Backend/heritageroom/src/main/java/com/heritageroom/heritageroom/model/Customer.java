package com.heritageroom.heritageroom.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Il nome è obbligatorio")
    private String name;

    @NotBlank(message = "L'email è obbligatoria")
    @Email(message = "Deve essere un'email valida")
    private String email;
}
