package com.etms.exception;

/**
 * Thrown when a client asks for an id that does not exist.
 * {@link GlobalExceptionHandler} turns this into HTTP 404 + JSON.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
