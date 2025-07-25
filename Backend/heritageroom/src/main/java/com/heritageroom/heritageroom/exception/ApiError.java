package com.heritageroom.heritageroom.exception;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class ApiError {
    private int status;
    private String message;
    private String detail;
    private LocalDateTime timestamp;
    private List<String> errors;

    public ApiError(int status, String message, String detail) {
        this.status = status;
        this.message = message;
        this.detail = detail;
        this.timestamp = LocalDateTime.now();
    }

    public ApiError(int status, String message, String detail, List<String> errors) {
        this.status = status;
        this.message = message;
        this.detail = detail;
        this.errors = errors;
        this.timestamp = LocalDateTime.now();
    }
}
