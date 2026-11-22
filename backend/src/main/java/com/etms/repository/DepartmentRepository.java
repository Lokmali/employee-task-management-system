package com.etms.repository;

import com.etms.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for {@link Department}.
 *
 * <p>We only declare the interface. Spring creates the implementation at runtime
 * and gives us methods like {@code findById}, {@code save}, {@code findAll}, {@code deleteById}.</p>
 *
 * <p>{@code JpaRepository<Department, Long>} means: entity type = Department, id type = Long.</p>
 */
public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
