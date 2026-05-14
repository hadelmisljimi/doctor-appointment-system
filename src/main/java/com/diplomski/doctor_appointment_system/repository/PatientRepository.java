package com.diplomski.doctor_appointment_system.repository;

import com.diplomski.doctor_appointment_system.model.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends MongoRepository<Patient, String> {

    // =========================
    // FIND BY EMAIL
    // =========================
    Optional<Patient> findByEmail(String email);

    // =========================
    // CHECK UNIQUE EMAIL
    // =========================
    boolean existsByEmail(String email);

    // =========================
    // GLOBAL SEARCH (PRO LEVEL)
    // =========================
    @Query("""
        {
          $or: [
            { 'name': { $regex: ?0, $options: 'i' } },
            { 'email': { $regex: ?0, $options: 'i' } },
            { 'phone': { $regex: ?0, $options: 'i' } }
          ]
        }
    """)
    List<Patient> search(String keyword);
}