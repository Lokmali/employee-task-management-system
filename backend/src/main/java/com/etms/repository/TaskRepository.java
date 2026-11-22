package com.etms.repository;

import com.etms.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for {@link Task}.
 * Basic CRUD comes from {@link JpaRepository}; we can add custom queries later.
 */
public interface TaskRepository extends JpaRepository<Task, Long> {
}
