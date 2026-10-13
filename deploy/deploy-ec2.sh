#!/usr/bin/env bash
set -e

# ==============================================================================
# Automated Deployment Script for AWS EC2 (Ubuntu 22.04 / 24.04 LTS)
# ==============================================================================

echo "==> [1/5] Updating system packages and installing prerequisites..."
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release git

echo "==> [2/5] Installing Docker and Docker Compose plugin..."
if ! command -v docker &> /dev/null; then
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo usermod -aG docker "$USER"
    echo "Docker installed successfully."
fi

echo "==> [3/5] Setting up environment variables..."
if [ ! -f .env ]; then
    echo "Copying .env.example to .env..."
    cp .env.example .env
    echo "NOTE: Remember to edit .env with secure production passwords!"
fi

echo "==> [4/5] Building and launching multi-container application..."
docker compose down --remove-orphans || true
docker compose up -d --build

echo "==> [5/5] Verification and healthchecks..."
docker compose ps

echo "=============================================================================="
echo "Deployment successful!"
echo "React Frontend:  http://$(curl -s ifconfig.me):3000"
echo "FastAPI Backend: http://$(curl -s ifconfig.me):8000/api/v1/docs"
echo "MySQL Admin:     http://$(curl -s ifconfig.me):8081"
echo "=============================================================================="
