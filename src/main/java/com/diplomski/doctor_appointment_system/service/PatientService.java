package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.model.Patient;
import com.diplomski.doctor_appointment_system.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository repo;

    public PatientService(PatientRepository repo) {
        this.repo = repo;
    }

    // =========================
    // GET ALL
    // =========================
    public List<Patient> getAll() {
        return repo.findAll();
    }

    // =========================
    // CREATE
    // =========================
    public Patient create(Patient patient) {
        return repo.save(patient);
    }

    // =========================
    // SEARCH
    // =========================
    public List<Patient> search(String keyword) {

        if (keyword == null || keyword.isBlank()) {
            return getAll();
        }

        return repo.searchPatients(keyword);
    }
}