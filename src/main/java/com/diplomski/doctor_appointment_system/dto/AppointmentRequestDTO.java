package com.diplomski.doctor_appointment_system.dto;

import jakarta.validation.constraints.NotBlank;

public class AppointmentRequestDTO {

    @NotBlank
    private String doctorId;
    private String doctorName;

    @NotBlank
    private String patientId;
    private String patientName;

    @NotBlank
    private String date; // ISO format: yyyy-MM-dd

    @NotBlank
    private String time; // HH:mm

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
}