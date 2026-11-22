package com.etms.service;

import com.etms.dto.TaskRequest;
import com.etms.dto.TaskResponse;
import com.etms.dto.TaskStatusUpdateRequest;
import com.etms.entity.Employee;
import com.etms.entity.Role;
import com.etms.entity.Task;
import com.etms.entity.User;
import com.etms.exception.BadRequestException;
import com.etms.exception.ForbiddenException;
import com.etms.exception.ResourceNotFoundException;
import com.etms.repository.TaskRepository;
import com.etms.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Business logic for tasks, including EMPLOYEE ownership checks.
 */
@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final EmployeeService employeeService;

    public TaskService(TaskRepository taskRepository, EmployeeService employeeService) {
        this.taskRepository = taskRepository;
        this.employeeService = employeeService;
    }

    /** ADMIN sees all tasks; EMPLOYEE sees only tasks linked to their employee profile. */
    @Transactional(readOnly = true)
    public List<TaskResponse> findAllForCurrentUser() {
        User current = SecurityUtils.currentUser();
        if (current.getRole() == Role.ADMIN) {
            return taskRepository.findAll().stream().map(this::toResponse).toList();
        }
        Long employeeId = requireLinkedEmployeeId(current);
        return taskRepository.findByEmployeeId(employeeId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse findByIdForCurrentUser(Long id) {
        Task task = getEntity(id);
        ensureCanView(task, SecurityUtils.currentUser());
        return toResponse(task);
    }

    public TaskResponse create(TaskRequest request) {
        Employee employee = employeeService.getEntity(request.getEmployeeId());

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .dueDate(request.getDueDate())
                .employee(employee)
                .build();

        return toResponse(taskRepository.save(task));
    }

    public TaskResponse update(Long id, TaskRequest request) {
        Task task = getEntity(id);
        Employee employee = employeeService.getEntity(request.getEmployeeId());

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());
        task.setEmployee(employee);

        return toResponse(taskRepository.save(task));
    }

    /** ADMIN any task; EMPLOYEE only their own. */
    public TaskResponse updateStatusForCurrentUser(Long id, TaskStatusUpdateRequest request) {
        Task task = getEntity(id);
        ensureCanView(task, SecurityUtils.currentUser());
        task.setStatus(request.getStatus());
        return toResponse(taskRepository.save(task));
    }

    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Task getEntity(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    private void ensureCanView(Task task, User user) {
        if (user.getRole() == Role.ADMIN) {
            return;
        }
        Long employeeId = requireLinkedEmployeeId(user);
        if (!task.getEmployee().getId().equals(employeeId)) {
            throw new ForbiddenException("You can only access your own tasks");
        }
    }

    private Long requireLinkedEmployeeId(User user) {
        if (user.getEmployee() == null) {
            throw new BadRequestException(
                    "This EMPLOYEE account is not linked to an employee profile. Register with employeeId."
            );
        }
        return user.getEmployee().getId();
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getDueDate(),
                task.getEmployee().getId(),
                task.getEmployee().getName()
        );
    }
}
