package com.etms.exception;

/**
 * Thrown when the user is logged in but not allowed to do this action → HTTP 403.
 * Example: EMPLOYEE tries to read someone else's task.
 */
public class ForbiddenException extends RuntimeException {

    public ForbiddenException(String message) {
        super(message);
    }
}
