import { OpenSSL } from "../dist/browser.openssl.js";
import WasmFs from "./wasmfs.esm.js";
import openssl_cnf_js from './cert.test.js';
console.log(openssl_cnf_js);
const { fs } = new WasmFs();
window.fs = fs;

let openSSL = new OpenSSL({
  fs: fs,
  rootDir: "/"
});
fs.mkdirSync('/usr');
fs.mkdirSync('/usr/local');
fs.mkdirSync('/usr/local/ssl');
fs.writeFileSync('/usr/local/ssl/openssl.cnf', openssl_cnf_js);
(async function () {
  //let result1 = await openSSL.runCommand("req -out /CSR.csr -new -newkey rsa:2048 -nodes -keyout /privateKey.key");
  let result2 = await openSSL.runCommand(`
  req 
  -x509 
  -sha256 
  -nodes 
  -days 365 
  -newkey rsa:2048 
  -config /usr/local/ssl/openssl.cnf
  -keyout /privateKey.key 
  -out /certificate.crt`);
  window.errPipe = fs.createReadStream('/dev/stderr');
  window.outPipe = fs.createReadStream('/dev/stdout');
  window.errPipe.on('data', (data)=>{console.error(data.toString('utf8'))})
  window.outPipe.on('data', (data)=>{console.log(data.toString('utf8'))})

  console.log(fs.readdirSync('/'));
  console.log(fs.readFileSync('/certificate.crt', {encoding:'utf8'}));
})();


