package com.diplomski.doctor_appointment_system.dto;

public class AppointmentResponseDTO {

    private String id;

    private String doctorId;
    private String doctorName;

    private String patientId;
    private String patientName;

    private String date;
    private String time;

    private String status;

    public AppointmentResponseDTO() {}

    public AppointmentResponseDTO(String id,
                                  String doctorId,
                                  String doctorName,
                                  String patientId,
                                  String patientName,
                                  String date,
                                  String time,
                                  String status) {

        this.id = id;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.patientId = patientId;
        this.patientName = patientName;
        this.date = date;
        this.time = time;
        this.status = status;
    }

    // ================= GETTERS / SETTERS =================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}