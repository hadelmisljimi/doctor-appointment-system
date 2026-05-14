package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.dto.AuthRequest;
import com.diplomski.doctor_appointment_system.dto.AuthResponse;
import com.diplomski.doctor_appointment_system.model.Role;
import com.diplomski.doctor_appointment_system.model.User;
import com.diplomski.doctor_appointment_system.repository.UserRepository;
import com.diplomski.doctor_appointment_system.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // =========================
    // REGISTER PATIENT (PUBLIC)
    // =========================
    public String registerPatient(AuthRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(Role.PATIENT);

        userRepository.save(user);

        return "Patient registered successfully";
    }

    // =========================
    // REGISTER DOCTOR (ADMIN ONLY)
    // =========================
    public String registerDoctor(AuthRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(Role.DOCTOR);

        userRepository.save(user);

        return "Doctor registered successfully";
    }

    // =========================
    // LOGIN
    // =========================
    public AuthResponse login(AuthRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        return new AuthResponse(token, user.getRole().name());
    }
}