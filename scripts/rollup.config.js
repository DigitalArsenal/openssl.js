import brotli from "rollup-plugin-brotli";
import builtins from "rollup-plugin-node-builtins";
import commonjs from "rollup-plugin-commonjs";
import fs from 'fs';
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import url from "rollup-plugin-url";


let wasmb64 = fs.readFileSync('./src/openssl.wasm').toString('base64');

fs.writeFileSync('./dist/openssl.b64.wasm', wasmb64);
let replacr = (line, replacement, debug) => {

  return {
    transform(code, id) {

      code = code.replace(line, replacement);

      return { code };
    }
  }
}

const plugins = [
  replacr(/const wasmBinary [^;]{1,};/, ``),
  replacr(/const wasmPath[^;]{1,};/, `
  const wasmPath = null; 
  let wasmBinary;
  let wasmb64 = "${wasmb64}";
  if(isNode){
    wasmBinary = Buffer.from(wasmb64, 'base64');
  }else{
    let raw = window.atob(wasmb64);
    let rawLength = raw.length;
    let array = new Uint8Array(new ArrayBuffer(rawLength));
    for(let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    wasmBinary = array;
  }
  `),
  resolve(),
  commonjs(),
  builtins({ preferBuiltins: true }),
  url({
    limit: 1e35,
    include: ["**/*.wasm"],
    emitFiles: true
  }),
  //terser(),
  //brotli()
];
const external = ["child_process", "url", "fs", "crypto", "tty", "path"];
export default [
  {
    input: "./src/openssl.js",
    output: {
      file: "./dist/browser.openssl.js",
      format: "esm"
    },
    plugins: [
      replacr(/const wasmBinary[^;]{1,};/, ``),
      replacr(/import[\s\S]{1,}@wasmer\/wasi["'`];[^;]{1,};/, `import WASI from "@wasmer/wasi";`),
      ...plugins
    ],
    external
  },
  {
    input: "./src/openssl.js",
    output: {
      file: "./dist/openssl.js",
      format: "esm"
    },
    plugins: [
      replacr(/import[\s\S]{1,}@wasmer\/wasi["'`];[^;]{1,};/, `import WASI from "@wasmer/wasi/lib/index.cjs";`, true),
      ...plugins
    ],
    external
  },
  {
    input: "./src/openssl.js",
    output: {
      file: "./dist/openssl.cjs",
      format: "cjs"
    },
    plugins: [
      replacr(/import[\s\S]{1,}@wasmer\/wasi["'`];[^;]{1,};/, `import WASI from "@wasmer/wasi/lib/index.cjs";`, true),
      ...plugins
    ],
    external
  }
];
