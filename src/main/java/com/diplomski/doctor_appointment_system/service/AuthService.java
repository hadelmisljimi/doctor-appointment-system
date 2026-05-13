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
    private final JwtUtil jwtUtil = new JwtUtil();
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String register(AuthRequest request, Role role) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(role);

        userRepository.save(user);

        return "User registered successfully";
    }

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