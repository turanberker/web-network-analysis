package com.watergis.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.locationtech.jts.geom.LineString;

import java.math.BigDecimal;

@Entity
@Table(name = "pipe")
public class Pipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 40)
    private String material;

    @Column(name = "diameter_mm")
    private Integer diameterMm;

    /** Hibernate Spatial, JTS LineString'i PostGIS geometry(LineString, 4326) sütununa eşler. */
    @Column(nullable = false, columnDefinition = "geometry(LineString, 4326)")
    private LineString geom;

    /** PostGIS generated column; Hibernate yazmaz, yalnızca okur. */
    @Column(name = "length_m", insertable = false, updatable = false)
    private BigDecimal lengthM;

    protected Pipe() {
    }

    public Long getId() {
        return id;
    }

    public String getMaterial() {
        return material;
    }

    public Integer getDiameterMm() {
        return diameterMm;
    }

    public LineString getGeom() {
        return geom;
    }

    public BigDecimal getLengthM() {
        return lengthM;
    }
}
