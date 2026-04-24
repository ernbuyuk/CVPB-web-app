-- Manual PostgreSQL bootstrap for local installs.
-- Run this from a psql session connected to the default `postgres` database.

CREATE DATABASE cvpb;

\connect cvpb

CREATE USER cvpb_user WITH PASSWORD 'cvpb_password';
GRANT ALL PRIVILEGES ON DATABASE cvpb TO cvpb_user;
