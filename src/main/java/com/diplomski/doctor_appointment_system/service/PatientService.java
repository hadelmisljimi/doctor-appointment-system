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
    // SEARCH FIXED (STRICT BEHAVIOUR)
    // =========================
    public List<Patient> search(String keyword, String id) {

        if (id != null && !id.isBlank()) {
            return repo.findById(id)
                    .stream()
                    .toList();
        }

        if (keyword != null && isUUID(keyword)) {
            return repo.findById(keyword)
                    .stream()
                    .toList();
        }

        if (keyword != null && !keyword.isBlank()) {

            List<Patient> result = repo.searchPatients(keyword);

            if (result.isEmpty()) {
                throw new RuntimeException("No patient found with: " + keyword);
            }

            return result;
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

    // =========================
    // DELETE
    // =========================
    public void delete(String id) {

        if (!repo.existsById(id)) {
            throw new RuntimeException("Patient not found: " + id);
        }

        repo.deleteById(id);
    }

    // =========================
    // UPDATE (FIXED - MONGODB SAFE)
    // =========================
    public Patient update(String id, Patient request) {

        Patient patient = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found: " + id));

        if (request.getName() != null && !request.getName().isBlank()) {
            patient.setName(request.getName());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            patient.setEmail(request.getEmail());
        }

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            patient.setPhone(request.getPhone());
        }

        return repo.save(patient);
    }
}