SWCCG Decks
==================

## Prerequisites

* [NodeJS 14 LTS](https://nodejs.org/en/)
* yarn
* DynamoDB





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




