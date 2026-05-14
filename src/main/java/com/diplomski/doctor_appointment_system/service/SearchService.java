package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.dto.SearchResponseDTO;
import com.diplomski.doctor_appointment_system.repository.DoctorRepository;
import com.diplomski.doctor_appointment_system.repository.PatientRepository;
import org.springframework.stereotype.Service;

@Service
public class SearchService {

    private final DoctorRepository doctorRepo;
    private final PatientRepository patientRepo;

    public SearchService(DoctorRepository doctorRepo,
                         PatientRepository patientRepo) {
        this.doctorRepo = doctorRepo;
        this.patientRepo = patientRepo;
    }

    public SearchResponseDTO search(String q) {

        return new SearchResponseDTO(
                doctorRepo.search(q),
                patientRepo.search(q)
        );
    }
}