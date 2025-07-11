package com.heritageroom.heritageroom.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class BookingRequest {

    // GETTERS & SETTERS
    @NotNull
    private LocalDate checkIn;

    @NotNull
    private LocalDate checkOut;

    @NotNull
    private Long customerId;

    @NotNull
    private Long roomId;

}
