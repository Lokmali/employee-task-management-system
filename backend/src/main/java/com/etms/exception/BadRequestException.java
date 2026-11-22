package com.etms.exception;

/**
 * Thrown for business-rule problems (example: duplicate email).
 * Mapped to HTTP 400 by {@link GlobalExceptionHandler}.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
