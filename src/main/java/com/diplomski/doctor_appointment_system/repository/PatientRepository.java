package com.diplomski.doctor_appointment_system.repository;

import com.diplomski.doctor_appointment_system.model.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends MongoRepository<Patient, String> {

    // SEARCH BY NAME
    List<Patient> findByNameContainingIgnoreCase(String name);

    // SEARCH BY ID (optional helper)
    Optional<Patient> findById(String id);
}