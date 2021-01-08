


var aws_region     = process.env.AWS_DEFULT_REGION || 'us-east-2'
var AWS            = require('aws-sdk')
var secretsManager = new AWS.SecretsManager({region: aws_region})
var DATABASE_URL   = "mysql://root@localhost:3306/swccgdb"

//
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#getSecretValue-property
//
secretsManager.getSecretValue({SecretId: 'rds_deckdb', VersionStage: 'AWSCURRENT'}, function(err, data) {
    if (err) {
      console.log("Unable to get rds_deckdb from SecretsManager");
      console.log(err);
    } else {
      var response      = {};
      let secret        = data.SecretString;
      secret            = JSON.parse(secret);
      response.user     = secret.username;
      response.password = secret.password;
      response.database = secret.database;
      response.hostname = secret.hostname;
      console.log("Using SecretsManager Database Settings\n   * username: "+secret.username + "\n   * password: "+secret.password.replace(/^(.{2})(.+)(.{2})$/, '$1......$3') + "\n   * hostname: "+secret.hostname + "\n   * database: "+secret.database);
      
      DATABASE_URL = "mysql://" + secret.username + "@" + secret.hostname + " :3306/" + secret.database
      module.exports.serverRuntimeConfig.DATABASE_URL = DATABASE_URL
      process.env.DATABASE_URL = DATABASE_URL
    } // if err

});



module.exports = {
  serverRuntimeConfig: {

    //
    // defaults to localhost for development
    // prod values come from Secrets Manager (above)
    //
    DATABASE_URL: process.env.DATABASE_URL || "mysql://root@localhost:3306/swccgdb",

    //
    // defaults to prod
    //
    COGNITO_POOL_ID: process.env.COGNITO_POOL_ID || "us-east-2_W8Y749Lm8",
    COGNITO_REGION: process.env.COGNITO_REGION || "us-east-2",
    JWT_SECRET: process.env.JWT_SECRET || "",

  }
};

console.log("COGNITO_POOL_ID: " + module.exports.serverRuntimeConfig.COGNITO_POOL_ID);
console.log("COGNITO_REGION: " + module.exports.serverRuntimeConfig.COGNITO_REGION);
console.log("DATABASE_URL: " + module.exports.serverRuntimeConfig.DATABASE_URL.replace(/(:+[a-z]+)/, ':xxxx'));

// https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
// https://cognito-idp.us-east-2.amazonaws.com/us-east-2_W8Y749Lm8/.well-known/jwks.json
