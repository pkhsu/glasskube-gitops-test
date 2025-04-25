# 專案簡介：Glasskube 套件庫

## 核心目標
- 為 Shiori 和 Sample Web App 應用程式創建 Glasskube 套件庫
- 實現避免重複檔案並簡化維護的結構
- 使用 GitHub raw URLs 實現套件的簡易分享和部署

## 主要需求
- 將 Shiori 打包為基於 Kubernetes 清單的 Glasskube 套件
- 將 Sample Web App 打包為基於 Helm 的 Glasskube 套件
- 使用對原始檔案的直接引用，避免重複
- 提供基於 GitHub raw URLs 的解決方案，無需本地伺服器
- 創建使用和擴展套件庫的文檔

## 成功標準
- 兩個應用程式的工作 Glasskube 套件定義
- 能夠通過 Glasskube CLI 從 GitHub 安裝套件
- 清晰的目錄結構，最小化維護開銷
- 文檔完善的測試和擴展流程

使用此儲存庫作為範本，即可在幾分鐘內（而非數小時）開始使用 ArgoCD 和 Glasskube。
在我們的 GitOps 範本中，我們說明了如何使用 `glasskube bootstrap git` 指令將 Glasskube 與 ArgoCD 一起設定。

如果您偏好不同的 GitOps 工具或需要更客製化的解決方案，可以使用 `glasskube bootstrap --dry-run -o yaml` 來產生 Glasskube 清單，並將其放入您的 GitOps 儲存庫中。

我的目標是把 'apps/' (參見下方的資料夾內容) 中的 "shiori" & "sample-web-app" 這兩個應用，製作成讓 glasskube 管理的 package 資源。

## 資料夾內容 (apps/)

```
apps/
├── sample-web-app/
└── shiori/
