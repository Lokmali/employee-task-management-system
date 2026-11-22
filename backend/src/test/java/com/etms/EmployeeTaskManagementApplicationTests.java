package com.etms;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Smoke test: if Spring cannot create any bean, this test fails.
 *
 * {@code @SpringBootTest} starts the full application context (without a real HTTP port
 * unless we ask for one). An empty method is enough — JUnit fails if startup throws.
 */
@SpringBootTest
class EmployeeTaskManagementApplicationTests {

    @Test
    void contextLoads() {
        // Intentionally empty: success means the Spring context started.
    }
}
