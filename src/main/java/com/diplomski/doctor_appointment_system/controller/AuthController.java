package com.diplomski.doctor_appointment_system.controller;

import com.diplomski.doctor_appointment_system.dto.AuthRequest;
import com.diplomski.doctor_appointment_system.dto.AuthResponse;
import com.diplomski.doctor_appointment_system.model.Role;
import com.diplomski.doctor_appointment_system.service.AuthService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // =========================
    // ONLY PATIENT REGISTRATION (PUBLIC)
    // =========================
    @PostMapping("/register/patient")
    public String registerPatient(@RequestBody AuthRequest request) {
        return authService.registerPatient(request);
    }

    // =========================
    // DOCTOR REGISTRATION (ONLY ADMIN)
    // =========================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register/doctor")
    public String registerDoctor(@RequestBody AuthRequest request) {
        return authService.registerDoctor(request);
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        return authService.login(request);
    }
}