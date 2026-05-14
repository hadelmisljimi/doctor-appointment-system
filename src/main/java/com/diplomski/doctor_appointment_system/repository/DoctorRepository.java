package com.diplomski.doctor_appointment_system.repository;

import com.diplomski.doctor_appointment_system.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends MongoRepository<Doctor, String> {

    List<Doctor> findBySpecializationIgnoreCase(String specialization);

    // SEARCH BY NAME
    List<Doctor> findByNameContainingIgnoreCase(String name);

    // SEARCH BY ID (optional helper)
    Optional<Doctor> findById(String id);
}