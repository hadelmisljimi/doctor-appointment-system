package com.diplomski.doctor_appointment_system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AppointmentRequestDTO {

    @NotBlank(message = "doctorId is required")
    private String doctorId;

    @NotBlank(message = "patientId is required")
    private String patientId;

    @NotBlank(message = "Date is required")
    @Pattern(
            regexp = "^\\d{2}\\.\\d{2}\\.\\d{4}\\.$",
            message = "Invalid date format. Required: dd.MM.yyyy. Example: 15.05.2026."
    )
    private String date;

    @NotBlank(message = "Time is required")
    @Pattern(
            regexp = "^([01]\\d|2[0-3]):[0-5]\\d$",
            message = "Invalid time format. Required: HH:mm. Example: 17:00"
    )
    private String time;

    // ---------- GETTERS / SETTERS ----------

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
}