import { run } from "./command.js";
import { isNode } from "./isNode.js";

const wasmPath = "openssl.wasm";

export class OpenSSL {
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
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const wasmBinary = readFileSync(
          resolve(__dirname, this.wasmBinaryPath)
        );
        return run({ command, wasmBinary, ...this });
      } else {
        const response = await fetch(args.wasmBinaryPath);
        const responseArrayBuffer = await response.arrayBuffer();
        const wasmBinary = new Uint8Array(responseArrayBuffer);
        return run({ command, wasmBinary, ...this });
      }
    };
  }
}
