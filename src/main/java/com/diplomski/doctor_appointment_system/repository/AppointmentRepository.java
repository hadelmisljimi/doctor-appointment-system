package com.diplomski.doctor_appointment_system.repository;

import com.diplomski.doctor_appointment_system.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.List;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {

    // 📌 provjera da li već postoji termin za doktora u to vrijeme
    Optional<Appointment> findByDoctorIdAndDateAndTime(String doctorId, String date, String time);

    // 📌 (opciono) svi termini za jednog doktora
    List<Appointment> findByDoctorId(String doctorId);

    // 📌 (opciono) svi termini za pacijenta
    List<Appointment> findByPatientId(String patientId);

    List<Appointment> findByDate(String date);
}