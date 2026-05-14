package com.diplomski.doctor_appointment_system.repository;

import com.diplomski.doctor_appointment_system.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {

    // =========================
    // CHECK SLOT (FAST EXISTS QUERY)
    // =========================
    boolean existsByDoctorIdAndDateAndTime(String doctorId, String date, String time);

    Optional<Appointment> findByDoctorIdAndDateAndTime(String doctorId, String date, String time);

    List<Appointment> findByDoctorId(String doctorId);

    List<Appointment> findByPatientId(String patientId);

    List<Appointment> findByDate(String date);
}