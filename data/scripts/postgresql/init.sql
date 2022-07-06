CREATE USER user WITH PASSWORD 'password' CREATEDB;
CREATE DATABASE database
    WITH 
    OWNER = user
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;