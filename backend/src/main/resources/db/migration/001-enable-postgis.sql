--liquibase formatted sql

--changeset watergis:001-enable-postgis
CREATE EXTENSION IF NOT EXISTS postgis;
--rollback DROP EXTENSION IF EXISTS postgis;
