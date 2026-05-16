package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.model.Patient;
import com.diplomski.doctor_appointment_system.dto.PatientRequest;
import com.diplomski.doctor_appointment_system.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PatientService {

    private final PatientRepository repo;

    public PatientService(PatientRepository repo) {
        this.repo = repo;
    }

    public List<Patient> getAll() {
        return repo.findAll();
    }

    // ✔ AUTO ID + DTO
    public Patient create(PatientRequest request) {

        Patient patient = new Patient();

        patient.setId(UUID.randomUUID().toString()); // 🔥 AUTO ID
        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setPhone(request.getPhone());

        return repo.save(patient);
    }

    public List<Patient> search(String keyword) {

        if (keyword == null || keyword.isBlank()) {
            return getAll();
        }

        return repo.searchPatients(keyword);
    }
}