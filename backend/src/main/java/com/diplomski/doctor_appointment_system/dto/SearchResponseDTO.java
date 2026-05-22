package com.diplomski.doctor_appointment_system.dto;

import com.diplomski.doctor_appointment_system.model.Doctor;
import com.diplomski.doctor_appointment_system.model.Patient;

import java.util.List;

public class SearchResponseDTO {

    private List<Doctor> doctors;
    private List<Patient> patients;

    public SearchResponseDTO() {}

    public SearchResponseDTO(List<Doctor> doctors, List<Patient> patients) {
        this.doctors = doctors;
        this.patients = patients;
    }

    public List<Doctor> getDoctors() { return doctors; }
    public void setDoctors(List<Doctor> doctors) { this.doctors = doctors; }

    public List<Patient> getPatients() { return patients; }
    public void setPatients(List<Patient> patients) { this.patients = patients; }
}