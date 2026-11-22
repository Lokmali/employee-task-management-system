package com.etms.dto;

/**
 * JSON returned to the client for a department.
 * We never return the {@link com.etms.entity.Department} entity itself.
 */
public record DepartmentResponse(Long id, String name) {
}
