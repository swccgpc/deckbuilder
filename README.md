SWCCG Deck Builder
==================

## Prerequisites

* [NodeJS 12 LTS](https://nodejs.org/en/)
* yarn
* MySQL Server



## Setup MySQL

### Create Database

```sql
CREATE DATABASE deckdb;
```

### Load the database schema

```bash
mysql --user=root -p deckdb < sql/schema.sql
```

### populate environment: `DATABASE_URL`

* The deckdb requires the `DATABASE_URL` environment variable.
* The variable can be set via URI in the environment:
```bash
export DATABASE_URL="mysql://username:password@hostname:3306/deckdb"
```
* Or the variable can be set in the **prisma env file**: `prisma/.env`
```bash
DATABASE_URL="mysql://username:password@hostname:3306/deckdb"
```

* In prouction, the `DATABASE_URL` is set in `next.config.js` from data retrieved from **Secrets Manager**.



## Build code

```bash
##
## use yarn to install dependencies
##
yarn
npx next build
```


## JWT Secret

* The JWT Secret is determined by pulling the file: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
* Then convert the JWK to PEM format.
* Feed the resulting PEM, without newlines, in to the JWT_SECRET variable
* The decoding process has been built in to `jwk_to_pem.js`

```bash
node jwk_to_pem.js
```


## Start the  web server

```bash
npx next start
```



## [Prisma Database Access SDK for MySQL](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-sql-typescript-mysql) is used for accessing the deckdb Database in an ORM fashion.


### Convert DB Schema in to a Prisma Data Model

* After _introspecting_ the database, there will be a data model file `prisma/schema.prisma` which represents the current database schema.

```bash
npx prisma introspect
```

### Generate Prisma Client library

* Read the Prisma schema and generate a Prisma Client library into `node_modules/@prisma/client`

```bash
npx prisma generate
```



## User Authentication using Cognito

* With **Cognito User Pools**, you can easily and securely add sign-up and sign-in functionality to your mobile and web apps with a fully-managed service that scales to support hundreds of millions of users.
* The Production **Cognito User Pool** is created through the **[SWCCG Infrastructure Terraform code](https://github.com/swccgpc/swccg-infrastructure)**.
* Cognito client configuration is set using environment variables:
  * `COGNITO_POOL_ID`
  * `COGNITO_REGION`
  * `JWT_SECRET`



## Webserver Port

* By default the app will run on port `3000`.
* The webserver port can be customized by passing: `--port=8080` to the startup command:

```bash
npx next start --port=8080
```



