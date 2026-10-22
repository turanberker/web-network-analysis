package com.watergis.service;

import com.watergis.dto.HealthResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class HealthService {

    private final JdbcTemplate jdbcTemplate;

    public HealthService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /** Veritabanına bağlanıp PostGIS extension'ının yüklü olduğunu doğrular. */
    public HealthResponse check() {
        String version = jdbcTemplate.queryForObject("SELECT postgis_lib_version()", String.class);
        return new HealthResponse("ok", version);
    }
}
