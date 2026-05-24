package com.diplomski.doctor_appointment_system.controller;

import com.diplomski.doctor_appointment_system.model.Patient;
import com.diplomski.doctor_appointment_system.dto.PatientRequest;
import com.diplomski.doctor_appointment_system.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService service;

    public PatientController(PatientService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<Patient> create(
            @Valid @RequestBody PatientRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Patient>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String id
    ) {
        return ResponseEntity.ok(service.search(q, id));
    }

    // =========================
    // FIXED PUT
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable String id,
                                           @RequestBody Patient request) {

        Patient updated = service.update(id, request);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable String id) {

        service.delete(id);

        return ResponseEntity.ok("Patient deleted successfully");
    }
}