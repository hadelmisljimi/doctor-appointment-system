package com.diplomski.doctor_appointment_system;

import com.diplomski.doctor_appointment_system.model.Role;
import com.diplomski.doctor_appointment_system.model.User;
import com.diplomski.doctor_appointment_system.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {

        if (userRepository.findByUsername("admin").isEmpty()) {

            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(encoder.encode("123"));
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println("ADMIN CREATED -> admin / 123");
        }
    }
}