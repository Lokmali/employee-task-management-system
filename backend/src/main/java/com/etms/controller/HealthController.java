package com.etms.controller;

import com.etms.dto.HealthResponse;
import com.etms.service.HealthService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * First REST endpoint. Used to prove the backend is up.
 *
 * <ul>
 *   <li>{@code @RestController} = {@code @Controller} + {@code @ResponseBody}
 *       (return value is JSON, not an HTML page)</li>
 *   <li>{@code @RequestMapping("/api")} prefixes every method in this class</li>
 * </ul>
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    // final = must be set in the constructor and cannot be reassigned
    private final HealthService healthService;

    /**
     * Constructor injection (preferred).
     * Spring sees this single constructor and passes in the HealthService bean.
     * We do not need {@code @Autowired} on the constructor when there is only one.
     */
    public HealthController(HealthService healthService) {
        this.healthService = healthService;
    }

    /**
     * GET http://localhost:8080/api/health
     * Returns a {@link HealthResponse} DTO, never an entity.
     */
    @GetMapping("/health")
    public HealthResponse health() {
        return healthService.getHealth();
    }
}
