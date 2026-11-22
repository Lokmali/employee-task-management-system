package com.etms.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger / OpenAPI metadata + JWT Authorize button.
 * UI URL: http://localhost:8080/swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

    private static final String BEARER_SCHEME = "bearerAuth";

    @Bean
    public OpenAPI employeeTaskManagementOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Employee Task Management API")
                        .description("Stage 3: JWT security. Click Authorize and paste: Bearer <token>")
                        .version("v1"))
                // Tell Swagger UI there is a Bearer JWT scheme.
                .components(new Components()
                        .addSecuritySchemes(BEARER_SCHEME, new SecurityScheme()
                                .name(BEARER_SCHEME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))
                // Apply the scheme globally so the Authorize button is used by default.
                .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME));
    }
}
