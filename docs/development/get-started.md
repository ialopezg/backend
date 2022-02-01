# Setup and development

- [Setup and development](#setup-and-development)
  - [First-time setup](#first-time-setup)
  - [Installation](#installation)
    - [Database](#database)
    - [Configuration](#configuration)
    - [Dev server](#dev-server)
  - [Generators](#generators)
  - [Docker](#docker)
    - [Docker installation](#docker-installation)
    - [Docker-compose installation](#docker-compose-installation)
    - [Run](#run)

## First-time setup

Make sure you have the following installed:

- [Node](https://nodejs.org/en/) (at least the latest LTS)
- [Yarn](https://yarnpkg.com/lang/en/docs/install/) (at least 1.0)

## Installation

Easily to install and configure. 

1. Clone the repository.
```bash
git clone https://github.com/ialopezg/api-boilerplate.git
```

2. Enter your newly-cloned folder.
```bash
cd api-boilerplate
```

3. Ensure that a configuration file is located in the root of the project. An example file is provided. Easily you could make a copy and change the default values provided.
```bash
cp .example.env .env
```

4. Ensure a [Redis instance](https://redis.io/) is already initialized and ready to accept enqueue tasks. Please, check an additional documentation for setup an instance locally [here](docs/modules/additionals/redis.md).

5. Install dependencies. (Make sure yarn is installed: https://yarnpkg.com/lang/en/docs/install, otherwise you could use npm)
```bash
yarn # or npm install
```

6. Run and open server at http://localhost:5000

By default, the system will detect the enviroment and adjust the routes.

- Production environment: http://localhost:5000/
    
```bash
yarn start:prod # or npm run start:prod
```

- Developement environment: http://localhost:5000/api
```bash
yarn start:dev # or npm run start:dev
```

7. Read the documentation linked below for "Setup and development".


> Note: don't delete yarn.lock before installation
### Database

> Note: Awesome nest boilerplate uses [TypeORM](https://github.com/typeorm/typeorm) with Data Mapper pattern.

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
APP_DB_NAME=boilerplate
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

### Dev server

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
## Docker

if you are familiar with [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose) then you can run built in docker-compose file, which will install and configure application and database for you.

### Docker installation

Download docker from Official website

- Mac <https://docs.docker.com/docker-for-mac/install/>
- Windows <https://docs.docker.com/docker-for-windows/install/>
- Ubuntu <https://docs.docker.com/install/linux/docker-ce/ubuntu/>

### Docker-compose installation

Download docker from [Official website](https://docs.docker.com/compose/install)

### Run

Open terminal and navigate to project directory and run the following command.

```bash
PORT=3000 docker-compose up
```

> Note: application will run on port 3000 (<http://localhost:3000>)
Navigate to <http://localhost:8080> and connect to you database with the following configurations

```text
host: postgres
user: postgres
pass: postgres
```

create database `nest_boilerplate` and your application fully is ready to use.