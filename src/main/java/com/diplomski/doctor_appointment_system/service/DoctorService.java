package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.model.Doctor;
import com.diplomski.doctor_appointment_system.repository.DoctorRepository;
import com.diplomski.doctor_appointment_system.exception.DoctorNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // ⭐ DODATO: sigurnije brisanje (pro nivo)
    public void deleteDoctor(String id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new DoctorNotFoundException("Doctor not found with id: " + id));

        doctorRepository.delete(doctor);
    }

    public Doctor updateDoctor(String id, Doctor updatedDoctor) {

        Doctor existingDoctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));

        existingDoctor.setName(updatedDoctor.getName());
        existingDoctor.setSpecialization(updatedDoctor.getSpecialization());
        existingDoctor.setEmail(updatedDoctor.getEmail());
        existingDoctor.setPhone(updatedDoctor.getPhone());
        existingDoctor.setAddress(updatedDoctor.getAddress());
        existingDoctor.setClinicName(updatedDoctor.getClinicName());
        existingDoctor.setDescription(updatedDoctor.getDescription());

        return doctorRepository.save(existingDoctor);
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationIgnoreCase(specialization);
    }
}