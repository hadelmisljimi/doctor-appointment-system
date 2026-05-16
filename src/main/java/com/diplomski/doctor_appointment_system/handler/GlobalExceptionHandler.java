package com.diplomski.doctor_appointment_system.handler;

import com.diplomski.doctor_appointment_system.exception.ErrorResponse;
import com.diplomski.doctor_appointment_system.exception.DoctorNotFoundException;
import com.diplomski.doctor_appointment_system.exception.AppointmentNotFoundException;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // =========================
    // VALIDATION
    // =========================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex,
                                                          HttpServletRequest request) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return build(HttpStatus.BAD_REQUEST, message, request.getRequestURI());
    }

    // =========================
    // SECURITY ERROR (🔥 FIX OVDE)
    // =========================
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex,
                                                            HttpServletRequest request) {

        return build(
                HttpStatus.FORBIDDEN,
                "You do not have permission to perform this action",
                request.getRequestURI()
        );
    }

    // =========================
    // NOT FOUND
    // =========================
    @ExceptionHandler(DoctorNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleDoctorNotFound(DoctorNotFoundException ex,
                                                              HttpServletRequest request) {

        return build(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(AppointmentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleAppointmentNotFound(AppointmentNotFoundException ex,
                                                                   HttpServletRequest request) {

        return build(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI());
    }

    // =========================
    // BUSINESS ERRORS (FIXED)
    // =========================
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException ex,
                                                       HttpServletRequest request) {

        String msg = ex.getMessage();

        if (msg != null && msg.toLowerCase().contains("exists")) {
            return build(HttpStatus.CONFLICT, msg, request.getRequestURI());
        }

        if (msg != null && msg.toLowerCase().contains("not found")) {
            return build(HttpStatus.NOT_FOUND, msg, request.getRequestURI());
        }

        // ❌ NE SME "Access Denied" OVDE
        if (msg != null && msg.toLowerCase().contains("access denied")) {
            return build(HttpStatus.FORBIDDEN, "Forbidden", request.getRequestURI());
        }

        return build(HttpStatus.BAD_REQUEST, msg, request.getRequestURI());
    }

    // =========================
    // FALLBACK
    // =========================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex,
                                                       HttpServletRequest request) {

        return build(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Unexpected error",
                request.getRequestURI()
        );
    }

    // =========================
    // BUILDER
    // =========================
    private ResponseEntity<ErrorResponse> build(HttpStatus status,
                                                String message,
                                                String path) {

        return new ResponseEntity<>(
                new ErrorResponse(
                        LocalDateTime.now(),
                        status.value(),
                        status.getReasonPhrase(),
                        message,
                        path
                ),
                status
        );
    }
}