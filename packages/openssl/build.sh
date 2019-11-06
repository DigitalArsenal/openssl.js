#!/usr/bin/env sh

# Based on code from https://github.com/TrueBitFoundation/wasm-ports/blob/master/openssl.sh

OPENSSL_VERSION=1.1.1d
PREFIX=`pwd`

DIRECTORY="openssl-${OPENSSL_VERSION}"

if [ ! -d "$DIRECTORY" ]; then
  echo "Download source code"
  curl https://www.openssl.org/source/openssl-${OPENSSL_VERSION}.tar.gz -o openssl-${OPENSSL_VERSION}.tar.gz
  tar xf openssl-${OPENSSL_VERSION}.tar.gz
fi

cd patch-${OPENSSL_VERSION}
find . -type f | cpio -pvduml ../openssl-${OPENSSL_VERSION}
cd ../openssl-${OPENSSL_VERSION}

echo "Configure"
make clean

wasiconfigure ./Configure gcc -no-tests -no-asm -static -no-sock -no-afalgeng -DOPENSSL_SYS_NETWARE -DSIG_DFL=0 -DSIG_IGN=0 -DHAVE_FORK=0 -DOPENSSL_NO_AFALGENG=1 --with-rand-seed=getrandom || exit $?
sed -i -e "s/CNF_EX_LIBS=/CNF_EX_LIBS=-lwasi-emulated-mman /g" Makefile
make apps/progs.h

sed -i 's|^CROSS_COMPILE.*$|CROSS_COMPILE=|g' Makefile

echo "Build"
wasimake make -j12 build_generated libssl.a libcrypto.a apps/openssl

rm -rf ${PREFIX}/include
mkdir -p ${PREFIX}/include
cp -R include/openssl ${PREFIX}/include

cp -R apps/openssl.wasm ../openssl.wasm

# echo "Generate libraries .wasm files"
# wasicc libcrypto.a -o ${PREFIX}/libcrypto.wasm
# wasicc libssl.a -o ${PREFIX}/libssl.wasm

# echo "Link"
# wasicc apps/*.o libssl.a libcrypto.a \
#   -o ${PREFIX}/openssl.wasm

# chmod +x ${PREFIX}/openssl.wasm || exit $?

echo "Done"
