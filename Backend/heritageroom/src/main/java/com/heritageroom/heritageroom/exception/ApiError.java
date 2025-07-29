package com.heritageroom.heritageroom.exception;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
public class ApiError {
    // Getters e setters
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private List<String> errors;

    public ApiError() {
        this.timestamp = LocalDateTime.now();
    }

    public ApiError(int status, String error, String message) {
        this();
        this.status = status;
        this.error = error;
        this.message = message;
    }

    public ApiError(int status, String error, String message, List<String> errors) {
        this(status, error, message);
        this.errors = errors;
    }

}
