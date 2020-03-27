/**
 * ECMAScript Interface to WASM port of OpenSSL (https://www.openssl.org)
 * @module OpenSSL
 * 
 * @license Apache-2.0
 * @copyright 2019 DIGITALARSENAL.IO, INC.
 */

import _WASI from "@wasmer/wasi";
const WASI = isNode ? _WASI.WASI : _WASI; //module issue
import { isNode } from "./isNode.js";

export const run = async args => {
  let _filename;
  try {
    _filename = __filename
  } catch (e) {

  }
  if (isNode && !_filename) {
    const { fileURLToPath } = await import("url"); //SyntaxError: Parenthesized pattern ({fileURLToPath})
    _filename = fileURLToPath(import.meta.url);
  }

  let command = ["openssl"].concat(
    args.command.split(/[\s]{1,}/g).filter(Boolean)
  );

  if (!isNode || (isNode && process.env.WORKER)) {
    let { fs, rootDir, env, wasmBinary } = args;
    let wasi = new WASI({
      args: command,
      env: env,
      preopenDirectories: {
        "/": rootDir
      },
      bindings: {
        ...WASI.defaultBindings,
        fs
      }
    });

    let { instance } = await WebAssembly.instantiate(wasmBinary, {
      wasi_unstable: wasi.wasiImport
    });

    try {
      wasi.start(instance);
    } catch (e) { }
  } else {
    const { wasmBinary, ...envArgs } = args;
    const { fork } = await import("child_process");
    let cp = fork(_filename, {
      silent: false,
      env: {
        args: JSON.stringify(envArgs),
        WORKER: true
      }
    });

    cp.on('error', () => {
      console.error('no wasm')
    });

    cp.send({ wasmBinary: wasmBinary });
    return new Promise((resolve, reject) => {
      cp.on("exit", code => {
        resolve(code);
      });
    });
  }
};

if (isNode && process.env.WORKER) {
  const args = JSON.parse(process.env.args);
  process.on("message", async ipc => {
    if (ipc.wasmBinary.type === "Buffer") {
      args.wasmBinary = Buffer.from(ipc.wasmBinary.data);
    } else {
      throw Error(`${new Date().toISOString()} Invalid Wasm Binary Format.`);
    }
    args.fs = await import("fs"); //In Node
    run(args);
  });
}
