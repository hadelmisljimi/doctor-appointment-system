package com.diplomski.doctor_appointment_system.controller;

import com.diplomski.doctor_appointment_system.dto.AppointmentRequestDTO;
import com.diplomski.doctor_appointment_system.dto.AppointmentResponseDTO;
import com.diplomski.doctor_appointment_system.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    // =========================
    // GET ALL
    // =========================
    @GetMapping
    public ResponseEntity<List<AppointmentResponseDTO>> getAll() {
        return ResponseEntity.ok(service.getAllAppointments());
    }

    // =========================
    // BOOK
    // =========================
    @PostMapping
    public ResponseEntity<AppointmentResponseDTO> book(
            @Valid @RequestBody AppointmentRequestDTO dto) {

        return ResponseEntity.ok(service.bookAppointment(dto));
    }

    // =========================
    // CANCEL
    // =========================
    @PutMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponseDTO> cancel(@PathVariable String id) {
        return ResponseEntity.ok(service.cancelAppointment(id));
    }

    // =========================
    // COMPLETE
    // =========================
    @PutMapping("/{id}/complete")
    public ResponseEntity<AppointmentResponseDTO> complete(@PathVariable String id) {
        return ResponseEntity.ok(service.completeAppointment(id));
    }

    // =========================
    // BY DOCTOR
    // =========================
    @GetMapping("/doctor/{id}")
    public ResponseEntity<List<AppointmentResponseDTO>> byDoctor(@PathVariable String id) {
        return ResponseEntity.ok(service.getByDoctor(id));
    }

    // =========================
    // BY PATIENT
    // =========================
    @GetMapping("/patient/{id}")
    public ResponseEntity<List<AppointmentResponseDTO>> byPatient(@PathVariable String id) {
        return ResponseEntity.ok(service.getByPatient(id));
    }

    // =========================
    // BY DATE
    // =========================
    @GetMapping("/date/{date}")
    public ResponseEntity<List<AppointmentResponseDTO>> byDate(@PathVariable String date) {
        return ResponseEntity.ok(service.getByDate(date));
    }
}