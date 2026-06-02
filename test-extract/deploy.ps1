# Deploy Test One website to VPS
# Requirements: OpenSSH client and the testone.pem key

$VPS_IP = "13.204.46.69"
$SSH_KEY = "testone.pem"

Write-Host "Deploying to VPS $VPS_IP..." -ForegroundColor Green

# Check if SSH key exists
if (-not (Test-Path $SSH_KEY)) {
    Write-Error "SSH key $SSH_KEY not found!"
    exit 1
}

# Set correct permissions for SSH key (required by OpenSSH)
icacls $SSH_KEY /inheritance:r /grant:r "$($env:USERNAME):(R)"

# 1. Copy project files to VPS using scp
Write-Host "Copying files to VPS..." -ForegroundColor Yellow

# Create a temporary archive
$tempArchive = "deploy-temp.zip"
if (Test-Path $tempArchive) { Remove-Item $tempArchive }

# Compress files excluding node_modules, .git, dist
$exclude = @('node_modules', '.git', 'dist', 'ai-builder-backend/node_modules')
$files = Get-ChildItem -Exclude $exclude
Compress-Archive -Path $files -DestinationPath $tempArchive -Force

# Upload the archive
scp -i $SSH_KEY -o StrictHostKeyChecking=no $tempArchive ubuntu@${VPS_IP}:~/

# 2. Run remote setup commands
Write-Host "Running remote setup..." -ForegroundColor Yellow
$remoteCommands = @"
set -e
cd ~
rm -rf test-one
unzip -q deploy-temp.zip -d test-one
cd test-one
rm ../deploy-temp.zip

echo "Setting up environment..."
cp .env.production .env

echo "Installing Node.js (20.x) if not present..."
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

echo "Installing PM2..."
if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm install -g pm2
fi

echo "Installing dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Stopping existing processes..."
pm2 delete testone-api 2>/dev/null || true
pm2 delete testone-frontend 2>/dev/null || true

echo "Starting backend API on port 3001..."
pm2 start server.js --name testone-api -- --port 3001

echo "Installing serve..."
if ! command -v serve >/dev/null 2>&1; then
  sudo npm install -g serve
fi

echo "Starting frontend on port 80..."
pm2 start serve --name testone-frontend -- -s dist -l 80

echo "Saving PM2 configuration..."
pm2 save
pm2 startup systemd

echo "Setup complete!"
"@

ssh -i $SSH_KEY -o StrictHostKeyChecking=no ubuntu@${VPS_IP} $remoteCommands

# Cleanup
if (Test-Path $tempArchive) { Remove-Item $tempArchive }

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Frontend: http://$VPS_IP/" -ForegroundColor Cyan
Write-Host "API: http://$VPS_IP:3001/" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
