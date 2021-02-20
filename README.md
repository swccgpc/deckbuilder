SWCCG Deck Builder
==================

## Prerequisites

* [NodeJS 12 LTS](https://nodejs.org/en/)
* yarn
* MySQL Server



## Setup MySQL

### Create Database

```sql
CREATE DATABASE swccgdb;
```

### Load the database schema

```bash
mysql --user=root -p swccgdb < sql/schema.sql
```

### populate environment: `DATABASE_URL`

* The SWCCGDB requires the `DATABASE_URL` environment variable.
* The variable can be set via URI in the environment:
```bash
export DATABASE_URL="mysql://username:password@hostname:3306/swccgdb"
```
* Or the variable can be set in the **prisma env file**: `prisma/.env`
```bash
DATABASE_URL="mysql://username:password@hostname:3306/swccgdb"
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



## Start the  web server

```bash
npx next start
```



## [Prisma Database Access SDK for MySQL](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-sql-typescript-mysql) is used for accessing the SWCCGDB Database in an ORM fashion.


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



