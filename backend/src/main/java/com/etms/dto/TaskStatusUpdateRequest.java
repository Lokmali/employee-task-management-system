package com.etms.dto;

import com.etms.entity.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Body for {@code PATCH /api/tasks/{id}/status}.
 * EMPLOYEE users may only change status on their own tasks.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private TaskStatus status;
}
