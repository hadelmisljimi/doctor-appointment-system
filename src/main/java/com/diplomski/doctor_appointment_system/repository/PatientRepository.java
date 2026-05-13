package com.diplomski.doctor_appointment_system.repository;

import com.diplomski.doctor_appointment_system.model.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PatientRepository extends MongoRepository<Patient, String> {
}