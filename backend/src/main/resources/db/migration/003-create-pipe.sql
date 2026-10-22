--liquibase formatted sql

--changeset watergis:003-create-pipe
-- Boru hattı segmentleri. 2D çizgi (rakım yok), koordinatlar EPSG:4326 (lng, lat).
CREATE TABLE pipe (
    id          BIGSERIAL PRIMARY KEY,
    material    VARCHAR(40),
    diameter_mm INTEGER CHECK (diameter_mm > 0),
    geom        geometry(LineString, 4326) NOT NULL,
    -- Uzunluk PostGIS'te hesaplanır: geography'ye cast, derece yerine elipsoid üzerinde metre verir.
    length_m    NUMERIC(12, 2) GENERATED ALWAYS AS (ST_Length(geom::geography)) STORED
);
CREATE INDEX idx_pipe_geom ON pipe USING GIST (geom);
--rollback DROP TABLE pipe;
