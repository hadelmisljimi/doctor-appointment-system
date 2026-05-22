package com.diplomski.doctor_appointment_system.controller;

import com.diplomski.doctor_appointment_system.dto.AppointmentRequestDTO;
import com.diplomski.doctor_appointment_system.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:3000")
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


    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAllAppointments());
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam(required = false) String doctor,
            @RequestParam(required = false) String patient,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String id
    ) {
        return ResponseEntity.ok(service.search(doctor, patient, date, id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable String id) {
        return ResponseEntity.ok(service.cancelAppointment(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable String id) {
        return ResponseEntity.ok(service.completeAppointment(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        service.deleteAppointment(id);
        return ResponseEntity.ok("Appointment deleted successfully");
    }

}