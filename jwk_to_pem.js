#!/usr/bin/env node


const jwkToPem   = require('jwk-to-pem');
//const requestify = require('requestify');

/**
 * Get cognito's secret key
 * @param {String} region
 * @param {String} userPoolId
 * @returns {Promise}
 */
function get_pem_from_url(region, userPoolId) {
  const jwkUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

  //return requestify.request(jwkUrl, { method: 'get', dataType: 'json'})
  //  .then(res => res.getBody()['keys'].shift())
  //  .then(jwk => jwkToPem(jwk));

  var jwk = {
    "alg": "RS256",
    "e":   "AQAB",
    "kid": "HwTZXivKVfUarl42+Edr69FkHAVMfI+gns9LRUEcWoA=",
    "kty": "RSA",
    "n":   "qGSNV0fhenyCI3xzE_lZIqoFy_8xmUfxfwcSNigI2hnV316kOMnzFVw2mJkiORT9sItHQZHdxetSassi27zePoXHFE2JKS1LQF1BjYpUA2Puaypt33dxz9hsQv7fy0772U3Yr9VZ9YtRAyZjJu0kp6cMjAMrXqSeQTQ-YGKBrayyj1lOQdfWGfln8MljIPbrdnIyMl-wBJ_hrUR9WjX-nLiS1nzFdgGnznZCvNLPTT_ny55G-sGukCNyan7MUF5H2K-bh99tGDVbVNo092pkb5hGsdupvChCc69pwLp0ARNeQRFjwooG3PPX73pzVpsX0e9bPxINbNn0cMocZoGM_w",
    "use": "sig"
  }

  var jwk = {
    "alg": "RS256",
    "e":   "AQAB",
    "kid": "/T2OQtHmPHdQiVqxCsIFXWuF0iBbl9s953a76/CSFQw=",
    "kty": "RSA",
    "n":   "hFPnLwTquEwlj9ds6H7RcwZLs6C9iw2xfie1TIMgPfDVFQUq71rhuErEXhFPHwNyNS0Ibl7ruBIM83AQK5dIGpJ-A70TegjcE6H2EjO2KFl6y09Hb1s1c6slPZWB8KdieZ4lXe0cjemQKkP5NzLLfEo1p7rKSd0cWNXygKWql0qlWUTjjsBByNefLtSvJYdDKKpg1_bAD2sNR7dBYsJ9oTi9tlemW3a-4GSEZPwKbvpkqIRc24Owx7-Ikjb8StSV9VIar6bu8hOpVfvcza-h0R7LNE9QfckNsCb_jpXF55D8XuMwZR5gkZhzkyT6DOHFqR7LzX6LLQbpKrmyP1gRxw",
    "use": "sig"
  }


  return jwkToPem(jwk);

}

console.log("\n\n");
console.log(get_pem_from_url("us-east-2", "us-east-2_W8Y749Lm8"));
console.log("\n\n");


