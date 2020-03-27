import wasmTransformer from "@wasmer/wasm-transformer";
import { basename } from "path";
import optimist from "optimist";
import fs from "fs";

let { argv } = optimist;

const wasmBinary = fs.readFileSync(argv.src);
let transformed = wasmTransformer.lowerI64Imports(wasmBinary);
fs.writeFileSync(argv.out, transformed);
