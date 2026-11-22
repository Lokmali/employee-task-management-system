package com.etms.dto;

import com.etms.entity.Role;

/**
 * Returned after register/login. Client stores {@code token} and sends it as
 * {@code Authorization: Bearer <token>} on later requests.
 */
public record AuthResponse(
        String token,
        String tokenType,
        Long userId,
        String name,
        String email,
        Role role,
        Long employeeId
) {
}
