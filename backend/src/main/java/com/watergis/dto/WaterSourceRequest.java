package com.watergis.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.watergis.model.WaterSourceType;

import java.math.BigDecimal;

/** POST /api/water-sources gövdesi: GeoJSON Feature. */
public record WaterSourceRequest(String type, JsonNode geometry, Properties properties) {

    public record Properties(String name, WaterSourceType sourceType, BigDecimal capacityM3PerDay) {
    }
}
