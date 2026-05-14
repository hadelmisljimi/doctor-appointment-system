package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.exception.DoctorNotFoundException;
import com.diplomski.doctor_appointment_system.model.Doctor;
import com.diplomski.doctor_appointment_system.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository repo;

    public DoctorService(DoctorRepository repo) {
        this.repo = repo;
    }

    public Doctor createDoctor(Doctor d) {
        return repo.save(d);
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

    public Doctor updateDoctor(String id, Doctor d) {

        Doctor existing = getDoctorById(id);

        existing.setName(d.getName());
        existing.setSpecialization(d.getSpecialization());
        existing.setEmail(d.getEmail());
        existing.setPhone(d.getPhone());
        existing.setAddress(d.getAddress());
        existing.setClinicName(d.getClinicName());
        existing.setDescription(d.getDescription());

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