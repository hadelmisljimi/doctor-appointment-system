package com.diplomski.doctor_appointment_system.controller;

import com.diplomski.doctor_appointment_system.model.Doctor;
import com.diplomski.doctor_appointment_system.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(
        name = "Doctors",
        description = "Doctor management APIs"
)
@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // =========================
    // ADD NEW DOCTOR
    // =========================
    @Operation(
            summary = "Add New Doctor",
            description = "Create and save a new doctor"
    )
    @PostMapping
    public Doctor addDoctor(@Valid @RequestBody Doctor doctor) {
        return doctorService.addDoctor(doctor);
    }

    // =========================
    // GET ALL DOCTORS
    // =========================
    @Operation(
            summary = "Get All Doctors",
            description = "Retrieve all doctors from database"
    )
    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    // =========================
    // DELETE DOCTOR
    // =========================
    @Operation(
            summary = "Delete Doctor",
            description = "Delete doctor by ID"
    )
    @DeleteMapping("/{id}")
    public void deleteDoctor(@PathVariable String id) {
        doctorService.deleteDoctor(id);
    }

    // =========================
    // UPDATE DOCTOR
    // =========================
    @Operation(
            summary = "Update Doctor",
            description = "Update existing doctor information"
    )
    @PutMapping("/{id}")
    public Doctor updateDoctor(@PathVariable String id,
                               @Valid @RequestBody Doctor doctor) {

        return doctorService.updateDoctor(id, doctor);
    }

    // =========================
    // GET DOCTORS BY SPECIALIZATION
    // =========================
    @Operation(
            summary = "Get Doctors By Specialization",
            description = "Retrieve doctors filtered by specialization"
    )
    @GetMapping("/specialization/{specialization}")
    public List<Doctor> getBySpecialization(
            @PathVariable String specialization
    ) {
        return doctorService.getDoctorsBySpecialization(specialization);
    }
}