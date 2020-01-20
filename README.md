# OpenSSL.js
  
![npm](https://img.shields.io/npm/v/openssl.js)
![dependencies](https://img.shields.io/david/digitalarsenal/openssl.js)

### A WebAssembly port of [OpenSSL](https://openssl.org) for [node](https://nodejs.org) and the browser.

## LICENSE: [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## NOTE:  
This is a source-code build of [OpenSSL](https://openssl.org) using the [wasienv toolchain](https://github.com/wasienv/wasienv).  The test suite is still under development.  Until it is complete, the author makes no claims concerning accuracy or security.  Use at your own risk.

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

Usage
=
The main export exposes the OpenSSL class; the constructor takes two arguments in an args object:
- `fs`:  Use either the node builtin [fs](https://nodejs.org/dist/latest-v13.x/docs/api/fs.html) or an API compatible version like [@wasmer/wasmfs](https://github.com/wasmerio/wasmer-js/tree/master/packages/wasmfs) (which uses [memfs](https://github.com/streamich/memfs)), or [BrowserFS](https://github.com/jvilk/BrowserFS)
- `rootDir`: The path in the file system to map to the root (`/`) of the OpenSSL.js instance to use for file IO

The instance exposes a single method, `runCommand`, which accepts a string containing commands to be run against the [OpenSSL command line interface](https://www.openssl.org/docs/man1.1.1/).


Examples
=
### CJS
```javascript
const { OpenSSL } = require('../dist/openssl.cjs');
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
