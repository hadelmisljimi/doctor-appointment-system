package com.diplomski.doctor_appointment_system.repository;

import com.diplomski.doctor_appointment_system.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DoctorRepository extends MongoRepository<Doctor, String> {

    // SEARCH by specialization (case insensitive)
    List<Doctor> findBySpecializationIgnoreCase(String specialization);
}