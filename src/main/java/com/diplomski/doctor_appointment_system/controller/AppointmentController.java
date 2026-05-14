package com.diplomski.doctor_appointment_system.controller;

import com.diplomski.doctor_appointment_system.dto.AppointmentRequestDTO;
import com.diplomski.doctor_appointment_system.dto.AppointmentResponseDTO;
import com.diplomski.doctor_appointment_system.service.AppointmentService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(
        name = "Appointments",
        description = "Appointment management APIs"
)
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService
    ) {
        this.appointmentService = appointmentService;
    }

    // =========================
    // GET ALL APPOINTMENTS
    // =========================
    @Operation(
            summary = "Get All Appointments",
            description = "Retrieve all appointments"
    )
    @GetMapping
    public List<AppointmentResponseDTO> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    // =========================
    // CREATE APPOINTMENT
    // =========================
    @Operation(
            summary = "Create Appointment",
            description = "Book a new appointment"
    )
    @PostMapping
    public AppointmentResponseDTO book(
            @Valid @RequestBody AppointmentRequestDTO dto
    ) {
        return appointmentService.bookAppointment(dto);
    }

    // =========================
    // CANCEL APPOINTMENT
    // =========================
    @Operation(
            summary = "Cancel Appointment",
            description = "Cancel appointment by ID"
    )
    @PutMapping("/cancel/{id}")
    public AppointmentResponseDTO cancelAppointment(
            @PathVariable String id
    ) {
        return appointmentService.cancelAppointment(id);
    }

    // =========================
    // COMPLETE APPOINTMENT
    // =========================
    @Operation(
            summary = "Complete Appointment",
            description = "Mark appointment as completed"
    )
    @PutMapping("/{id}/complete")
    public AppointmentResponseDTO complete(
            @PathVariable String id
    ) {
        return appointmentService.completeAppointment(id);
    }

    // =========================
    // GET APPOINTMENTS BY DOCTOR
    // =========================
    @Operation(
            summary = "Get Appointments By Doctor",
            description = "Retrieve appointments for specific doctor"
    )
    @GetMapping("/doctor/{doctorId}")
    public List<AppointmentResponseDTO> getByDoctor(
            @PathVariable String doctorId
    ) {
        return appointmentService.getAppointmentsByDoctor(doctorId);
    }

    // =========================
    // GET APPOINTMENTS BY PATIENT
    // =========================
    @Operation(
            summary = "Get Appointments By Patient",
            description = "Retrieve appointments for specific patient"
    )
    @GetMapping("/patient/{patientId}")
    public List<AppointmentResponseDTO> getByPatient(
            @PathVariable String patientId
    ) {
        return appointmentService.getAppointmentsByPatient(patientId);
    }

    // =========================
    // GET APPOINTMENTS BY DATE
    // =========================
    @Operation(
            summary = "Get Appointments By Date",
            description = "Retrieve appointments by date"
    )
    @GetMapping("/date/{date}")
    public List<AppointmentResponseDTO> getByDate(
            @PathVariable String date
    ) {
        return appointmentService.getAppointmentsByDate(date);
    }
}