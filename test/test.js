import { OpenSSL } from "../dist/openssl.js";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import WFS from "@wasmer/wasmfs";
import path from "path";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async function() {
  let rootDir = path.resolve(__dirname, "../sandbox");
  let openSSL = new OpenSSL({ fs, rootDir });

  let result1 = await openSSL.runCommand("genrsa -out /private.pem");
  let result2 = await openSSL.runCommand("rsa -in /private.pem -pubout");
})();
