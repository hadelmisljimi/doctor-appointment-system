package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.dto.SearchResponseDTO;
import com.diplomski.doctor_appointment_system.model.Doctor;
import com.diplomski.doctor_appointment_system.model.Patient;
import com.diplomski.doctor_appointment_system.repository.DoctorRepository;
import com.diplomski.doctor_appointment_system.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public SearchService(DoctorRepository doctorRepository,
                         PatientRepository patientRepository) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    public SearchResponseDTO search(String query) {

        // TRY DOCTOR SEARCH
        List<Doctor> doctorsByName =
                doctorRepository.findByNameContainingIgnoreCase(query);

        List<Doctor> doctorsById =
                doctorRepository.findAll()
                        .stream()
                        .filter(d -> d.getId() != null && d.getId().equals(query))
                        .toList();

        // TRY PATIENT SEARCH
        List<Patient> patientsByName =
                patientRepository.findByNameContainingIgnoreCase(query);

        List<Patient> patientsById =
                patientRepository.findAll()
                        .stream()
                        .filter(p -> p.getId() != null && p.getId().equals(query))
                        .toList();

        // MERGE RESULTS
        List<Doctor> doctors =
                doctorsByName.stream()
                        .distinct()
                        .collect(Collectors.toList());

        doctors.addAll(doctorsById);

        List<Patient> patients =
                patientsByName.stream()
                        .distinct()
                        .collect(Collectors.toList());

        patients.addAll(patientsById);

        return new SearchResponseDTO(doctors, patients);
    }
}
