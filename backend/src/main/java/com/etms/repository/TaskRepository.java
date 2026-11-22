package com.etms.repository;

import com.etms.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository for {@link Task}.
 * Basic CRUD comes from {@link JpaRepository}.
 */
public interface TaskRepository extends JpaRepository<Task, Long> {

    /** Used so an EMPLOYEE can list only tasks assigned to them. */
    List<Task> findByEmployeeId(Long employeeId);
}

