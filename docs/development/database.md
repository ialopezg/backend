## Docker Compose with Postgres Database

In this article, We will explain to you how to set up Postgresql following multiple databases using Docker-Compose

### Let’s Start Creating Multiple Environment Database

Hope you are familiar with “Docker-Compose”

Folder structure

```
project
├── data (folder)
│   ├── scripts (folder)
│       ├── init.sql (File)
├── docker-compose.yml (File)
```

### docker-compose.yml

```bash
touch docker-compose.yml
```
Copy and paste the following code to `docker-compose.yml` file recently created.

```yaml
version: "3"

services:
  postgres:
    container_name: postgres
    image: postgres:latest
    healthcheck:
      test: [ "CMD", "pg_isready", "-q", "-d", "postgres", "-U", "root" ]
      timeout: 45s
      interval: 10s
      retries: 10
    restart: always
    ports:
      - "${DB_LISTEN_PORT_OUT}:5432"
    volumes:
      - ${DB_VOLUME_PATH}:/var/lib/postgresql/data
      - ./data/scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    env_file:
      - .env
    environment:
      POSTGRES_USER: ${DB_ROOT_USER}
      POSTGRES_PASSWORD: ${DB_ROOT_PASSWORD}
      POSTGRES_DB_NAME: ${APP_DB_NAME}
      APP_DB_USER: ${APP_DB_USER}
      APP_DB_PASS: ${APP_DB_PASSWORD}
    networks:
      - postgres

  pgadmin:
    container_name: pgadmin
    links:
      - postgres:postgres
    image: dpage/pgadmin4
    ports:
      - 8080:80
    volumes:
      - ${PGADMIN_VOLUME_PATH}:/root/.pgadmin
    env_file:
      - .env
    restart: always
    networks:
      - postgres

networks:
  postgres:
    driver: bridge

```

Above file, we have created a Postgres Docker container with Port No: 5432

As well as set environment variables such as default username, password of Postgres container.

If you check the entire file we have also created volumes that point to the `init.sql` file.

```yaml
- ./data/scripts/init.sql:/docker-entrypoint initdb.d/init.sql
```

The script inside “init.sql” will create multiple or the default database upon container startup. You can see the following file we have different 2 users.

1. `postgres` (Default root for local development)
2. `boilerplate_user` (For Testing)

```sql
CREATE USER boilerplate_user WITH PASSWORD 'B0il3rpl@t3' CREATEDB;
CREATE DATABASE boilerplate
    WITH 
    OWNER = boilerplate_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
```

When you run the following command in the root directory for the project.

```bash
docker-compose up -d
```

Then you will see in the console `init.sql` script will be executed that means your script executed successfully.

### Test connection

For testing, we used Pgadmin4 configured already setup in the docker-compose file.

1. Try to run following URL in the browser

```
http://localhost:16543
```

And enter username and password defined in `docker-compose.yml` file.

```
username: support@example.com
password: postgres
```

2 After successful login, you must click on to `server -> create -> server`. You will see a pop up then in the General tab, type

```
name: localhost
```

Or the name you desire.

3. Then click on Connection tab as the following screenshot then input Hostname

You can get Hostname by typing following command

```bash
$ ifconfig |grep inet
```

then type next, in each field

```
Database: root
Username: root
Password: root
```

4. Then click on to Save Button

If the connection is successful you will see on the left side of the Pgadmin 4 navigation the details of your server and database.

Now you are ready to continue expxloring all the features in the browser UI.

Enyoy it