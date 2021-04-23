


var aws_region        = process.env.AWS_DEFULT_REGION || 'us-east-2'
var AWS               = require('aws-sdk')
var secretsManager    = new AWS.SecretsManager({region: aws_region})
var DATABASE_URL      = process.env.DATABASE_URL      || "mysql://root@localhost:3306/deckbuilder"

var COGNITO_POOL_ID   = process.env.COGNITO_POOL_ID   || "us-east-2_W8Y749Lm8"
var COGNITO_REGION    = process.env.COGNITO_REGION    || "us-east-2"
var COGNITO_LOGON_URL = process.env.COGNITO_LOGON_URL || "https://auth.starwarsccg.org/login?client_id=32e1lt12beauu6clc11k2bn3ks&response_type=token&scope=email+openid+profile&redirect_uri=https://deckdb.starwarsccg.org/callback"
var JWT_SECRET        = process.env.JWT_SECRET        || "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqGSNV0fhenyCI3xzE/lZIqoFy/8xmUfxfwcSNigI2hnV316kOMnzFVw2mJkiORT9sItHQZHdxetSassi27zePoXHFE2JKS1LQF1BjYpUA2Puaypt33dxz9hsQv7fy0772U3Yr9VZ9YtRAyZjJu0kp6cMjAMrXqSeQTQ+YGKBrayyj1lOQdfWGfln8MljIPbrdnIyMl+wBJ/hrUR9WjX+nLiS1nzFdgGnznZCvNLPTT/ny55G+sGukCNyan7MUF5H2K+bh99tGDVbVNo092pkb5hGsdupvChCc69pwLp0ARNeQRFjwooG3PPX73pzVpsX0e9bPxINbNn0cMocZoGM/wIDAQAB"

process.env.COGNITO_POOL_ID=COGNITO_POOL_ID
process.env.COGNITO_REGION=COGNITO_REGION
process.env.COGNITO_LOGON_URL=COGNITO_LOGON_URL
process.env.JWT_SECRET=JWT_SECRET
process.env.DATABASE_URL = DATABASE_URL
process.env.DECKS_TABLE_NAME='Decks'
process.env.DECK_RATINGS_TABLE_NAME='DeckRatings'
process.env.CARD_COMMENTS_TABLE_NAME='CardComments'
process.env.DECK_COMMENTS_TABLE_NAME='DeckComments'
process.env.USERS_TABLE_NAME='Users'

AWS.config.update({region: aws_region });

//
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#getSecretValue-property
//

// secretsManager.getSecretValue({SecretId: 'rds_deckdb', VersionStage: 'AWSCURRENT'}, function(err, data) {
//     if (err) {
//       console.log("Unable to get rds_deckdb from SecretsManager");
//       console.log(err);
//     } else {
//       var response      = {};
//       let secret        = data.SecretString;
//       secret            = JSON.parse(secret);
//       response.user     = secret.username;
//       response.password = secret.password;
//       response.database = secret.database;
//       response.hostname = secret.hostname;
//       console.log("Using SecretsManager Database Settings\n   * username: "+secret.username + "\n   * password: "+secret.password.replace(/^(.{2})(.+)(.{2})$/, '$1......$3') + "\n   * hostname: "+secret.hostname + "\n   * database: "+secret.database);
      
//       DATABASE_URL = "mysql://" + secret.username + ":" + secret.password + "@" + secret.hostname + " :3306/" + secret.database
//       module.exports.serverRuntimeConfig.DATABASE_URL = DATABASE_URL
//       process.env.DATABASE_URL = DATABASE_URL
//     } // if err

// });



module.exports = {
  serverRuntimeConfig: {

    //
    // defaults to localhost for development
    // prod values come from Secrets Manager (above)
    //
    DATABASE_URL: process.env.DATABASE_URL || "mysql://root@localhost:3306/deckbuilder",

    //
    // defaults to prod
    //
    COGNITO_POOL_ID: COGNITO_POOL_ID,
    COGNITO_REGION: COGNITO_REGION,
    JWT_SECRET: JWT_SECRET,
    // https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
    // https://cognito-idp.us-east-2.amazonaws.com/us-east-2_W8Y749Lm8/.well-known/jwks.json
    // curl https://cognito-idp.us-east-2.amazonaws.com/us-east-2_W8Y749Lm8/.well-known/jwks.json | jq -r '.keys[] | "modulus:\(.n)\npublic exponent:\(.e)"'
    //
    // modulus........:qGSNV0fhenyCI3xzE_lZIqoFy_8xmUfxfwcSNigI2hnV316kOMnzFVw2mJkiORT9sItHQZHdxetSassi27zePoXHFE2JKS1LQF1BjYpUA2Puaypt33dxz9hsQv7fy0772U3Yr9VZ9YtRAyZjJu0kp6cMjAMrXqSeQTQ-YGKBrayyj1lOQdfWGfln8MljIPbrdnIyMl-wBJ_hrUR9WjX-nLiS1nzFdgGnznZCvNLPTT_ny55G-sGukCNyan7MUF5H2K-bh99tGDVbVNo092pkb5hGsdupvChCc69pwLp0ARNeQRFjwooG3PPX73pzVpsX0e9bPxINbNn0cMocZoGM_w
    // public exponent: AQAB
    //
    /*
    -----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqGSNV0fhenyCI3xzE/lZ
    IqoFy/8xmUfxfwcSNigI2hnV316kOMnzFVw2mJkiORT9sItHQZHdxetSassi27ze
    PoXHFE2JKS1LQF1BjYpUA2Puaypt33dxz9hsQv7fy0772U3Yr9VZ9YtRAyZjJu0k
    p6cMjAMrXqSeQTQ+YGKBrayyj1lOQdfWGfln8MljIPbrdnIyMl+wBJ/hrUR9WjX+
    nLiS1nzFdgGnznZCvNLPTT/ny55G+sGukCNyan7MUF5H2K+bh99tGDVbVNo092pk
    b5hGsdupvChCc69pwLp0ARNeQRFjwooG3PPX73pzVpsX0e9bPxINbNn0cMocZoGM
    /wIDAQAB
    -----END PUBLIC KEY-----
    */
    // modulus........:hFPnLwTquEwlj9ds6H7RcwZLs6C9iw2xfie1TIMgPfDVFQUq71rhuErEXhFPHwNyNS0Ibl7ruBIM83AQK5dIGpJ-A70TegjcE6H2EjO2KFl6y09Hb1s1c6slPZWB8KdieZ4lXe0cjemQKkP5NzLLfEo1p7rKSd0cWNXygKWql0qlWUTjjsBByNefLtSvJYdDKKpg1_bAD2sNR7dBYsJ9oTi9tlemW3a-4GSEZPwKbvpkqIRc24Owx7-Ikjb8StSV9VIar6bu8hOpVfvcza-h0R7LNE9QfckNsCb_jpXF55D8XuMwZR5gkZhzkyT6DOHFqR7LzX6LLQbpKrmyP1gRxw
    // public exponent: AQAB
    /*
    -----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhFPnLwTquEwlj9ds6H7R
    cwZLs6C9iw2xfie1TIMgPfDVFQUq71rhuErEXhFPHwNyNS0Ibl7ruBIM83AQK5dI
    GpJ+A70TegjcE6H2EjO2KFl6y09Hb1s1c6slPZWB8KdieZ4lXe0cjemQKkP5NzLL
    fEo1p7rKSd0cWNXygKWql0qlWUTjjsBByNefLtSvJYdDKKpg1/bAD2sNR7dBYsJ9
    oTi9tlemW3a+4GSEZPwKbvpkqIRc24Owx7+Ikjb8StSV9VIar6bu8hOpVfvcza+h
    0R7LNE9QfckNsCb/jpXF55D8XuMwZR5gkZhzkyT6DOHFqR7LzX6LLQbpKrmyP1gR
    xwIDAQAB
    -----END PUBLIC KEY-----
    */

    //
    // https://deckbuilder-production.auth.us-east-2.amazoncognito.com/login?client_id=3hganbcfgre49cutjo2acf2kv0&response_type=token&scope=email+openid+profile&redirect_uri=https://test.deckbuilder-staging.com/callback
    // https://deckbuilder-production.auth.us-east-2.amazoncognito.com/login?client_id=3hganbcfgre49cutjo2acf2kv0&response_type=token&scope=email+openid+profile&redirect_uri=https://test.deckbuilder-staging.com/callback
    //
    COGNITO_LOGON_URL: COGNITO_LOGON_URL,

  }
};

console.log("COGNITO_LOGON_URL: " + module.exports.serverRuntimeConfig.COGNITO_LOGON_URL);
console.log("COGNITO_POOL_ID..: " + module.exports.serverRuntimeConfig.COGNITO_POOL_ID);
console.log("COGNITO_REGION...: " + module.exports.serverRuntimeConfig.COGNITO_REGION);
console.log("DATABASE_URL.....: " + module.exports.serverRuntimeConfig.DATABASE_URL.replace(/(:+[a-z]+)/, ':xxxx'));
console.log("JWT_SECRET.......: " + module.exports.serverRuntimeConfig.JWT_SECRET);

// https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
// https://cognito-idp.us-east-2.amazonaws.com/us-east-2_W8Y749Lm8/.well-known/jwks.json
