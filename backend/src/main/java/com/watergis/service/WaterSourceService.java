package com.watergis.service;

import com.watergis.dto.WaterSourceRequest;
import com.watergis.repository.WaterSourceRepository;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class WaterSourceService {

    private final WaterSourceRepository repository;

    public WaterSourceService(WaterSourceRepository repository) {
        this.repository = repository;
    }

    /** Yeni kaynağı kaydeder ve PostGIS'in ürettiği GeoJSON Feature metnini döndürür. */
    @Transactional
    public String create(WaterSourceRequest request) {
        if (request.geometry() == null || request.properties() == null
                || request.properties().name() == null || request.properties().sourceType() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "geometry, properties.name ve properties.sourceType zorunludur");
        }
        var props = request.properties();
        Long id;
        try {
            id = repository.insertFromGeoJson(props.name(), props.sourceType().name(),
                    props.capacityM3PerDay(), request.geometry().toString());
        } catch (DataAccessException e) {
            // Geçersiz GeoJSON veya Point dışı geometri PostGIS tarafından reddedilir.
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçersiz geometri: Point bekleniyor", e);
        }
        return repository.findFeatureById(id).orElseThrow();
    }
}
