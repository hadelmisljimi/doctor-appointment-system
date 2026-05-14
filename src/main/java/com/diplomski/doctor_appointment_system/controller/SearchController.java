package com.diplomski.doctor_appointment_system.controller;

import com.diplomski.doctor_appointment_system.dto.SearchResponseDTO;
import com.diplomski.doctor_appointment_system.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService service;

    public SearchController(SearchService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<SearchResponseDTO> search(@RequestParam String q) {
        return ResponseEntity.ok(service.search(q));
    }
}