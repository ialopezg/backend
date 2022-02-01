# Redis

[Redis](https://redis.io/) is a popular in-memory key-value database that will serve as the back-bone of our queue. Tasks to send emails will be added to the queue, and the [NestJS](https://nestjs.com/) processor will consume tasks from the queue.

# Table of Contents
1. [Quick start](#introduction)
2. [Installation](#installation)
    - [Docker](#docker)
    - [Manually](#manually)
        - [From source code](#from-source-code)
        - [From the official Ubuntu PPA](#from-official-ubuntu-ppa)
        - [From scratch](#from-snapcraft88)

## Quick start <a name="introduction"></a>

This guide covers creating a [Redis](https://redis.io) for your NestJS app that enables you to queue emails via a service that uses [@nestjs/bull](https://github.com/nestjs/bull), which are then handled by a processor that uses the nest-modules/mailer package to send email.


[Nest](https://nestjs.com) provides the `@nestjs/bull` package as an abstraction/wrapper on top of [Bull](https://github.com/OptimalBits/bull), a popular, well supported, high performance Node.js based Queue system implementation. The package makes it easy to integrate Bull Queues in a Nest-friendly way to your application.

Bull uses Redis to persist job data, so you'll need to have Redis installed on your system. Because it is Redis-backed, your Queue architecture can be completely distributed and platform-independent. For example, you can have some Queue producers and consumers and listeners running in Nest on one (or several) nodes, and other producers, consumers and listeners running on other Node.js platforms on other network nodes.

> `Reminder`: Redis Server must be run on top of all, before all services, that need implement the Redis Server - Queue Service, starts.

## Installation <a name="installation"></a>

### Docker <a name="docker"></a>

Perhaps the easiest way to get a Redis instance rolling for development purposes is with Docker. Assuming you have Docker installed on your machine, you can run the following command:

```shell
$ docker run -p 6379:6379 --name redisqueue -d redis
```

Port 6379 is the default redis port. Make sure you don’t already have a conflicting service running on port 6379.

To later stop the redis instance, run the command:

```shell
$ docker stop redisqueue
```

### Manually <a name="manually"></a>

#### **From source code** <a name="from-source-code"></a>

Download, extract and compile Redis with:

```shell
$ wget https://download.redis.io/releases/redis-6.2.5.tar.gz

$ tar xzf redis-6.2.5.tar.gz

$ cd redis-6.2.5

$ make
```

The binaries that are now compiled are available in the src directory. Run Redis with:

```shell
$ src/redis-server
```

You can interact with Redis using the built-in client:

```shell
$ src/redis-cli
redis> set foo bar
OK
redis> get foo
"bar"
```

#### **From the official Ubuntu PPA** <a name="from-official-ubuntu-ppa"></a>

You can install the latest stable version of Redis from the redislabs/redis package repository. Add the repository to the apt index, update it and install:

```shell
$ sudo add-apt-repository ppa:redislabs/redis
$ sudo apt-get update
$ sudo apt-get install redis
```

#### **From Snapcraft88 <a name="from-snapcraft88"></a>

You can install the latest stable version of Redis from the Snapcraft marketplace:

```shell
$ sudo snap install redis
```

Please check the [interactive tutorial](http://try.redis.io/) for more details. 