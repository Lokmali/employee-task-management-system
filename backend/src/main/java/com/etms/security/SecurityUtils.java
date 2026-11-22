package com.etms.security;

import com.etms.entity.User;
import com.etms.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Small helpers to read the currently logged-in user from the SecurityContext.
 */
public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails details)) {
            throw new UnauthorizedException("No authenticated user found");
        }
        return details.getUser();
    }
}
