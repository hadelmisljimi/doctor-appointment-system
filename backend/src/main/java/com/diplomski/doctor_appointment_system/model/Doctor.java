package com.diplomski.doctor_appointment_system.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "doctors")
public class Doctor {

    @Id
    private String id;

    @NotBlank
    private String name;

    @NotBlank
    private String specialization;

    @Email
    @NotBlank
    private String email;

    private String phone;
    private String address;
    private String clinicName;
    private String description;

    public Doctor() {}

    public Doctor(String id,
                  String name,
                  String specialization,
                  String email,
                  String phone,
                  String address,
                  String clinicName,
                  String description) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.clinicName = clinicName;
        this.description = description;
    }

    // GETTERS & SETTERS
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getClinicName() { return clinicName; }
    public void setClinicName(String clinicName) { this.clinicName = clinicName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}