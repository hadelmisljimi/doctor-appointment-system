package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.dto.*;
import com.diplomski.doctor_appointment_system.model.*;
import com.diplomski.doctor_appointment_system.repository.*;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository,
                              DoctorRepository doctorRepository,
                              PatientRepository patientRepository) {
        this.repository = repository;
    }

    // ================= MAP =================
    private AppointmentResponseDTO map(Appointment a) {
        AppointmentResponseDTO dto = new AppointmentResponseDTO();
        dto.setId(a.getId());
        dto.setDoctorId(a.getDoctorId());
        dto.setPatientId(a.getPatientId());
        dto.setDate(a.getDate());
        dto.setTime(a.getTime());
        dto.setStatus(a.getStatus().name());
        return dto;
    }

    // ================= VALIDATION =================
    private void validateDate(String date) {
        if (date == null || !date.matches("^\\d{2}\\.\\d{2}\\.\\d{4}\\.$")) {
            throw new IllegalArgumentException(
                    "Invalid date format. Required: dd.MM.yyyy. Example: 15.05.2026."
            );
        }
    }

    private void validateTime(String time) {
        if (time == null || !time.matches("^([01]\\d|2[0-3]):[0-5]\\d$")) {
            throw new IllegalArgumentException(
                    "Invalid time format. Required: HH:mm. Example: 17:00"
            );
        }
    }

    // ================= GET ALL =================
    public List<AppointmentResponseDTO> getAllAppointments() {

        List<AppointmentResponseDTO> list = repository.findAll()
                .stream()
                .map(this::map)
                .toList();

        if (list.isEmpty()) {
            throw new RuntimeException("No appointments found");
        }

        return list;
    }

    // ================= BOOK =================
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto) {

        validateDate(dto.getDate());
        validateTime(dto.getTime());

        Appointment a = new Appointment();
        a.setId(UUID.randomUUID().toString());
        a.setDoctorId(dto.getDoctorId());
        a.setPatientId(dto.getPatientId());
        a.setDate(dto.getDate());
        a.setTime(dto.getTime());
        a.setStatus(AppointmentStatus.BOOKED);

        return map(repository.save(a));
    }

    // ================= SEARCH =================
    public List<AppointmentResponseDTO> search(String doctor, String patient, String date, String id) {

        if (id != null && !id.isBlank()) {
            return repository.findById(id)
                    .stream()
                    .map(this::map)
                    .toList();
        }

        if (date != null) validateDate(date);

        List<AppointmentResponseDTO> result = repository.findAll().stream()
                .filter(a -> doctor == null || a.getDoctorId().equals(doctor))
                .filter(a -> patient == null || a.getPatientId().equals(patient))
                .filter(a -> date == null || a.getDate().equals(date))
                .map(this::map)
                .toList();

        if (result.isEmpty()) {
            throw new RuntimeException("No appointments found for given criteria");
        }

        return result;
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
}