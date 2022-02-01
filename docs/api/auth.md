# Authentication & Authorization

Mandatory module. Cannot be disabled. Used to authenticate and authorize registered users. Implements `LocalStrategy` with JWT functionality that allow users to authenticate with username and password, returning a JWT for use in subsequent calls to protected API endpoints. In other words, the API routes are protected based on the presence of a valid JWT as a bearer token.

> Depends of `Users` Module.

## Table of Content
- [Introduction](#overview)
- [Module specification](#specification)

## Introduction <a name="introduction"></a>

The two fundamental aspects of security are authentication and authorization. After you enter your credentials to log in to your computer or sign in to an app or software, the device or application undertakes authentication to determine your level of authorization. Authorization may include what accounts you can use, what resources you have access to, and what functions you are permitted to carry out.

## Module specification <a name="specification"></a>
