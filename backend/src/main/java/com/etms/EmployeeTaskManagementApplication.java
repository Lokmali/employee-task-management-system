package com.etms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Starting point of the Spring Boot backend.
 *
 * {@code @SpringBootApplication} is a shortcut for three annotations:
 * <ul>
 *   <li>{@code @Configuration} — this class can define Spring beans</li>
 *   <li>{@code @EnableAutoConfiguration} — Boot wires Tomcat, Jackson, etc. from the classpath</li>
 *   <li>{@code @ComponentScan} — finds {@code @RestController}, {@code @Service}, etc. under {@code com.etms}</li>
 * </ul>
 */
@SpringBootApplication
public class EmployeeTaskManagementApplication {

    /**
     * JVM starts here. {@link SpringApplication#run} creates the ApplicationContext
     * (the Spring container) and starts the embedded Tomcat server.
     */
    public static void main(String[] args) {
        SpringApplication.run(EmployeeTaskManagementApplication.class, args);
    }
}
