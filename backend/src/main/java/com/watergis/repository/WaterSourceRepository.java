package com.watergis.repository;

import com.watergis.model.WaterSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface WaterSourceRepository extends JpaRepository<WaterSource, Long> {

    /**
     * Tek bir kaynağı PostGIS'te GeoJSON Feature metnine dönüştürür.
     * ST_AsGeoJSON(record) satırın geri kalan sütunlarını "properties" altına koyar.
     */
    @Query(value = """
            SELECT ST_AsGeoJSON(t.*, 'geom', 6)
            FROM (SELECT id, name, geom
                  FROM water_source WHERE id = :id) t
            """, nativeQuery = true)
    Optional<String> findFeatureById(@Param("id") Long id);

    /**
     * GeoJSON geometrisini Java'da parse etmeden doğrudan PostGIS'e verir.
     * Sütun tipi geometry(Point, 4326) olduğu için Point dışı geometriler DB tarafından reddedilir.
     */
    @Query(value = """
            INSERT INTO water_source (name, geom)
            VALUES (:name, ST_SetSRID(ST_GeomFromGeoJSON(:geometry), 4326))
            RETURNING id
            """, nativeQuery = true)
    Long insertFromGeoJson(@Param("name") String name, @Param("geometry") String geometryJson);
}
