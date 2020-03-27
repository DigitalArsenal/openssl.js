import { OpenSSL } from "../dist/browser.openssl.js";
import WasmFs from "./wasmfs.esm.js";
import openssl_cnf_js from "./cert.test.js";
console.log(openssl_cnf_js);
const { fs } = new WasmFs();
window.fs = fs;

let openSSL = new OpenSSL({
  fs: fs,
  rootDir: "/"
});
fs.mkdirSync("/usr");
fs.mkdirSync("/usr/local");
fs.mkdirSync("/usr/local/ssl");
fs.writeFileSync("/usr/local/ssl/openssl.cnf", openssl_cnf_js);
(async function() {
  await openSSL.runCommand(
    `ecparam 
    -name secp256k1 
    -genkey 
    -noout 
    -out /secp256k1-key.pem`
  );
  await openSSL.runCommand(
    `req 
    -config /usr/local/ssl/openssl.cnf
  `
  );
  window.errPipe = fs.createReadStream("/dev/stderr");
  window.outPipe = fs.createReadStream("/dev/stdout");
  window.errPipe.on("data", data => {
    console.log(data.toString("utf8"));
  });
  window.outPipe.on("data", data => {
    console.log(data.toString("utf8"));
  });

  console.log(fs.readdirSync("/"));
})();
