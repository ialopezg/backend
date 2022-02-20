<div align="center">
  <h1>API BOILERPLATE</h1>
</div>
<div align="center">
  <strong>is a TypeScript API (Backend Server) starter repository</strong>
</div>
<br />

## Table of Content

- [Description](#description)
- [Configuration](#configuration)
    - [Development Server](#development-sercer)
- [Generators](#generators)

## Description

[API Boilerplate](https://github.com/ialopezg/api-boilerplate) uses [TypeORM](https://github.com/typeorm/typeorm) with Data Mapper pattern.

### Configuration

Before start install PostgreSQL and fill correct configurations in `.env` file

```env
# Database environment
DB_HOST=localhost
DB_PORT=5432
DB_LISTEN_PORT_OUT=5432
DB_ROOT_USER=postgres
DB_ROOT_PASSWORD=postgres
APP_DB_USER=boilerplate_user
APP_DB_PASSWORD=B0il3rpl@t3
APP_DB_NAME=api_boilerplate
DB_VOLUME_PATH=./data/postgres

# pgadmin environment
PGADMIN_VOLUME_PATH=./data/pgadmin
PGADMIN_DEFAULT_EMAIL=support@example.com
PGADMIN_DEFAULT_PASSWORD=postgres
```

Some helper script to work with database

```bash
# To create new migration file
yarn typeorm:migration:create migration_name
# Truncate full database (note: it isn't deleting the database)
yarn typeorm:schema:drop
# Generate migration from update of entities
yarn migration:generate migration_name
```

### Development server

> Note: If you're on Linux and see an `ENOSPC` error when running the commands below, you must [increase the number of available file watchers](https://stackoverflow.com/questions/22475849/node-js-error-enospc#answer-32600959).
```bash
# Launch the dev server
yarn start:dev
# Launch the dev server with file watcher
yarn watch:dev
# Launch the dev server and enable remote debugger with file watcher
yarn debug:dev
```

## Generators

This project includes generators to speed up common development tasks. Commands include:

> Note: Make sure you already have the nest-cli globally installed
```bash
# Install nest-cli globally
yarn global add @nestjs/cli
# Generate a new service
nest generate service users
# Generate a new class
nest g class users
```
> Note: if you love generators then you can find full list of command in official [Nest-cli Docs](https://docs.nestjs.com/cli/usages#generate-alias-g).
