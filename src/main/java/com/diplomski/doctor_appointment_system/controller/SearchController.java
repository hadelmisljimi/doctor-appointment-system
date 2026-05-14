package com.diplomski.doctor_appointment_system.controller;

import com.diplomski.doctor_appointment_system.dto.SearchResponseDTO;
import com.diplomski.doctor_appointment_system.service.SearchService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Search", description = "Search doctors and patients")
@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public SearchResponseDTO search(@RequestParam String q) {
        return searchService.search(q);
    }
}