#!/usr/bin/env bash
set -euo pipefail

cat payload/part00.txt payload/part01.txt payload/part02.txt payload/part03.txt payload/part04.txt > site-source.b64
base64 --decode site-source.b64 > site-source.tar.gz
tar -xzf site-source.tar.gz
rm -f site-source.b64 site-source.tar.gz
rm -rf payload
npm install
npm run typecheck
npm run build

echo "Website source unpacked and production build passed."
