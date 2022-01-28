CREATE USER boilerplate_user WITH PASSWORD 'B0il3rpl@t3' CREATEDB;
CREATE DATABASE boilerplate
    WITH 
    OWNER = boilerplate_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;