package com.etms.service;

import com.etms.dto.EmployeeRequest;
import com.etms.dto.EmployeeResponse;
import com.etms.entity.Department;
import com.etms.entity.Employee;
import com.etms.exception.BadRequestException;
import com.etms.exception.ResourceNotFoundException;
import com.etms.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link EmployeeService}.
 * We mock the repository and DepartmentService — no real database is needed.
 *
 * {@code @ExtendWith(MockitoExtension.class)} turns on Mockito annotations.
 * {@code @Mock} = fake dependency. {@code @InjectMocks} = real EmployeeService with mocks injected.
 */
@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private DepartmentService departmentService;

    @InjectMocks
    private EmployeeService employeeService;

    private Department itDepartment;
    private Employee alice;

    @BeforeEach
    void setUp() {
        itDepartment = Department.builder().id(1L).name("IT").build();
        alice = Employee.builder()
                .id(10L)
                .name("Alice")
                .email("alice@example.com")
                .designation("Developer")
                .department(itDepartment)
                .build();
    }

    @Test
    void createEmployee_success() {
        EmployeeRequest request = new EmployeeRequest(
                "Alice", "alice@example.com", "Developer", 1L
        );

        when(employeeRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(departmentService.getEntity(1L)).thenReturn(itDepartment);
        when(employeeRepository.save(any(Employee.class))).thenAnswer(invocation -> {
            Employee saved = invocation.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        EmployeeResponse response = employeeService.create(request);

        assertThat(response.id()).isEqualTo(10L);
        assertThat(response.name()).isEqualTo("Alice");
        assertThat(response.departmentName()).isEqualTo("IT");

        ArgumentCaptor<Employee> captor = ArgumentCaptor.forClass(Employee.class);
        verify(employeeRepository).save(captor.capture());
        assertThat(captor.getValue().getEmail()).isEqualTo("alice@example.com");
    }

    @Test
    void createEmployee_duplicateEmail_throwsBadRequest() {
        EmployeeRequest request = new EmployeeRequest(
                "Alice", "alice@example.com", "Developer", 1L
        );
        when(employeeRepository.existsByEmail("alice@example.com")).thenReturn(true);

        assertThatThrownBy(() -> employeeService.create(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Email already in use");

        verify(employeeRepository, never()).save(any());
    }

    @Test
    void findById_notFound_throwsResourceNotFound() {
        when(employeeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void findAll_withName_usesSearchQuery() {
        Pageable pageable = PageRequest.of(0, 10);
        when(employeeRepository.findByNameContainingIgnoreCase("ali", pageable))
                .thenReturn(new PageImpl<>(List.of(alice)));

        Page<EmployeeResponse> page = employeeService.findAll("ali", pageable);

        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getContent().get(0).name()).isEqualTo("Alice");
        verify(employeeRepository).findByNameContainingIgnoreCase("ali", pageable);
        verify(employeeRepository, never()).findAll(pageable);
    }

    @Test
    void findAll_withoutName_listsAll() {
        Pageable pageable = PageRequest.of(0, 10);
        when(employeeRepository.findAll(pageable))
                .thenReturn(new PageImpl<>(List.of(alice)));

        Page<EmployeeResponse> page = employeeService.findAll(null, pageable);

        assertThat(page.getTotalElements()).isEqualTo(1);
        verify(employeeRepository).findAll(pageable);
    }
}
