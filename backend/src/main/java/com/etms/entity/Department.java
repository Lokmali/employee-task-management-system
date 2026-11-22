package com.etms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * JPA entity = one row in the {@code departments} table.
 *
 * Lombok annotations (processed at compile time):
 * <ul>
 *   <li>{@code @Getter / @Setter} — generate getName(), setName(), etc.</li>
 *   <li>{@code @NoArgsConstructor} — empty constructor (JPA needs this)</li>
 *   <li>{@code @AllArgsConstructor} — constructor with every field</li>
 *   <li>{@code @Builder} — Department.builder().name("IT").build()</li>
 * </ul>
 */
@Entity
@Table(name = "departments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // IDENTITY = database auto-increments the primary key (SERIAL / BIGSERIAL in Postgres).
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;
}
