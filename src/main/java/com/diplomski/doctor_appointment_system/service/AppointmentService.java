package com.diplomski.doctor_appointment_system.service;

import com.diplomski.doctor_appointment_system.dto.*;
import com.diplomski.doctor_appointment_system.model.*;
import com.diplomski.doctor_appointment_system.repository.*;
import org.springframework.stereotype.Service;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public AppointmentService(AppointmentRepository repository,
                              DoctorRepository doctorRepository,
                              PatientRepository patientRepository) {
        this.repository = repository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    // ================= WORKING HOURS VALIDATION =================
    private void validateClinicHours(String time) {

        LocalTime start = LocalTime.of(8, 0);
        LocalTime end = LocalTime.of(21, 0);

        LocalTime appointmentTime = LocalTime.parse(time);

        if (appointmentTime.isBefore(start) || appointmentTime.isAfter(end)) {
            throw new RuntimeException(
                    "The clinic is closed. It opens at 08:00 AM and closes at 22:00 PM."
            );
        }
    }

    // ================= DATE VALIDATION =================
    private void validateDate(String date) {

        // STRICT FORMAT: DD.MM.YYYY.
        if (date == null || !date.matches("\\d{2}\\.\\d{2}\\.\\d{4}\\."))
            throw new RuntimeException(
                    "Invalid date format. Use DD.MM.YYYY (example: 04.06.2026.). Day and month must be two digits."
            );

        String[] parts = date.split("\\.");

        int day = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);
        int year = Integer.parseInt(parts[2]);

        if (day < 1 || day > 31) {
            throw new RuntimeException("Day must be between 01 and 31.");
        }
        if (month < 1 || month > 12) {
            throw new RuntimeException("Month must be between 01 and 12.");
        }

        if (year < 2026) {
            throw new RuntimeException("Year must be 2026 or later.");
        }
    }

    private void validateWeekend(String date) {

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd.MM.yyyy.");

        LocalDate parsedDate =
                LocalDate.parse(date, formatter);

        DayOfWeek day = parsedDate.getDayOfWeek();

        if (day == DayOfWeek.SATURDAY
                || day == DayOfWeek.SUNDAY) {

            throw new RuntimeException(
                    "Appointments cannot be booked on weekends."
            );
        }
    }

    private void validate30MinuteSlot(String time) {

        LocalTime parsed = LocalTime.parse(time);

        int minutes = parsed.getMinute();

        if (minutes != 0 && minutes != 30) {
            throw new RuntimeException(
                    "Appointments must be scheduled every 30 minutes."
            );
        }
    }
    private void validateFutureDate(String date) {

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd.MM.yyyy.");

        LocalDate appointmentDate =
                LocalDate.parse(date, formatter);

        LocalDate today = LocalDate.now();

        if (appointmentDate.isBefore(today)) {

            throw new RuntimeException(
                    "Appointments can only be booked for future dates."
            );
        }
    }

    private void validateFutureDateTime(String date, String time) {

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd.MM.yyyy. HH:mm");

        LocalDateTime appointmentDateTime =
                LocalDateTime.parse(date + " " + time, formatter);

        LocalDateTime now = LocalDateTime.now();

        if (appointmentDateTime.isBefore(now)) {

            throw new RuntimeException(
                    "Cannot book appointments in the past."
            );
        }
    }

    // ================= MAP =================
    private AppointmentResponseDTO map(Appointment a) {

        Doctor doctor = doctorRepository.findById(a.getDoctorId()).orElse(null);
        Patient patient = patientRepository.findById(a.getPatientId()).orElse(null);

        AppointmentResponseDTO dto = new AppointmentResponseDTO();

        dto.setId(a.getId());

        dto.setDoctorId(a.getDoctorId());

        // 🔥 DOCTOR DELETED
        if (doctor != null) {
            dto.setDoctorName(doctor.getName());
        } else {
            dto.setDoctorName("Deleted Doctor");
            a.setStatus(AppointmentStatus.CANCELLED);
        }

        dto.setPatientId(a.getPatientId());

        // 🔥 PATIENT DELETED
        if (patient != null) {
            dto.setPatientName(patient.getName());
        } else {
            dto.setPatientName("Deleted Patient");
            a.setStatus(AppointmentStatus.CANCELLED);
        }

        dto.setDate(a.getDate());
        dto.setTime(a.getTime());
        dto.setStatus(a.getStatus().name());

        // 🔥 SAVE AUTO CANCEL
        repository.save(a);

        return dto;
    }

    // ================= RESOLVE DOCTOR =================
    private String resolveDoctor(String input) {

        if (input == null || input.isBlank()) return null;

        return doctorRepository.findById(input)
                .map(Doctor::getId)
                .orElseGet(() ->
                        doctorRepository.findAll().stream()
                                .filter(d -> d.getName().equalsIgnoreCase(input))
                                .findFirst()
                                .map(Doctor::getId)
                                .orElse(null)
                );
    }

    // ================= RESOLVE PATIENT =================
    private String resolvePatient(String input) {

        if (input == null || input.isBlank()) return null;

        return patientRepository.findById(input)
                .map(Patient::getId)
                .orElseGet(() ->
                        patientRepository.findAll().stream()
                                .filter(p -> p.getName().equalsIgnoreCase(input))
                                .findFirst()
                                .map(Patient::getId)
                                .orElse(null)
                );
    }

    // ================= GET ALL =================
    public List<AppointmentResponseDTO> getAllAppointments() {
        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    // ================= BOOK =================
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto) {

        String doctorId = resolveDoctor(dto.getDoctorId());
        String patientId = resolvePatient(dto.getPatientId());

        if (doctorId == null) {
            throw new RuntimeException("Doctor not found: " + dto.getDoctorId());
        }

        if (patientId == null) {
            throw new RuntimeException("Patient not found: " + dto.getPatientId());
        }

        // 🔥 VALIDATIONS ADDED HERE
        validateClinicHours(dto.getTime());
        validateDate(dto.getDate());
        validateWeekend(dto.getDate());
        validate30MinuteSlot(dto.getTime());
        validateFutureDate(dto.getDate());
        validateFutureDateTime(dto.getDate(), dto.getTime());

        boolean alreadyBooked =
                repository.findAll().stream()
                        .anyMatch(a ->
                                a.getDoctorId().equals(doctorId)
                                        &&
                                        a.getDate().equals(dto.getDate())
                                        &&
                                        a.getTime().equals(dto.getTime())
                                        &&
                                        a.getStatus() == AppointmentStatus.BOOKED
                        );

        if (alreadyBooked) {
            throw new RuntimeException(
                    "This appointment slot is already booked."
            );
        }

        Appointment a = new Appointment();

        a.setId(UUID.randomUUID().toString());
        a.setDoctorId(doctorId);
        a.setPatientId(patientId);
        a.setDate(dto.getDate());
        a.setTime(dto.getTime());
        a.setStatus(AppointmentStatus.BOOKED);

        return map(repository.save(a));
    }

    // ================= SEARCH =================
    public List<AppointmentResponseDTO> search(String doctor, String patient, String date, String id) {

        if (id != null && !id.isBlank()) {
            return repository.findById(id)
                    .stream()
                    .map(this::map)
                    .toList();
        }

        String doctorId = resolveDoctor(doctor);
        String patientId = resolvePatient(patient);

        return repository.findAll().stream()
                .filter(a -> doctorId == null || a.getDoctorId().equals(doctorId))
                .filter(a -> patientId == null || a.getPatientId().equals(patientId))
                .filter(a -> date == null || a.getDate().equals(date))
                .map(this::map)
                .toList();
    }

    // ================= CANCEL =================
    public AppointmentResponseDTO cancelAppointment(String id) {

        Appointment a = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        a.setStatus(AppointmentStatus.CANCELLED);
        return map(repository.save(a));
    }

    // ================= COMPLETE =================
    public AppointmentResponseDTO completeAppointment(String id) {

        Appointment a = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        a.setStatus(AppointmentStatus.COMPLETED);
        return map(repository.save(a));
    }

    // ================= DELETE =================
    public void deleteAppointment(String id) {

        Appointment a = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        repository.delete(a);
    }




}