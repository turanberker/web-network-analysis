package com.watergis.controller;

import com.watergis.dto.PipeRequest;
import com.watergis.service.PipeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Boru hattı yazma API'si. Okuma (harita gösterimi) GeoServer WFS üzerinden yapılır.
 */
@RestController
@RequestMapping("/api/pipes")
public class PipeController {

    private final PipeService service;

    public PipeController(PipeService service) {
        this.service = service;
    }

    @PostMapping(produces = "application/geo+json")
    @ResponseStatus(HttpStatus.CREATED)
    public String create(@RequestBody PipeRequest request) {
        return service.create(request);
    }
}
