const { OpenSSL } = require('../dist/openssl.cjs');
const { resolve } = require('path');
const fs = require('fs');

(async function () {
    let rootDir = resolve(__dirname, "../sandbox");
    let openSSL = new OpenSSL({ fs, rootDir });

    let result1 = await openSSL.runCommand("genrsa -out /private.pem");
    let result2 = await openSSL.runCommand("rsa -in /private.pem -pubout");
})();