#!/bin/bash
cd ~
pm2 delete testone-frontend 2>/dev/null
pm2 delete testone-api 2>/dev/null
cd ~/test-one-new
pm2 start server.js --name testone-api -- --port 3001
pm2 start serve --name testone-frontend -- -s dist -l 80
pm2 save
