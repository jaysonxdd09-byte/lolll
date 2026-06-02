#!/bin/bash
# Deploy Test One website to a remote VPS
# Requirements: you have the SSH private key testone.pem in the project root.
# Usage: ./deploy.sh

set -e

echo "Deploying to VPS 13.204.46.69..."

# 1. Copy the project files to the VPS (excluding node_modules, .git)
rsync -avz -e "ssh -i testone.pem" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='dist' \
  --exclude='ai-builder-backend/node_modules' \
  ./ ubuntu@13.204.46.69:~/test-one/ || { echo "RSYNC failed"; exit 1; }

# 2. Run remote setup commands via SSH
ssh -i testone.pem ubuntu@13.204.46.69 << 'EOF'
set -e
cd ~/test-one

echo "Setting up environment..."
# Copy production env to .env
cp .env.production .env

# Install Node.js (20.x) if not present
if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# Install PM2 globally to manage processes
if ! command -v pm2 >/dev/null 2>&1; then
  echo "Installing PM2..."
  sudo npm install -g pm2
fi

# Install project dependencies
echo "Installing dependencies..."
npm install

# Build the frontend with production environment
echo "Building frontend..."
npm run build

# Stop existing PM2 processes if any
pm2 delete testone-api 2>/dev/null || true
pm2 delete testone-frontend 2>/dev/null || true

# Start the backend API (server.js) on port 3001
echo "Starting backend API..."
pm2 start server.js --name testone-api -- --port 3001

# Install serve if not present
if ! command -v serve >/dev/null 2>&1; then
  echo "Installing serve..."
  sudo npm install -g serve
fi

# Serve the static files on port 80
echo "Starting frontend..."
pm2 start serve --name testone-frontend -- -s dist -l 80

# Save PM2 process list for automatic startup on reboot
pm2 save
pm2 startup systemd

echo "Setup complete!"
EOF

echo ""
echo "========================================"
echo "Deployment complete!"
echo "Frontend: http://13.204.46.69/"
echo "API: http://13.204.46.69:3001/"
echo "========================================"
