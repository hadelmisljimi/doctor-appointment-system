package com.diplomski.doctor_appointment_system.controller;

import com.diplomski.doctor_appointment_system.dto.*;
import com.diplomski.doctor_appointment_system.service.AppointmentService;
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

    @PostMapping
    public ResponseEntity<?> book(@RequestBody AppointmentRequestDTO dto) {
        return ResponseEntity.ok(service.bookAppointment(dto));
    }

    @GetMapping("/search")
    public ResponseEntity<List<?>> search(
            @RequestParam(required = false) String doctor,
            @RequestParam(required = false) String patient,
            @RequestParam(required = false) String date
    ) {
        return ResponseEntity.ok(service.search(doctor, patient, date));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable String id) {
        return ResponseEntity.ok(service.cancelAppointment(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable String id) {
        return ResponseEntity.ok(service.completeAppointment(id));
    }
}