<p align="center">A Base skeleton with authentication, users, roles, exceptions, logs, migrations, and default dispatchers built with NestJS.</p>

## Description

[API Boilerplate](https://github.com/ialopezg/api-boilerplate) is TypeScript API starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Features

- `Data Transfer Object (DTO)` polyfill transformation functionality.
- `Context Middleware`, provide information about the current execution context which can be used to build generic guards, filters, and interceptors that can work across a broad set of controllers, methods, and execution contexts.
- `AbstractDto`,  an object that is used to encapsulate data, and send it from one subsystem of an application to another subsystem, module, etc.
- `AbstractEntity`, is moslty object-design-based solution to make TypeORM works as expected.

## Support

API Boilerplate is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://ialopezg.com/api-boilerplate).

## Stay in touch

- Author - [Isidro A. López G.](https://ialopezg.com)
- Website - [https://ialopezg.com](https://ialopezg.com/)
- Twitter - [@ialopezg](https://twitter.com/isidro.lopezg)

## License

API Boilerplate is [MIT licensed](LICENSE).
