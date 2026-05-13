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

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    // -------------------------
    // MAPPING HELPER
    // -------------------------
    private AppointmentResponseDTO mapToDTO(Appointment appointment) {
        AppointmentResponseDTO dto = new AppointmentResponseDTO();
        dto.setId(appointment.getId());
        dto.setDoctorId(appointment.getDoctorId());
        dto.setPatientId(appointment.getPatientId());
        dto.setDate(appointment.getDate());
        dto.setTime(appointment.getTime());
        dto.setStatus(appointment.getStatus().name());
        return dto;
    }

    // -------------------------
    // GET ALL
    // -------------------------
    public List<AppointmentResponseDTO> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // -------------------------
    // BOOK APPOINTMENT
    // -------------------------
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto) {

        appointmentRepository.findByDoctorIdAndDateAndTime(
                dto.getDoctorId(),
                dto.getDate(),
                dto.getTime()
        ).ifPresent(a -> {
            throw new RuntimeException("This time slot is already booked");
        });

        Appointment appointment = new Appointment();
        appointment.setDoctorId(dto.getDoctorId());
        appointment.setPatientId(dto.getPatientId());
        appointment.setDate(dto.getDate());
        appointment.setTime(dto.getTime());
        appointment.setStatus(AppointmentStatus.BOOKED);

        return mapToDTO(appointmentRepository.save(appointment));
    }

    // -------------------------
    // CANCEL APPOINTMENT (FIXED RULES)
    // -------------------------
    public AppointmentResponseDTO cancelAppointment(String id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new AppointmentNotFoundException("Appointment not found with id: " + id));

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new RuntimeException("Appointment is already cancelled");
        }

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Completed appointment cannot be cancelled");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);

        return mapToDTO(appointmentRepository.save(appointment));
    }

    // -------------------------
    // COMPLETE APPOINTMENT (FIXED RULES)
    // -------------------------
    public AppointmentResponseDTO completeAppointment(String id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new AppointmentNotFoundException("Appointment not found with id: " + id));

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new RuntimeException("Cancelled appointment cannot be completed");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);

        return mapToDTO(appointmentRepository.save(appointment));
    }

    // -------------------------
    // BY DOCTOR
    // -------------------------
    public List<AppointmentResponseDTO> getAppointmentsByDoctor(String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // -------------------------
    // BY PATIENT
    // -------------------------
    public List<AppointmentResponseDTO> getAppointmentsByPatient(String patientId) {
        return appointmentRepository.findByPatientId(patientId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // -------------------------
    // BY DATE
    // -------------------------
    public List<AppointmentResponseDTO> getAppointmentsByDate(String date) {
        return appointmentRepository.findByDate(date)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}