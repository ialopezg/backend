<p align="center">API Boilerplate is a TypeScript API starter repository</p>

## Description

[API Boilerplate](https://github.com/ialopezg/api-boilerplate) is a basic skeleton with class abstraction, global & local validation, global & local exception handlers, logging &data tracking, data transfer objects, execution context, authentication, users & user roles, migrations, and default dispatchers built with NestJS.
### Features

- **`Data Transfer Object (DTO)`** polyfill transformation functionality.
- **`Context Middleware`**, provide information about the current execution context which can be used to build generic guards, filters, and interceptors that can work across a broad set of controllers, methods, and execution contexts.
- **`Database Connection Manager`**, uses connection profiles. Which allow you to set all the connection parameters for specific database(s) at once, and quickly connect to this database(s) later.
- **`AbstractDto`**,  an object that is used to encapsulate data, and send it from one subsystem of an application to another subsystem, module, etc.
- **`AbstractEntity`**, is moslty object-design-based solution to make TypeORM works as expected.
- **`BadRequest & QueryFailed`** filter exceptions, defines an exceptions layer for processing all unhandled exceptions across the application. When an exception is not handled by your application code, it is caught by this layer, which then automatically sends an appropriate user-friendly response.
- **`Global Validation`**, It is best practice to validate the correctness of any data sent into a web application and automatically validate incoming requests. As a class-validator provides validations as like as `ValidationPipe`, `ParseIntPipe`, `ParseBoolPipe`, `ParseArrayPipe`, and `ParseUUIDPipe`.
- **`Data Persistence & Object Relational Mapping`**, comprising all disciplines related to managing data as a valuable resource based on the concept of "objects". When this storage and retrieval functionality is implemented, the objects are said to be persistent.
- **`Data Analysis`**, transactional operations let data hygiene and integrity is maintained by the database feature of only logging completed transactions. The system cancels a transaction that did not check all the proper completion boxes. This inbuilt screening mechanism ensures that the data recorded is either a successful transaction or a failure. This feature is not without its challenges; notably, it is sometimes difficult to scale up.
- **`API Documentation`**, is the technical content deliverable, containing instructions about how to effectively use and integrate with an API. It’s a concise reference manual containing all the information required to work with the API, with details about the functions, classes, return types, arguments and more, supported by tutorials and examples. API Documentation has traditionally been done using regular content creation and maintenance tools and text editors.

## Support

API Boilerplate is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://ialopezg.com/api-boilerplate).

## Stay in touch

- Author - [Isidro A. López G.](https://ialopezg.com)
- Website - [https://ialopezg.com](https://ialopezg.com/)
- Twitter - [@ialopezg](https://twitter.com/isidro.lopezg)

## License

API Boilerplate is [MIT licensed](LICENSE).
