package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.dto.SearchResponseDTO;
import com.diplomski.doctor_appointment_system.repository.DoctorRepository;
import com.diplomski.doctor_appointment_system.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SearchService {

    private final DoctorRepository doctorRepo;
    private final PatientRepository patientRepo;

    public SearchService(DoctorRepository doctorRepo,
                         PatientRepository patientRepo) {
        this.doctorRepo = doctorRepo;
        this.patientRepo = patientRepo;
    }

    public SearchResponseDTO search(String q, String id) {

        // =========================
        // 1. ID + Q (STRICT VALIDATION)
        // =========================
        if ((id != null && !id.isBlank()) && (q != null && !q.isBlank())) {

            var doctorById = doctorRepo.findById(id);
            var patientById = patientRepo.findById(id);

            var doctorsByName = doctorRepo.searchDoctors(q);
            var patientsByName = patientRepo.searchPatients(q);

            if (doctorById.isEmpty() && patientById.isEmpty()
                    && doctorsByName.isEmpty() && patientsByName.isEmpty()) {
                throw new RuntimeException(
                        "No doctor or patient found for given ID and name"
                );
            }

            return new SearchResponseDTO(doctorsByName, patientsByName);
        }

        // =========================
        // 2. ONLY ID
        // =========================
        if (id != null && !id.isBlank()) {

            if (isUUID(id)) {

                var doctor = doctorRepo.findById(id);
                var patient = patientRepo.findById(id);

                if (doctor.isEmpty() && patient.isEmpty()) {
                    throw new RuntimeException("No doctor or patient found with ID: " + id);
                }

                return new SearchResponseDTO(
                        doctor.stream().toList(),
                        patient.stream().toList()
                );
            }

            throw new RuntimeException("Invalid ID format");
        }

        // =========================
        // 3. ONLY Q
        // =========================
        if (q != null && !q.isBlank()) {

            if (isUUID(q)) {

                var doctor = doctorRepo.findById(q);
                var patient = patientRepo.findById(q);

                return new SearchResponseDTO(
                        doctor.stream().toList(),
                        patient.stream().toList()
                );
            }

            var doctors = doctorRepo.searchDoctors(q);
            var patients = patientRepo.searchPatients(q);

            if (doctors.isEmpty() && patients.isEmpty()) {
                throw new RuntimeException("No results found for: " + q);
            }

            return new SearchResponseDTO(doctors, patients);
        }

        // =========================
        // 4. EMPTY
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