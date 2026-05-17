package com.diplomski.doctor_appointment_system.controller;

import com.diplomski.doctor_appointment_system.dto.SearchResponseDTO;
import com.diplomski.doctor_appointment_system.service.GlobalSearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final GlobalSearchService service;

    public SearchController(GlobalSearchService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<SearchResponseDTO> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String id
    ) {
        return ResponseEntity.ok(service.search(q, id));
    }
}