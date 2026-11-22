package com.etms.controller;

import com.etms.dto.TaskRequest;
import com.etms.dto.TaskResponse;
import com.etms.dto.TaskStatusUpdateRequest;
import com.etms.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST API for tasks: /api/tasks
 * ADMIN = full CRUD.
 * EMPLOYEE = list/get own tasks + PATCH status on own tasks.
 */
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public List<TaskResponse> getAll() {
        return taskService.findAllForCurrentUser();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public TaskResponse getById(@PathVariable Long id) {
        return taskService.findByIdForCurrentUser(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public TaskResponse create(@Valid @RequestBody TaskRequest request) {
        return taskService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public TaskResponse update(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request
    ) {
        return taskService.update(id, request);
    }

    /**
     * EMPLOYEE (own task) or ADMIN can change status only.
     * Example body: {@code {"status":"IN_PROGRESS"}}
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public TaskResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody TaskStatusUpdateRequest request
    ) {
        return taskService.updateStatusForCurrentUser(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        taskService.delete(id);
    }
}
