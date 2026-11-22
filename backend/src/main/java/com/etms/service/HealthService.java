package com.etms.service;

import com.etms.dto.HealthResponse;
import org.springframework.stereotype.Service;

/**
 * Tiny service so Stage 1 already shows the Controller → Service pattern.
 *
 * {@code @Service} tells Spring: create one object of this class (a singleton bean)
 * and allow it to be injected into other classes.
 */
@Service
public class HealthService {

    /**
     * Builds the health DTO. Later this could check the database connection too.
     */
    public HealthResponse getHealth() {
        return new HealthResponse("UP", "Employee Task Management System is running");
    }
}
