package com.etms.exception;

/**
 * Thrown when authentication is missing or credentials are wrong → HTTP 401.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
