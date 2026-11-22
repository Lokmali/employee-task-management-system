package com.etms.service;

import com.etms.dto.AuthResponse;
import com.etms.dto.LoginRequest;
import com.etms.dto.RegisterRequest;
import com.etms.entity.Employee;
import com.etms.entity.User;
import com.etms.exception.BadRequestException;
import com.etms.exception.UnauthorizedException;
import com.etms.repository.UserRepository;
import com.etms.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Register and login business logic.
 */
@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmployeeService employeeService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            EmployeeService employeeService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.employeeService = employeeService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        Employee linkedEmployee = null;
        if (request.getEmployeeId() != null) {
            linkedEmployee = employeeService.getEntity(request.getEmployeeId());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                // BCrypt hash — we never save the plain password.
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .employee(linkedEmployee)
                .build();

        User saved = userRepository.save(user);
        return toAuthResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            // Spring checks email/password using CustomUserDetailsService + BCrypt.
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        return toAuthResponse(user);
    }

    private AuthResponse toAuthResponse(User user) {
        Long employeeId = user.getEmployee() != null ? user.getEmployee().getId() : null;
        return new AuthResponse(
                jwtService.generateToken(user),
                "Bearer",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                employeeId
        );
    }
}
