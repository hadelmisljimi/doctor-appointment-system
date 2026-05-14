package com.diplomski.doctor_appointment_system.repository;

import com.diplomski.doctor_appointment_system.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface DoctorRepository extends MongoRepository<Doctor, String> {

    List<Doctor> findBySpecializationIgnoreCase(String specialization);

    // GLOBAL SEARCH (NAME / EMAIL / SPECIALIZATION)
    @Query("{ $or: [ " +
            "{ 'name': { $regex: ?0, $options: 'i' } }, " +
            "{ 'email': { $regex: ?0, $options: 'i' } }, " +
            "{ 'specialization': { $regex: ?0, $options: 'i' } } " +
            "] }")
    List<Doctor> searchDoctors(String keyword);
}