#!/bin/bash

# 簡單的 Docker Caddy 伺服器啟動腳本
echo "Starting Caddy server in Docker container..."
echo "Access the repository at: http://localhost:9684/glasskube-packages/packages"
echo "Press Ctrl+C to stop the server"

# 使用 Docker 啟動 Caddy 伺服器
docker run --rm -it \
  -v "$(pwd):/srv" \
  -p 9684:80 \
  caddy:2-alpine \
  caddy file-server --root /srv --listen :80 