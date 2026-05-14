package com.diplomski.doctor_appointment_system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AppointmentRequestDTO {

    @NotBlank(message = "Doctor ID is required")
    private String doctorId;

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Date is required")
    @Size(min = 10, max = 10, message = "Date must be in format YYYY-MM-DD")
    private String date;

    @NotBlank(message = "Time is required")
    @Size(min = 5, max = 5, message = "Time must be in format HH:mm")
    private String time;

    public AppointmentRequestDTO() {}

    public AppointmentRequestDTO(String doctorId, String patientId, String date, String time) {
        this.doctorId = doctorId;
        this.patientId = patientId;
        this.date = date;
        this.time = time;
    }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
}