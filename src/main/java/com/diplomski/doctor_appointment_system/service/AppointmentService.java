package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.dto.AppointmentRequestDTO;
import com.diplomski.doctor_appointment_system.dto.AppointmentResponseDTO;
import com.diplomski.doctor_appointment_system.exception.AppointmentNotFoundException;
import com.diplomski.doctor_appointment_system.model.*;
import com.diplomski.doctor_appointment_system.repository.*;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public AppointmentService(AppointmentRepository repository,
                              DoctorRepository doctorRepository,
                              PatientRepository patientRepository) {
        this.repository = repository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    // =========================
    // MAPPER
    // =========================
    private AppointmentResponseDTO map(Appointment a) {
        AppointmentResponseDTO dto = new AppointmentResponseDTO();
        dto.setId(a.getId());
        dto.setDoctorId(a.getDoctorId());
        dto.setPatientId(a.getPatientId());
        dto.setDate(a.getDate().toString());
        dto.setTime(a.getTime().toString());
        dto.setStatus(a.getStatus().name());
        return dto;
    }

    // =========================
    // SAFE RESOLVE (NO CRASH)
    // =========================
    private String resolveDoctor(String input) {
        if (input == null) return null;

        return doctorRepository.findById(input)
                .map(Doctor::getId)
                .orElseGet(() ->
                        doctorRepository.searchDoctors(input)
                                .stream()
                                .findFirst()
                                .map(Doctor::getId)
                                .orElse(null)
                );
    }

    private String resolvePatient(String input) {
        if (input == null) return null;

        return patientRepository.findById(input)
                .map(Patient::getId)
                .orElseGet(() ->
                        patientRepository.searchPatients(input)
                                .stream()
                                .findFirst()
                                .map(Patient::getId)
                                .orElse(null)
                );
    }

    // =========================
    // BOOK
    // =========================
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto) {

        String doctorId = resolveDoctor(dto.getDoctorId());
        String patientId = resolvePatient(dto.getPatientId());

        LocalDate date = LocalDate.parse(dto.getDate());
        LocalTime time = LocalTime.parse(dto.getTime());

        if (doctorId == null || patientId == null) {
            throw new IllegalStateException("Doctor or Patient not found");
        }

        boolean exists = repository.existsByDoctorIdAndDateAndTime(
                doctorId, date, time
        );

        if (exists) {
            throw new IllegalStateException("Time slot already booked");
        }

        Appointment a = new Appointment();
        a.setId(UUID.randomUUID().toString());
        a.setDoctorId(doctorId);
        a.setPatientId(patientId);
        a.setDate(date);
        a.setTime(time);
        a.setStatus(AppointmentStatus.BOOKED);

        return map(repository.save(a));
    }

    // =========================
    // SEARCH (SMART + SAFE)
    // =========================
    public List<AppointmentResponseDTO> search(String doctor, String patient, String date) {

        String doctorId = resolveDoctor(doctor);
        String patientId = resolvePatient(patient);

        return repository.findAll().stream()
                .filter(a -> doctorId == null || a.getDoctorId().equals(doctorId))
                .filter(a -> patientId == null || a.getPatientId().equals(patientId))
                .filter(a -> date == null || a.getDate().toString().equals(date))
                .map(this::map)
                .collect(Collectors.toList());
    }

    // =========================
    // STATUS
    // =========================
    public AppointmentResponseDTO cancelAppointment(String id) {
        Appointment a = repository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException("Not found"));

        a.setStatus(AppointmentStatus.CANCELLED);
        return map(repository.save(a));
    }

    public AppointmentResponseDTO completeAppointment(String id) {
        Appointment a = repository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException("Not found"));

        a.setStatus(AppointmentStatus.COMPLETED);
        return map(repository.save(a));
    }
}