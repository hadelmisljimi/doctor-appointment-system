package com.diplomski.doctor_appointment_system.controller;

import com.diplomski.doctor_appointment_system.dto.AppointmentRequestDTO;
import com.diplomski.doctor_appointment_system.dto.AppointmentResponseDTO;
import com.diplomski.doctor_appointment_system.service.AppointmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.tags.Tag;
@Tag(name = "Appointments", description = "Appointment management APIs")
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // -------------------------
    // GET ALL APPOINTMENTS
    // -------------------------
    @GetMapping
    public List<AppointmentResponseDTO> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    // -------------------------
    // BOOK APPOINTMENT
    // -------------------------
    @PostMapping
    public AppointmentResponseDTO book(@Valid @RequestBody AppointmentRequestDTO dto) {
        return appointmentService.bookAppointment(dto);
    }

    // -------------------------
    // CANCEL APPOINTMENT
    // -------------------------
    @PutMapping("/cancel/{id}")
    public AppointmentResponseDTO cancelAppointment(@PathVariable String id) {
        return appointmentService.cancelAppointment(id);
    }

    // -------------------------
    // GET BY DOCTOR
    // -------------------------
    @GetMapping("/doctor/{doctorId}")
    public List<AppointmentResponseDTO> getByDoctor(@PathVariable String doctorId) {
        return appointmentService.getAppointmentsByDoctor(doctorId);
    }

    @PutMapping("/{id}/complete")
    public AppointmentResponseDTO complete(@PathVariable String id) {
        return appointmentService.completeAppointment(id);
    }
    @GetMapping("/patient/{patientId}")
    public List<AppointmentResponseDTO> getByPatient(@PathVariable String patientId) {
        return appointmentService.getAppointmentsByPatient(patientId);
    }
    @GetMapping("/date/{date}")
    public List<AppointmentResponseDTO> getByDate(@PathVariable String date) {
        return appointmentService.getAppointmentsByDate(date);
    }


}