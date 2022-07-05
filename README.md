## Description
Simple starter boilerplate for GraphQL back-ends using [NestJS](https://github.com/nestjs/nest) and [Prisma](https://prisma.io) with the Code First approach.
* Using JWT + RefreshCookie as Auth approach.
* All mutations and queries are guarded by default, except for signup and login mutations.

## Installation
Before installation, define the following .env variables:

* DATABASE_URL - The url and access details for the database
* JWT_EXPIRATION - The expiration time for the JWT Token
* JWT_SECRET - The secret for the JWT token
* COOKIE_SECRET - The secret for the Refreshcookie
* JWT_REFRESH_SECRET - The secret for the JWT Refresh Token

Then, Modify datasource db in /src/schema.prisma to match your database type.

Subsequently, run:

```bash
$ npm install
```

Prisma migrate for relational databases:

```bash
$ npx prisma migrate dev
```

Generate the prisma client:

```bash
$ npx prisma generate
```

## Running the app
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## GraphQL Endpoints

The application exposes the following mutations and queries, also available in the GraphQL playground when running the application (/graphql). In the below example, they are named to their respective functions

Login with email and password and return the accesstoken (don't forget to define your query variables):

```graphql
mutation Login($login: AuthInput!) {
  login(data: $login) {
    accessToken,
    expiresAt
  }
}
```

Registers a user with an unique email (don't forget to define your query variables):

```graphql
mutation Register($registration: AuthInput!) {
  register(data: $registration) {
    email
  }
}
```

Receives a new JWT token when a valid refresh cookie is present:

```graphql
query Refresh {
  refresh {
    accessToken,
    expiresAt
  }
}
```

Logout a user by clearing the refresh cookie:

```graphql
query Logout {
  logout {
    accessToken
  }
}
```

General public query:

```graphql
query Welcome {
  welcome
}
```

Only accessible when passing a valid JWT token:

```graphql
query Goodbye {
  goodbye
}
```
