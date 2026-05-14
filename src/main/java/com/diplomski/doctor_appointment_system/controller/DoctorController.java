package com.diplomski.doctor_appointment_system.controller;

import com.diplomski.doctor_appointment_system.model.Doctor;
import com.diplomski.doctor_appointment_system.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService service;

    public DoctorController(DoctorService service) {
        this.service = service;
    }

    // =========================
    // CREATE DOCTOR
    // =========================
    @PostMapping
    public ResponseEntity<Doctor> create(@Valid @RequestBody Doctor doctor) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createDoctor(doctor));
    }

    // =========================
    // GET ALL DOCTORS
    // =========================
    @GetMapping
    public ResponseEntity<List<Doctor>> getAll() {
        return ResponseEntity.ok(service.getAllDoctors());
    }

    // =========================
    // GET BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getDoctorById(id));
    }

    // =========================
    // UPDATE DOCTOR
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<Doctor> update(@PathVariable String id,
                                         @Valid @RequestBody Doctor doctor) {
        return ResponseEntity.ok(service.updateDoctor(id, doctor));
    }

    // =========================
    // DELETE DOCTOR
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    // =========================
    // FILTER BY SPECIALIZATION
    // =========================
    @GetMapping("/specialization/{spec}")
    public ResponseEntity<List<Doctor>> bySpecialization(@PathVariable String spec) {
        return ResponseEntity.ok(service.getBySpecialization(spec));
    }

    // =========================
    // SEARCH DOCTORS
    // =========================
    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> search(@RequestParam String q) {
        return ResponseEntity.ok(service.searchDoctors(q));
    }
}