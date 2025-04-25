# Glasskube GitOps 測試專案

本專案示範如何使用 Glasskube 打包和管理 Kubernetes 應用程式。

## 專案結構

- **apps/** - 包含原始的應用程式定義
  - **shiori/** - Shiori 書籤管理應用的 Kubernetes 清單檔
  - **sample-web-app/** - 範例 Web 應用及其 Helm chart

- **glasskube-packages/** - Glasskube 套件定義
  - **packages/** - 包含 Glasskube 套件的定義檔

## 啟動套件庫伺服器

使用 Docker (推薦):
```bash
./docker-caddy.sh
```

## 詳細使用指南

請參閱 [使用指南](USAGE-GUIDE.md) 獲取完整的使用說明和範例。

## 特色

- 使用相對路徑直接引用原始應用程式檔案
- 避免檔案複製，提高維護效率
- 支援 Docker 方式啟動靜態檔案伺服器
- 完整支援 Kubernetes 清單檔和 Helm chart
