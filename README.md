# OpenSSL.js
  
![npm](https://img.shields.io/npm/v/openssl.js)
![dependencies](https://img.shields.io/david/digitalarsenal/openssl.js)

### A WebAssembly port of OpenSSL for [node](https://nodejs.org) and the browser.



Quick Start
=

#### ES6 Module (main)
```javascript
import { OpenSSL } from "../dist/openssl.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);

(async function() {
  let rootDir = path.resolve(__dirname, "./sandbox");
  let openSSL = new OpenSSL({ fs, rootDir });

  let result1 = await openSSL.runCommand("genrsa -out /private.pem");
  let result2 = await openSSL.runCommand("rsa -in /private.pem -pubout");
})();
```

Installation
=

OpenSSL.js is available through [npm](https://www.npmjs.com/package/openssl.js)
```
npm install openssl.js
```



Examples
=
### CJS
```javascript
const { OpenSSL } = require('../dist/openssl.cjs.js');
const { resolve } = require('path');
const fs = require('fs');

(async function () {
    let rootDir = resolve(__dirname, "./sandbox");
    let openSSL = new OpenSSL({ fs, rootDir });

    let result1 = await openSSL.runCommand("genrsa -out /private.pem");
    let result2 = await openSSL.runCommand("rsa -in /private.pem -pubout");
})();
```

### Browser
```javascript
import { OpenSSL } from "../dist/browser.openssl.js";
/** @wasmer/wasmfs */
import WasmFs from "./wasmfs.esm.js";

const wasmFs = new WasmFs();

(async function() {
  let openSSL = new OpenSSL({
    fs: wasmFs.fs,
    rootDir: "/",
    wasmBinaryPath: "../dist/openssl.wasm"
  });

  let result1 = await openSSL.runCommand(
    "genpkey -algorithm Ed25519 -out /private.pem"
  );
  let pK = wasmFs.fs.readFileSync("/private.pem", { encoding: "utf8" });
  console.log(pK);
  document.body.innerText = pK;
})();
```
