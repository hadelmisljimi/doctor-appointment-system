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

    public List<Patient> getAll() {
        return repo.findAll();
    }

    public Patient create(Patient p) {
        return repo.save(p);
    }

    public List<Patient> search(String keyword) {

        if (keyword == null || keyword.isBlank()) {
            return getAll();
        }

        return repo.search(keyword);
    }
}