import { OpenSSL } from "../dist/openssl.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async function() {
  let rootDir = path.resolve(__dirname, "../sandbox");
  let openSSL = new OpenSSL({ fs, rootDir });

  let result1 = await openSSL.runCommand("genrsa -out /private.pem");
  let result2 = await openSSL.runCommand("rsa -in /private.pem -pubout");
})();
