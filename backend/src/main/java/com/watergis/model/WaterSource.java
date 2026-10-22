package com.watergis.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "water_source")
public class WaterSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    /** Hibernate Spatial, JTS Point'i PostGIS geometry(Point, 4326) sütununa eşler. */
    @Column(nullable = false, columnDefinition = "geometry(Point, 4326)")
    private Point geom;

    protected WaterSource() {
    }

    public WaterSource(String name, Point geom) {
        this.name = name;
        this.geom = geom;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Point getGeom() {
        return geom;
    }
}
