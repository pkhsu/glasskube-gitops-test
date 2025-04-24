# 產品背景

## 此專案為何存在

此專案作為一個實用的範本，旨在加速採用使用 ArgoCD 和 Glasskube 的 GitOps 工作流程。主要目標是顯著減少通常與共同設定這些工具相關的初始設定時間和複雜性。

## 它解決的問題

-   **減少設定時間：** 提供一個立即可用的結構，將 ArgoCD 和 Glasskube 的整合時間從可能的數小時縮短到幾分鐘。
-   **簡化 GitOps 採用：** 提供一個清晰的範例，說明如何透過 GitOps 原則管理 Kubernetes 應用程式（特別是 Glasskube 套件）。
-   **展示 Glasskube 封裝：** 展示一個將現有 Kubernetes 應用程式（"shiori" 和 "sample-web-app"）轉換為 Glasskube 套件的具體範例，使其可在 ArgoCD 設定中透過 Glasskube 生態系統進行管理。

## 它應該如何運作

1.  儲存庫應包含 ArgoCD 管理叢集狀態所需的必要設定。
2.  Glasskube 應透過 ArgoCD 進行引導和管理。
3.  最初可能在 `apps/` 目錄中定義為原始清單或 Helm charts 的 "shiori" 和 "sample-web-app" 應用程式，應轉換為 Glasskube `Package` 資源。
4.  這些 Glasskube 套件應適當地儲存在儲存庫結構中（可能在 `packages/` 或類似的慣例下），並由 ArgoCD 管理。
5.  使用者應能夠複製此儲存庫，將設定應用到他們的叢集，並擁有一個包含 ArgoCD、Glasskube 和已封裝應用程式的正常運作的 GitOps 設定。
