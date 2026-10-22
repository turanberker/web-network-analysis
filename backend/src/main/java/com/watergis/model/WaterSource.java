package com.watergis.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.locationtech.jts.geom.Point;

import java.math.BigDecimal;

@Entity
@Table(name = "water_source")
public class WaterSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false, length = 20)
    private WaterSourceType sourceType;

    @Column(name = "capacity_m3_per_day", precision = 12, scale = 2)
    private BigDecimal capacityM3PerDay;

    /** Hibernate Spatial, JTS Point'i PostGIS geometry(Point, 4326) sütununa eşler. */
    @Column(nullable = false, columnDefinition = "geometry(Point, 4326)")
    private Point geom;

    protected WaterSource() {
    }

    public WaterSource(String name, WaterSourceType sourceType, BigDecimal capacityM3PerDay, Point geom) {
        this.name = name;
        this.sourceType = sourceType;
        this.capacityM3PerDay = capacityM3PerDay;
        this.geom = geom;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public WaterSourceType getSourceType() {
        return sourceType;
    }

    public BigDecimal getCapacityM3PerDay() {
        return capacityM3PerDay;
    }

    public Point getGeom() {
        return geom;
    }
}
