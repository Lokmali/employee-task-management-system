package com.etms.service;

import com.etms.dto.EmployeeRequest;
import com.etms.dto.EmployeeResponse;
import com.etms.entity.Department;
import com.etms.entity.Employee;
import com.etms.exception.BadRequestException;
import com.etms.exception.ResourceNotFoundException;
import com.etms.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * Business logic for employees: CRUD, email uniqueness, search + pagination.
 */
@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentService departmentService;

    public EmployeeService(EmployeeRepository employeeRepository, DepartmentService departmentService) {
        this.employeeRepository = employeeRepository;
        this.departmentService = departmentService;
    }

    /**
     * List employees with pagination.
     * If {@code name} is present, filter with a case-insensitive contains search.
     */
    @Transactional(readOnly = true)
    public Page<EmployeeResponse> findAll(String name, Pageable pageable) {
        Page<Employee> page;
        if (StringUtils.hasText(name)) {
            page = employeeRepository.findByNameContainingIgnoreCase(name.trim(), pageable);
        } else {
            page = employeeRepository.findAll(pageable);
        }
        return page.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse findById(Long id) {
        return toResponse(getEntity(id));
    }

    public EmployeeResponse create(EmployeeRequest request) {
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use: " + request.getEmail());
        }

        Department department = departmentService.getEntity(request.getDepartmentId());

        Employee employee = Employee.builder()
                .name(request.getName())
                .email(request.getEmail())
                .designation(request.getDesignation())
                .department(department)
                .build();

        return toResponse(employeeRepository.save(employee));
    }

    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee employee = getEntity(id);

        // Allow keeping the same email; block only if another row already has it.
        if (!employee.getEmail().equalsIgnoreCase(request.getEmail())
                && employeeRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use: " + request.getEmail());
        }

        Department department = departmentService.getEntity(request.getDepartmentId());

        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setDesignation(request.getDesignation());
        employee.setDepartment(department);

        return toResponse(employeeRepository.save(employee));
    }

    public void delete(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Employee getEntity(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    private EmployeeResponse toResponse(Employee employee) {
        return new EmployeeResponse(
                employee.getId(),
                employee.getName(),
                employee.getEmail(),
                employee.getDesignation(),
                employee.getDepartment().getId(),
                employee.getDepartment().getName()
        );
    }
}
