package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.dto.SearchResponseDTO;
import com.diplomski.doctor_appointment_system.repository.DoctorRepository;
import com.diplomski.doctor_appointment_system.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GlobalSearchService {

    private final DoctorRepository doctorRepo;
    private final PatientRepository patientRepo;

    public GlobalSearchService(DoctorRepository doctorRepo,
                               PatientRepository patientRepo) {
        this.doctorRepo = doctorRepo;
        this.patientRepo = patientRepo;
    }

    public SearchResponseDTO search(String q, String id) {

        // =========================
        // 1. ID SEARCH (NAJJAČI PRIORITET)
        // =========================
        if (id != null && !id.isBlank()) {

            return new SearchResponseDTO(
                    doctorRepo.findById(id).stream().toList(),
                    patientRepo.findById(id).stream().toList()
            );
        }

        // =========================
        // 2. q JE UUID → tretiraj kao ID
        // =========================
        if (q != null && isUUID(q)) {

            return new SearchResponseDTO(
                    doctorRepo.findById(q).stream().toList(),
                    patientRepo.findById(q).stream().toList()
            );
        }

        // =========================
        // 3. TEXT SEARCH
        // =========================
        if (q != null && !q.isBlank()) {

            return new SearchResponseDTO(
                    doctorRepo.searchDoctors(q),
                    patientRepo.searchPatients(q)
            );
        }

        // =========================
        // 4. EMPTY → sve
        // =========================
        return new SearchResponseDTO(
                doctorRepo.findAll(),
                patientRepo.findAll()
        );
    }

    private boolean isUUID(String value) {
        try {
            UUID.fromString(value);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}