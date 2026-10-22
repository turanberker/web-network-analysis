--liquibase formatted sql

--changeset watergis:004-drop-water-source-type
-- Kaynak artık yalnızca adı olan bir noktadır; tip ve kapasite kullanılmıyor.
ALTER TABLE water_source DROP COLUMN source_type;
ALTER TABLE water_source DROP COLUMN capacity_m3_per_day;
--rollback ALTER TABLE water_source ADD COLUMN source_type VARCHAR(20);
--rollback ALTER TABLE water_source ADD COLUMN capacity_m3_per_day NUMERIC(12, 2);
