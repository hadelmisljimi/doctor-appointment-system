package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.dto.AuthRequest;
import com.diplomski.doctor_appointment_system.dto.AuthResponse;
import com.diplomski.doctor_appointment_system.model.Role;
import com.diplomski.doctor_appointment_system.model.User;
import com.diplomski.doctor_appointment_system.repository.UserRepository;
import com.diplomski.doctor_appointment_system.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.diplomski.doctor_appointment_system.dto.ResetPasswordRequest;

@Service
public class AuthService {

    private final UserRepository repo;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository repo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
    }

    private String register(AuthRequest req, Role role) {

        if (repo.findByUsername(req.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        if (req.getSecurityAnswer() == null || req.getSecurityAnswer().isEmpty()) {
            throw new RuntimeException("Security answer (color) is required");
        }

        User u = new User();
        u.setUsername(req.getUsername());
        u.setPassword(encoder.encode(req.getPassword()));
        u.setRole(role);
        u.setSecurityAnswer(req.getSecurityAnswer());

        repo.save(u);

        return "Registered successfully as " + role;
    }

    public String registerPatient(AuthRequest req) {
        return register(req, Role.PATIENT);
    }

    public String registerDoctor(AuthRequest req) {
        return register(req, Role.DOCTOR);
    }

    public AuthResponse login(AuthRequest req) {

        User u = repo.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(req.getPassword(), u.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(u.getUsername(), u.getRole().name());

        return new AuthResponse(token, u.getRole().name());
    }

    public String resetPassword(ResetPasswordRequest req) {

        User user = repo.findByUsername(req.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!user.getSecurityAnswer()
                .equalsIgnoreCase(req.getSecurityAnswer())) {

            throw new RuntimeException(
                    "Wrong security answer");
        }

        user.setPassword(
                encoder.encode(req.getNewPassword())
        );

        repo.save(user);

        return "Password changed successfully";
    }

    public String getUserColor(String username) {

        User user = repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getSecurityAnswer();
    }
}