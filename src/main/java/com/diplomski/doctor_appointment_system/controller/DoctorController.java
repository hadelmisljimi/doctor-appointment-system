package com.diplomski.doctor_appointment_system.controller;

import com.diplomski.doctor_appointment_system.dto.DoctorRequest;
import com.diplomski.doctor_appointment_system.model.Doctor;
import com.diplomski.doctor_appointment_system.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    // CREATE DOCTOR (ADMIN ONLY)
    // =========================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Doctor> create(@Valid @RequestBody DoctorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createDoctor(request));
    }

    // =========================
    // GET ALL DOCTORS (PUBLIC)
    // =========================
    @GetMapping
    public ResponseEntity<List<Doctor>> getAll() {
        return ResponseEntity.ok(service.getAllDoctors());
    }

    // =========================
    // GET BY ID (PUBLIC)
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getDoctorById(id));
    }

    // =========================
    // UPDATE DOCTOR (ADMIN ONLY)
    // =========================
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Doctor> update(@PathVariable String id,
                                         @Valid @RequestBody DoctorRequest request) {
        return ResponseEntity.ok(service.updateDoctor(id, request));
    }

    // =========================
    // DELETE DOCTOR (ADMIN ONLY)
    // =========================
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    // =========================
    // FILTER BY SPECIALIZATION (PUBLIC)
    // =========================
    @GetMapping("/specialization/{spec}")
    public ResponseEntity<List<Doctor>> bySpecialization(@PathVariable String spec) {
        return ResponseEntity.ok(service.getBySpecialization(spec));
    }

    // =========================
    // SEARCH DOCTORS (PUBLIC)
    // =========================
    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> search(@RequestParam String q) {
        return ResponseEntity.ok(service.searchDoctors(q));
    }
}