package com.etms.repository;

import com.etms.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for {@link Employee}.
 * Extra methods below are created by Spring from the method name (query derivation).
 */
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    /** Returns true if an employee with this email already exists. */
    boolean existsByEmail(String email);

    /**
     * Search by name (case-insensitive partial match) with pagination.
     * Example: name = "ali" matches "Alice" and "Malik".
     */
    Page<Employee> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
