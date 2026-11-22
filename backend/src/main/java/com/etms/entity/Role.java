package com.etms.entity;

/**
 * Application roles stored on the {@link User} entity.
 * Spring Security will see them as {@code ROLE_ADMIN} / {@code ROLE_EMPLOYEE}.
 */
public enum Role {
    ADMIN,
    EMPLOYEE
}
