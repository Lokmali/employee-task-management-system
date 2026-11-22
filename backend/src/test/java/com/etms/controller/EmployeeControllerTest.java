package com.etms.controller;

import com.etms.dto.EmployeeRequest;
import com.etms.dto.EmployeeResponse;
import com.etms.exception.GlobalExceptionHandler;
import com.etms.exception.ResourceNotFoundException;
import com.etms.service.EmployeeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * MockMvc tests for {@link EmployeeController}.
 *
 * {@code @WebMvcTest} loads only the web layer (controllers), not the full app / database.
 * {@code @MockitoBean} replaces EmployeeService with a mock.
 * {@code @Import(GlobalExceptionHandler.class)} so 404/validation still return our JSON.
 */
@WebMvcTest(EmployeeController.class)
@Import(GlobalExceptionHandler.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private EmployeeService employeeService;

    @Test
    void createEmployee_returns201() throws Exception {
        EmployeeRequest request = new EmployeeRequest(
                "Alice", "alice@example.com", "Developer", 1L
        );
        EmployeeResponse response = new EmployeeResponse(
                10L, "Alice", "alice@example.com", "Developer", 1L, "IT"
        );
        when(employeeService.create(any(EmployeeRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.email").value("alice@example.com"));
    }

    @Test
    void createEmployee_invalidEmail_returns400() throws Exception {
        // Missing @ on email → @Email fails before the service is called.
        String body = """
                {
                  "name": "Alice",
                  "email": "not-an-email",
                  "designation": "Developer",
                  "departmentId": 1
                }
                """;

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.fieldErrors.email").exists());
    }

    @Test
    void getEmployees_returnsPage() throws Exception {
        EmployeeResponse response = new EmployeeResponse(
                10L, "Alice", "alice@example.com", "Developer", 1L, "IT"
        );
        when(employeeService.findAll(isNull(), any()))
                .thenReturn(new PageImpl<>(List.of(response), PageRequest.of(0, 10), 1));

        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Alice"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void getEmployees_withName_passesSearchParam() throws Exception {
        when(employeeService.findAll(eq("ali"), any()))
                .thenReturn(new PageImpl<>(List.of()));

        mockMvc.perform(get("/api/employees").param("name", "ali"))
                .andExpect(status().isOk());

        verify(employeeService).findAll(eq("ali"), any());
    }

    @Test
    void getEmployeeById_notFound_returns404() throws Exception {
        when(employeeService.findById(99L))
                .thenThrow(new ResourceNotFoundException("Employee not found with id: 99"));

        mockMvc.perform(get("/api/employees/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Employee not found with id: 99"));
    }

    @Test
    void updateEmployee_returns200() throws Exception {
        EmployeeRequest request = new EmployeeRequest(
                "Alice Updated", "alice@example.com", "Lead", 1L
        );
        EmployeeResponse response = new EmployeeResponse(
                10L, "Alice Updated", "alice@example.com", "Lead", 1L, "IT"
        );
        when(employeeService.update(eq(10L), any(EmployeeRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/employees/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Alice Updated"));
    }

    @Test
    void deleteEmployee_returns204() throws Exception {
        mockMvc.perform(delete("/api/employees/10"))
                .andExpect(status().isNoContent());

        verify(employeeService).delete(10L);
    }

    @Test
    void deleteEmployee_notFound_returns404() throws Exception {
        doThrow(new ResourceNotFoundException("Employee not found with id: 99"))
                .when(employeeService).delete(99L);

        mockMvc.perform(delete("/api/employees/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
