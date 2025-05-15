# 專案簡介：Glasskube 套件庫

> **狀態說明**：本專案已完成 Phase 1，程式碼穩定並標記 1.0.1 版本，近期暫無新開發計畫。未來如需繼續，請參考 memory-bank/activeContext.md。

## 專案階段
### Phase 1 - 基礎套件庫實作 (已完成)
- 為 Shiori 和 Sample Web App 應用程式創建 Glasskube 套件庫
- 實現避免重複檔案並簡化維護的結構
- 使用 GitHub raw URLs 實現套件的簡易分享和部署

### Phase 2 - 使用者故事驗證與評估 (進行中)
- 驗證 Glasskube 在 MicroK8s Edge 設備上的基本套件管理能力
- 評估 Glasskube 的離線/本地部署能力
- 比較 Glasskube 與 Helm/Kustomize 在 Edge 場景的適用性

## 主要需求
- 將 Shiori 打包為基於 Kubernetes 清單的 Glasskube 套件
- 將 Sample Web App 打包為基於 Helm 的 Glasskube 套件
- 使用對原始檔案的直接引用，避免重複
- 提供基於 GitHub raw URLs 的解決方案，無需本地伺服器
- 創建使用和擴展套件庫的文檔
- 評估 MicroK8s 環境中的資源消耗情況
- 探索並實作離線部署能力
- 提供 Edge 場景套件管理工具比較分析

## 成功標準
### Phase 1
- 兩個應用程式的工作 Glasskube 套件定義
- 能夠通過 Glasskube CLI 從 GitHub 安裝套件
- 清晰的目錄結構，最小化維護開銷
- 文檔完善的測試和擴展流程

### Phase 2
- Glasskube 在 MicroK8s 上的完整功能驗證報告，包含資源消耗數據
- 實作或評估 Glasskube 離線部署方案
- 在 Edge 場景中 Glasskube 與 Helm/Kustomize 的比較分析

## 使用者故事
本專案包含三個主要使用者故事：

### US-ENG-POC-001: 驗證 Glasskube 在 MicroK8s 上的基本套件管理能力
驗證 Glasskube 作為 Edge device 本地套件管理工具的基本可行性，包括安裝、升級、查詢與移除功能。

### US-ENG-POC-004: 驗證 Glasskube 的離線/本地部署能力
驗證在無法連接中央平台或網路隔離情況下的部署方案，包括打包、傳輸與安裝離線套件。

### US-ENG-POC-005: 初步比較 Glasskube 與 Helm/Kustomize 在 Edge 場景的適用性
分析與比較不同套件管理工具在 Edge Computing 場景下的優缺點，為技術選型提供依據。

使用此儲存庫作為範本，即可在幾分鐘內（而非數小時）開始使用 ArgoCD 和 Glasskube。
在我們的 GitOps 範本中，我們說明了如何使用 `glasskube bootstrap git` 指令將 Glasskube 與 ArgoCD 一起設定。

如果您偏好不同的 GitOps 工具或需要更客製化的解決方案，可以使用 `glasskube bootstrap --dry-run -o yaml` 來產生 Glasskube 清單，並將其放入您的 GitOps 儲存庫中。

我的目標是把 'apps/' (參見下方的資料夾內容) 中的 "shiori" & "sample-web-app" 這兩個應用，製作成讓 glasskube 管理的 package 資源。

## 資料夾內容 (apps/)

```
apps/
├── sample-web-app/
└── shiori/
