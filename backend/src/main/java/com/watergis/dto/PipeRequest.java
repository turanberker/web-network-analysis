package com.watergis.dto;

import com.fasterxml.jackson.databind.JsonNode;

/** POST /api/pipes gövdesi: GeoJSON Feature (LineString). */
public record PipeRequest(String type, JsonNode geometry, Properties properties) {

    public record Properties(String material, Integer diameterMm) {
    }
}
