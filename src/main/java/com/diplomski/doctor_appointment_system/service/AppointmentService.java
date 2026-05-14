package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.dto.AppointmentRequestDTO;
import com.diplomski.doctor_appointment_system.dto.AppointmentResponseDTO;
import com.diplomski.doctor_appointment_system.exception.AppointmentNotFoundException;
import com.diplomski.doctor_appointment_system.model.Appointment;
import com.diplomski.doctor_appointment_system.model.AppointmentStatus;
import com.diplomski.doctor_appointment_system.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    // =========================
    // MAPPER (clean & reusable)
    // =========================
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

    // =========================
    // GET ALL
    // =========================
    public List<AppointmentResponseDTO> getAllAppointments() {
        return repository.findAll()
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    // =========================
    // BOOK APPOINTMENT (SAFE)
    // =========================
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto) {

        boolean exists = repository.existsByDoctorIdAndDateAndTime(
                dto.getDoctorId(),
                dto.getDate(),
                dto.getTime()
        );

        if (exists) {
            throw new IllegalStateException("This time slot is already booked");
        }

        Appointment a = new Appointment();
        a.setDoctorId(dto.getDoctorId());
        a.setPatientId(dto.getPatientId());
        a.setDate(dto.getDate());
        a.setTime(dto.getTime());
        a.setStatus(AppointmentStatus.BOOKED);

        return map(repository.save(a));
    }

    // =========================
    // CANCEL
    // =========================
    public AppointmentResponseDTO cancelAppointment(String id) {

        Appointment a = repository.findById(id)
                .orElseThrow(() ->
                        new AppointmentNotFoundException("Appointment not found: " + id));

        if (a.getStatus() == AppointmentStatus.COMPLETED) {
            throw new IllegalStateException("Completed appointment cannot be cancelled");
        }

        a.setStatus(AppointmentStatus.CANCELLED);

        return map(repository.save(a));
    }

    // =========================
    // COMPLETE
    // =========================
    public AppointmentResponseDTO completeAppointment(String id) {

        Appointment a = repository.findById(id)
                .orElseThrow(() ->
                        new AppointmentNotFoundException("Appointment not found: " + id));

        if (a.getStatus() == AppointmentStatus.CANCELLED) {
            throw new IllegalStateException("Cancelled appointment cannot be completed");
        }

        a.setStatus(AppointmentStatus.COMPLETED);

        return map(repository.save(a));
    }

    // =========================
    // FILTERS
    // =========================
    public List<AppointmentResponseDTO> getByDoctor(String doctorId) {
        return repository.findByDoctorId(doctorId)
                .stream().map(this::map)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponseDTO> getByPatient(String patientId) {
        return repository.findByPatientId(patientId)
                .stream().map(this::map)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponseDTO> getByDate(String date) {
        return repository.findByDate(date)
                .stream().map(this::map)
                .collect(Collectors.toList());
    }
}