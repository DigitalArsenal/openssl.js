#!/usr/bin/env sh

wasmer run openssl.wasm --dir=. -- genrsa -des3 -out priv.key 2048 || exit $?
