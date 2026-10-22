--liquibase formatted sql

--changeset watergis:002-create-water-source
-- Su kaynağı (kuyu, pınar, baraj, depo) noktaları. Koordinatlar EPSG:4326 (lng, lat).
CREATE TABLE water_source (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(120)  NOT NULL,
    source_type         VARCHAR(20)   NOT NULL CHECK (source_type IN ('WELL', 'SPRING', 'DAM', 'RESERVOIR')),
    capacity_m3_per_day NUMERIC(12, 2),
    geom                geometry(Point, 4326) NOT NULL
);
-- GIST index: bbox (WMS/WFS) ve mesafe sorgularını hızlandırır.
CREATE INDEX idx_water_source_geom ON water_source USING GIST (geom);
--rollback DROP TABLE water_source;

--changeset watergis:002-seed-water-source
-- Ankara çevresinde örnek kaynaklar. ST_MakePoint(lng, lat) sırasına dikkat.
INSERT INTO water_source (name, source_type, capacity_m3_per_day, geom) VALUES
    ('Çubuk-1 Barajı',        'DAM',       120000, ST_SetSRID(ST_MakePoint(32.9400, 40.0650), 4326)),
    ('Elmadağ Pınarı',        'SPRING',      1500, ST_SetSRID(ST_MakePoint(33.0600, 39.9200), 4326)),
    ('Etimesgut Kuyusu K-12', 'WELL',         800, ST_SetSRID(ST_MakePoint(32.6800, 39.9500), 4326)),
    ('Dikmen Su Deposu',      'RESERVOIR',  25000, ST_SetSRID(ST_MakePoint(32.8450, 39.8800), 4326)),
    ('Mamak Kuyusu K-3',      'WELL',         650, ST_SetSRID(ST_MakePoint(32.9300, 39.9300), 4326));
--rollback DELETE FROM water_source;
