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

    @GetMapping
    public ResponseEntity<List<AppointmentResponseDTO>> getAll() {
        return ResponseEntity.ok(service.getAllAppointments());
    }

    @PostMapping
    public ResponseEntity<AppointmentResponseDTO> book(
            @Valid @RequestBody AppointmentRequestDTO dto) {
        return ResponseEntity.ok(service.book(dto));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponseDTO> cancel(@PathVariable String id) {
        return ResponseEntity.ok(service.cancel(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<AppointmentResponseDTO> complete(@PathVariable String id) {
        return ResponseEntity.ok(service.complete(id));
    }

    @GetMapping("/doctor/{id}")
    public ResponseEntity<List<AppointmentResponseDTO>> byDoctor(@PathVariable String id) {
        return ResponseEntity.ok(service.byDoctor(id));
    }

    @GetMapping("/patient/{id}")
    public ResponseEntity<List<AppointmentResponseDTO>> byPatient(@PathVariable String id) {
        return ResponseEntity.ok(service.byPatient(id));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<AppointmentResponseDTO>> byDate(@PathVariable String date) {
        return ResponseEntity.ok(service.byDate(date));
    }
}