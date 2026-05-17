package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.dto.*;
import com.diplomski.doctor_appointment_system.model.*;
import com.diplomski.doctor_appointment_system.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

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

    // ================= MAP =================
    private AppointmentResponseDTO map(Appointment a) {

        Doctor doctor = doctorRepository.findById(a.getDoctorId()).orElse(null);
        Patient patient = patientRepository.findById(a.getPatientId()).orElse(null);

        AppointmentResponseDTO dto = new AppointmentResponseDTO();

        dto.setId(a.getId());
        dto.setDoctorId(a.getDoctorId());
        dto.setDoctorName(doctor != null ? doctor.getName() : "Unknown Doctor");

        dto.setPatientId(a.getPatientId());
        dto.setPatientName(patient != null ? patient.getName() : "Unknown Patient");

        dto.setDate(a.getDate());
        dto.setTime(a.getTime());
        dto.setStatus(a.getStatus().name());

        return dto;
    }

    // ================= RESOLVE DOCTOR (ID or NAME) =================
    private String resolveDoctor(String input) {

        if (input == null || input.isBlank()) return null;

        // 1. TRY BY ID
        return doctorRepository.findById(input)
                .map(Doctor::getId)
                .orElseGet(() ->

                        // 2. TRY BY NAME
                        doctorRepository.findAll().stream()
                                .filter(d -> d.getName().equalsIgnoreCase(input))
                                .findFirst()
                                .map(Doctor::getId)
                                .orElse(null)
                );
    }

    // ================= RESOLVE PATIENT (ID or NAME) =================
    private String resolvePatient(String input) {

        if (input == null || input.isBlank()) return null;

        return patientRepository.findById(input)
                .map(Patient::getId)
                .orElseGet(() ->

                        patientRepository.findAll().stream()
                                .filter(p -> p.getName().equalsIgnoreCase(input))
                                .findFirst()
                                .map(Patient::getId)
                                .orElse(null)
                );
    }

    // ================= GET ALL =================
    public List<AppointmentResponseDTO> getAllAppointments() {

        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    // ================= BOOK =================
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto) {

        String doctorId = resolveDoctor(dto.getDoctorId());
        String patientId = resolvePatient(dto.getPatientId());

        if (doctorId == null) {
            throw new RuntimeException("Doctor not found: " + dto.getDoctorId());
        }

        if (patientId == null) {
            throw new RuntimeException("Patient not found: " + dto.getPatientId());
        }

        Appointment a = new Appointment();

        a.setId(UUID.randomUUID().toString());
        a.setDoctorId(doctorId);
        a.setPatientId(patientId);
        a.setDate(dto.getDate());
        a.setTime(dto.getTime());
        a.setStatus(AppointmentStatus.BOOKED);

        return map(repository.save(a));
    }

    // ================= SEARCH (ID or NAME) =================
    public List<AppointmentResponseDTO> search(String doctor, String patient, String date, String id) {

        if (id != null && !id.isBlank()) {
            return repository.findById(id)
                    .stream()
                    .map(this::map)
                    .toList();
        }

        String doctorId = resolveDoctor(doctor);
        String patientId = resolvePatient(patient);

        return repository.findAll().stream()
                .filter(a -> doctorId == null || a.getDoctorId().equals(doctorId))
                .filter(a -> patientId == null || a.getPatientId().equals(patientId))
                .filter(a -> date == null || a.getDate().equals(date))
                .map(this::map)
                .toList();
    }

    // ================= CANCEL =================
    public AppointmentResponseDTO cancelAppointment(String id) {

        Appointment a = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        a.setStatus(AppointmentStatus.CANCELLED);
        return map(repository.save(a));
    }

    // ================= COMPLETE =================
    public AppointmentResponseDTO completeAppointment(String id) {

        Appointment a = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        a.setStatus(AppointmentStatus.COMPLETED);
        return map(repository.save(a));
    }

    // ================= DELETE =================
    public void deleteAppointment(String id) {

        Appointment a = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        repository.delete(a);
    }
}