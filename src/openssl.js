/**
 * ECMAScript Interface to WASM port of OpenSSL (https://www.openssl.org)
 * @module OpenSSL
 * 
 * @license Apache-2.0
 * @copyright 2019 DIGITALARSENAL.IO, INC.
 */

import { run } from "./command.js";
import { isNode } from "./isNode.js";

/* Default path to the WebAssembly file */
const wasmPath = "openssl.wasm";


/** Class representing an OpenSSL session */
export class OpenSSL {
  /**
   * Create an OpenSSL instance
   * @param {Object} args
   * @param {Object} fs - The file system object to use
   * @param {string} rootDir - The file system root path to use 
   */
  constructor(args) {
    if (!args) throw Error("Arguments Not Defined");

    if (!args.fs) throw Error("FileSystem Not Defined.");

    if (!args.rootDir) args.rootDir = "/";

    Object.assign(this, { ...args }, { wasmBinaryPath: wasmPath });

    const { readFileSync, mkdirSync, existsSync } = this.fs;

    this.runCommand = async command => {
      if (!existsSync(this.rootDir)) mkdirSync(this.rootDir);

      if (isNode) {
        const { fileURLToPath } = await import("url");
        const { dirname, resolve } = await import("path");
        const _filename = fileURLToPath(import.meta.url);
        const _dirname = dirname(_filename);
        const wasmBinary = readFileSync(
          resolve(_dirname, this.wasmBinaryPath)
        );
        return run({ command, wasmBinary, ...this });
      } else {
        let response;
        let responseArrayBuffer;
        if (args.wasmBinaryPath) {
          response = await fetch(args.wasmBinaryPath);
        }
        if (response && response.arrayBuffer) {
          responseArrayBuffer = await response.arrayBuffer();
        }
        const wasmBinary = new Uint8Array(responseArrayBuffer);
        if (wasmBinary.length) {
          return run({ command, wasmBinary, ...this });
        }
      }
    };
  }
}
