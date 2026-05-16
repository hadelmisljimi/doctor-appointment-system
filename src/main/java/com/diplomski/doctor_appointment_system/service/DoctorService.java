package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.dto.DoctorRequest;
import com.diplomski.doctor_appointment_system.exception.DoctorNotFoundException;
import com.diplomski.doctor_appointment_system.model.Doctor;
import com.diplomski.doctor_appointment_system.repository.DoctorRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository repo;

    public DoctorService(DoctorRepository repo) {
        this.repo = repo;
    }

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

    public List<Doctor> getAllDoctors() {
        return repo.findAll();
    }

    public Doctor getDoctorById(String id) {
        return repo.findById(id)
                .orElseThrow(() ->
                        new DoctorNotFoundException("Doctor not found: " + id));
    }

    public void deleteDoctor(String id) {
        repo.delete(getDoctorById(id));
    }


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

    public List<Doctor> searchDoctors(String keyword) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllDoctors();
        }

        return repo.searchDoctors(keyword);
    }

    public List<Doctor> getBySpecialization(String spec) {
        return repo.findBySpecializationIgnoreCase(spec);
    }
}