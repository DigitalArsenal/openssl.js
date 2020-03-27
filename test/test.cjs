const { OpenSSL } = require("../dist/openssl.cjs");
const { resolve } = require("path");
const fs = require("fs");

const output = (result, cb) => {
  let _stdout = "";
  let _stderr = "";
  result.stdout.on("data", d => {
    _stdout += d.toString();
  });
  result.stderr.on("data", d => {
    _stderr += d.toString();
  });
  result.on("exit", () => {
    if (cb) cb();
    console.log("stdout", _stdout);
    console.log("stderr", _stderr);
  });
};

(async function() {
  let rootDir = resolve(__dirname, "../sandbox");
  let openSSL = new OpenSSL({ fs, rootDir });

  let result1 = await openSSL.runCommand("genrsa -out /private.pem");
  output(result1, async function() {
    let result2 = await openSSL.runCommand("rsa -in /private.pem -pubout");
    output(result2);
  });
})();
