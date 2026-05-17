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

    public Patient create(PatientRequest request) {

        Patient patient = new Patient();

        patient.setId(UUID.randomUUID().toString());
        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setPhone(request.getPhone());

        return repo.save(patient);
    }

    // =========================
    // SEARCH FIXED
    // =========================
    public List<Patient> search(String keyword, String id) {

        // ID ima prioritet
        if (id != null && !id.isBlank()) {
            return repo.findById(id)
                    .stream()
                    .toList();
        }

        // ako keyword izgleda kao UUID
        if (keyword != null && isUUID(keyword)) {
            return repo.findById(keyword)
                    .stream()
                    .toList();
        }

        if (keyword != null && !keyword.isBlank()) {
            return repo.searchPatients(keyword);
        }

        return getAll();
    }

    private boolean isUUID(String value) {
        try {
            UUID.fromString(value);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void delete(String id) {

        if (!repo.existsById(id)) {
            throw new RuntimeException("Patient not found: " + id);
        }

        repo.deleteById(id);
    }
}