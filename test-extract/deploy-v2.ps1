# Deploy Test One website to VPS - Improved version
$VPS_IP = "13.204.46.69"
$SSH_KEY = "testone.pem"

Write-Host "Deploying to VPS $VPS_IP..." -ForegroundColor Green

# Check if SSH key exists
if (-not (Test-Path $SSH_KEY)) {
    Write-Error "SSH key $SSH_KEY not found!"
    exit 1
}

# Set correct permissions for SSH key
icacls $SSH_KEY /inheritance:r /grant:r "$($env:USERNAME):(R)" | Out-Null

Write-Host "Step 1: Stopping services on VPS..." -ForegroundColor Yellow
$stopCommands = @"
pm2 delete testone-api 2>/dev/null || true
pm2 delete testone-frontend 2>/dev/null || true
echo "Services stopped"
"@
ssh -i $SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=10 ubuntu@${VPS_IP} $stopCommands 2>$null

Write-Host "Step 2: Creating and uploading deployment archive..." -ForegroundColor Yellow
$tempArchive = "deploy-temp.zip"
if (Test-Path $tempArchive) { Remove-Item $tempArchive -Force }

# Compress files excluding node_modules, .git
$exclude = @('node_modules', '.git', 'ai-builder-backend/node_modules', 'deploy-temp.zip')
$files = Get-ChildItem -Exclude $exclude | Select-Object -ExpandProperty FullName
Compress-Archive -Path $files -DestinationPath $tempArchive -Force

# Upload the archive
scp -i $SSH_KEY -o StrictHostKeyChecking=no $tempArchive ubuntu@${VPS_IP}:~/ 2>&1 | ForEach-Object { Write-Host $_ }

Write-Host "Step 3: Running remote setup..." -ForegroundColor Yellow
$remoteCommands = @'
set -e
cd ~

# Remove old directory and extract new one
rm -rf test-one-old
if [ -d "test-one" ]; then
    mv test-one test-one-old
fi
unzip -q deploy-temp.zip -d test-one
cd test-one
rm ../deploy-temp.zip

echo "Setting up environment..."
cp .env.production .env

echo "Installing dependencies..."
npm install 2>&1

echo "Removing old directory..."
rm -rf ~/test-one-old

echo "Starting services..."
pm2 delete testone-frontend 2>/dev/null || true
pm2 delete testone-api 2>/dev/null || true
sleep 2
pm2 start server.js --name testone-api -- --port 3001 2>&1
pm2 start serve --name testone-frontend -- -s dist -l 80 2>&1

echo "Saving PM2 configuration..."
pm2 save 2>&1

echo "Setup complete!"
'@

ssh -i $SSH_KEY -o StrictHostKeyChecking=no ubuntu@${VPS_IP} $remoteCommands 2>&1 | ForEach-Object { Write-Host $_ }

# Cleanup
if (Test-Path $tempArchive) { Remove-Item $tempArchive -Force }

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Frontend: http://$VPS_IP/" -ForegroundColor Cyan
Write-Host "API: http://${VPS_IP}:3001/" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
