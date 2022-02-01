## Getting started

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
