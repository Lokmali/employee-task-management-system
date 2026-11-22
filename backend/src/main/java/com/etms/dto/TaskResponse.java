package com.etms.dto;

import com.etms.entity.TaskStatus;

import java.time.LocalDate;

/**
 * JSON returned for a task.
 */
public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        LocalDate dueDate,
        Long employeeId,
        String employeeName
) {
}
