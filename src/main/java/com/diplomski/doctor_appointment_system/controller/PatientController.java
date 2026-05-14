package com.diplomski.doctor_appointment_system.controller;

import com.diplomski.doctor_appointment_system.model.Patient;
import com.diplomski.doctor_appointment_system.repository.PatientRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(
        name = "Patients",
        description = "Patient management APIs"
)
@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepository;

    public PatientController(
            PatientRepository patientRepository
    ) {
        this.patientRepository = patientRepository;
    }

    // =========================
    // GET ALL PATIENTS
    // =========================
    @Operation(
            summary = "Get All Patients",
            description = "Retrieve all patients"
    )
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // =========================
    // ADD NEW PATIENT
    // =========================
    @Operation(
            summary = "Add New Patient",
            description = "Create and save new patient"
    )
    @PostMapping
    public Patient addPatient(@RequestBody Patient patient) {
        return patientRepository.save(patient);
    }
}