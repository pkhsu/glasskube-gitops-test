# Glasskube Package Repository 使用指南

本指南說明如何使用我們的 Glasskube 套件庫，包含 Shiori 和 Sample Web App 兩個應用程式。

## 快速開始

### 1. 添加套件庫到 Glasskube

```bash
glasskube repo add github-repo https://raw.githubusercontent.com/pkhsu/glasskube-gitops-test/main/glasskube-packages/packages
```

### 2. 列出可用套件

```bash
glasskube list --repo github-repo
```

你應該能看到兩個套件：`shiori` 和 `sample-web-app`。

## 安裝套件

### 安裝 Shiori

基本安裝：

```bash
glasskube install shiori --repo github-repo
```

自定義參數安裝：

```bash
glasskube install shiori --repo github-repo \
  --value hostname=shiori.example.com \
  --value replicas=2 \
  --value storageSize=2Gi
```

### 安裝 Sample Web App

基本安裝：

```bash
glasskube install sample-web-app --repo github-repo
```

啟用 Ingress：

```bash
glasskube install sample-web-app --repo github-repo \
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

本專案使用 GitHub raw 連結直接引用原始檔案，減少重複檔案：

- GitHub 上的 `apps/shiori/` - Shiori 的原始 Kubernetes 清單檔
- GitHub 上的 `apps/sample-web-app/chart/` - Sample Web App 的原始 Helm chart
- GitHub 上的 `glasskube-packages/packages/` - Glasskube 套件定義

這種架構的優點是：
1. 只需要維護一份檔案，減少同步的負擔
2. 不需要本地檔案伺服器，可直接從 GitHub 獲取檔案
3. 可以輕鬆共享和分發套件庫

## 故障排除

如果遇到問題：

1. 確認您已正確添加 GitHub 套件庫：`https://raw.githubusercontent.com/pkhsu/glasskube-gitops-test/main/glasskube-packages/packages`
2. 確認 GitHub 儲存庫是公開的，以便 Glasskube 能夠訪問檔案
3. 檢查 `package.yaml` 中的 URL 是否正確指向 GitHub raw 內容 