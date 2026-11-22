package com.etms.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Extra Swagger / OpenAPI metadata shown at the top of Swagger UI.
 * UI URL: http://localhost:8080/swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI employeeTaskManagementOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Employee Task Management API")
                        .description("Stage 2: Departments, Employees, Tasks (no security yet)")
                        .version("v1"));
    }
}
