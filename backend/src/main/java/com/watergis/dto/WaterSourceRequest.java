package com.watergis.dto;

import com.fasterxml.jackson.databind.JsonNode;

/** POST /api/water-sources gövdesi: GeoJSON Feature. */
public record WaterSourceRequest(String type, JsonNode geometry, Properties properties) {

    public record Properties(String name) {
    }
}
