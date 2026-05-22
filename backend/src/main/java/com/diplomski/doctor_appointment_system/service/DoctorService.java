package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.dto.DoctorRequest;
import com.diplomski.doctor_appointment_system.exception.DoctorNotFoundException;
import com.diplomski.doctor_appointment_system.model.Doctor;
import com.diplomski.doctor_appointment_system.repository.DoctorRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DoctorService {

    private final DoctorRepository repo;

    public DoctorService(DoctorRepository repo) {
        this.repo = repo;
    }

    // =========================
    // CREATE
    // =========================
    public Doctor createDoctor(@Valid DoctorRequest request) {

        Doctor doctor = new Doctor();

        doctor.setId(UUID.randomUUID().toString());
        doctor.setName(request.getName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setEmail(request.getEmail());
        doctor.setPhone(request.getPhone());
        doctor.setAddress(request.getAddress());
        doctor.setClinicName(request.getClinicName());
        doctor.setDescription(request.getDescription());

        return repo.save(doctor);
    }

    // =========================
    // READ ALL
    // =========================
    public List<Doctor> getAllDoctors() {
        return repo.findAll();
    }

    // =========================
    // READ BY ID
    // =========================
    public Doctor getDoctorById(String id) {
        return repo.findById(id)
                .orElseThrow(() ->
                        new DoctorNotFoundException("Doctor not found: " + id));
    }

    // =========================
    // DELETE
    // =========================
    public void deleteDoctor(String id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Doctor not found: " + id);
        }
        repo.delete(getDoctorById(id));
    }

    // =========================
    // UPDATE
    // =========================
    public Doctor updateDoctor(String id, DoctorRequest request) {

        Doctor existing = getDoctorById(id);

        existing.setName(request.getName());
        existing.setSpecialization(request.getSpecialization());
        existing.setEmail(request.getEmail());
        existing.setPhone(request.getPhone());
        existing.setAddress(request.getAddress());
        existing.setClinicName(request.getClinicName());
        existing.setDescription(request.getDescription());

        return repo.save(existing);
    }

    // =========================
    // SPECIALIZATION FILTER
    // =========================
    public List<Doctor> getBySpecialization(String spec) {
        return repo.findBySpecializationIgnoreCase(spec);
    }

    // =========================
    // SEARCH (TEXT + ID SMART)
    // =========================
    public List<Doctor> search(String q, String id) {

        // 1. ID ima prioritet
        if (id != null && !id.isBlank()) {
            return List.of(getDoctorById(id));
        }

        // 2. ako q izgleda kao UUID → tretiraj kao ID
        if (q != null && isUUID(q)) {
            return List.of(getDoctorById(q));
        }

        // 3. text search
        if (q != null && !q.isBlank()) {
            return repo.searchDoctors(q);
        }

        return List.of();
    }

    // =========================
    // HELPER
    // =========================
    private boolean isUUID(String value) {
        try {
            UUID.fromString(value);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}