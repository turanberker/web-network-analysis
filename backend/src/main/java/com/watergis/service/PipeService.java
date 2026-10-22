package com.watergis.service;

import com.watergis.dto.PipeRequest;
import com.watergis.repository.PipeRepository;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PipeService {

    private final PipeRepository repository;

    public PipeService(PipeRepository repository) {
        this.repository = repository;
    }

    /** Yeni boruyu kaydeder ve PostGIS'in ürettiği GeoJSON Feature metnini döndürür. */
    @Transactional
    public String create(PipeRequest request) {
        if (request.geometry() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "geometry zorunludur");
        }
        var props = request.properties();
        Long id;
        try {
            id = repository.insertFromGeoJson(props != null ? props.material() : null,
                    props != null ? props.diameterMm() : null, request.geometry().toString());
        } catch (DataAccessException e) {
            // Geçersiz GeoJSON, LineString dışı geometri veya diameter_mm <= 0 PostGIS tarafından reddedilir.
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçersiz boru: LineString bekleniyor", e);
        }
        return repository.findFeatureById(id).orElseThrow();
    }
}
