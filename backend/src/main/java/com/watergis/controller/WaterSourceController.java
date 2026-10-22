package com.watergis.controller;

import com.watergis.dto.WaterSourceRequest;
import com.watergis.service.WaterSourceService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Su kaynağı yazma API'si. Okuma (harita gösterimi) GeoServer WMS/WFS üzerinden yapılır.
 */
@RestController
@RequestMapping("/api/water-sources")
public class WaterSourceController {

    private final WaterSourceService service;

    public WaterSourceController(WaterSourceService service) {
        this.service = service;
    }

    @PostMapping(produces = "application/geo+json")
    @ResponseStatus(HttpStatus.CREATED)
    public String create(@RequestBody WaterSourceRequest request) {
        return service.create(request);
    }
}
