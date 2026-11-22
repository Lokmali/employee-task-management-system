package com.etms.dto;

/**
 * JSON returned for an employee, including nested department info.
 */
public record EmployeeResponse(
        Long id,
        String name,
        String email,
        String designation,
        Long departmentId,
        String departmentName
) {
}
