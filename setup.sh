#!/bin/bash
cd ~
pm2 stop testone-frontend 2>/dev/null
pm2 stop testone-api 2>/dev/null
rm -rf test-one-new
mkdir test-one-new
cd test-one-new
unzip -q ../deploy-temp.zip
ls -la dist/assets/
echo "Setup complete"
