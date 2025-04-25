# Glasskube Package Repository 使用指南

本指南說明如何使用我們的 Glasskube 套件庫，包含 Shiori 和 Sample Web App 兩個應用程式。

## 快速開始

### 1. 啟動套件庫伺服器

您可以選擇以下兩種方式之一啟動套件庫伺服器：

#### 方式 A: 使用 Docker (推薦)

如果您已安裝 Docker，可以使用提供的 Docker 腳本啟動 Caddy 服務：

```bash
./docker-caddy.sh
```

這會使用 Docker 容器啟動 Caddy 伺服器，不需要在本機安裝任何其他軟體。

#### 方式 B: 使用本機安裝的 Python

如果您的系統已安裝 Python，可以使用 Python 的內建 HTTP 伺服器：

```bash
# 在項目根目錄執行
python3 -m http.server 9684
```

無論使用哪種方式，伺服器都會在 http://localhost:9684 啟動，提供對所有檔案的訪問。

### 2. 添加套件庫到 Glasskube

```bash
glasskube repo add local-repo http://localhost:9684/glasskube-packages/packages
```

### 3. 列出可用套件

```bash
glasskube list --repo local-repo
```

你應該能看到兩個套件：`shiori` 和 `sample-web-app`。

## 安裝套件

### 安裝 Shiori

基本安裝：

```bash
glasskube install shiori --repo local-repo
```

自定義參數安裝：

```bash
glasskube install shiori --repo local-repo \
  --value hostname=shiori.example.com \
  --value replicas=2 \
  --value storageSize=2Gi
```

### 安裝 Sample Web App

基本安裝：

```bash
glasskube install sample-web-app --repo local-repo
```

啟用 Ingress：

```bash
glasskube install sample-web-app --repo local-repo \
  --value ingressEnabled=true \
  --value ingressHost=webapp.example.com \
  --value replicaCount=3
```

## 訪問應用程式

安裝後，可以使用以下命令打開應用程式：

```bash
# 打開 Shiori Web UI
glasskube open shiori

# 打開 Sample Web App
glasskube open sample-web-app
```

## 管理套件

### 查看已安裝套件

```bash
glasskube list -i
```

### 更新套件

```bash
glasskube update shiori
```

### 卸載套件

```bash
glasskube uninstall shiori
```

## 目錄結構說明

本專案使用直接引用原始檔案的方式，減少重複檔案：

- `/apps/shiori/` - Shiori 的原始 Kubernetes 清單檔
- `/apps/sample-web-app/chart/` - Sample Web App 的原始 Helm chart
- `/glasskube-packages/packages/` - Glasskube 套件定義

這種架構的優點是只需要維護一份檔案，減少同步的負擔。

## 故障排除

如果遇到問題：

1. 確認靜態伺服器是從專案根目錄啟動的，而不是從 `glasskube-packages` 子目錄
2. 確認 URL 路徑正確：`http://localhost:9684/glasskube-packages/packages`
3. 檢查 `package.yaml` 中的 URL 是否正確指向 `/apps/` 目錄中的檔案
4. 如果使用 Docker 版本的啟動腳本，請確保 Docker 已安裝並正在運行 