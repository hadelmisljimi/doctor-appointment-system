package com.diplomski.doctor_appointment_system.controller;

import com.diplomski.doctor_appointment_system.model.Patient;
import com.diplomski.doctor_appointment_system.repository.PatientRepository;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
@Tag(name = "Patients", description = "Patient management APIs")
@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepository;

    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @PostMapping
    public Patient addPatient(@RequestBody Patient patient) {
        return patientRepository.save(patient);
    }
}