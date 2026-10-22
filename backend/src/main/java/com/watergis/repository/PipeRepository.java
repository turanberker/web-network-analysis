package com.watergis.repository;

import com.watergis.model.Pipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PipeRepository extends JpaRepository<Pipe, Long> {

    /** Tek boruyu PostGIS'te GeoJSON Feature metnine dönüştürür (length_m dahil). */
    @Query(value = """
            SELECT ST_AsGeoJSON(t.*, 'geom', 6)
            FROM (SELECT id, material, diameter_mm, length_m, geom
                  FROM pipe WHERE id = :id) t
            """, nativeQuery = true)
    Optional<String> findFeatureById(@Param("id") Long id);

    /**
     * GeoJSON geometrisini doğrudan PostGIS'e verir. ST_Force2D olası Z değerini atar (rakım tutulmaz).
     * Sütun tipi geometry(LineString, 4326) olduğu için LineString dışı geometriler DB tarafından reddedilir.
     */
    @Query(value = """
            INSERT INTO pipe (material, diameter_mm, geom)
            VALUES (:material, :diameterMm, ST_SetSRID(ST_Force2D(ST_GeomFromGeoJSON(:geometry)), 4326))
            RETURNING id
            """, nativeQuery = true)
    Long insertFromGeoJson(@Param("material") String material,
                           @Param("diameterMm") Integer diameterMm,
                           @Param("geometry") String geometryJson);
}
