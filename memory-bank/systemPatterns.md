# 系統模式 (System Patterns)

## 系統架構

核心架構遵循 GitOps 模式，其中 Git 儲存庫 (`glasskube-gitops-test`) 作為 Kubernetes 叢集期望狀態的單一真實來源。

```mermaid
graph TD
    A[Git 儲存庫 (glasskube-gitops-test)] --> B(ArgoCD);
    B --> C{Kubernetes 叢集};
    C --> D[Glasskube 控制器];
    D --> E[受控套件 (例如 Shiori, Sample Web App)];
    B --> F[其他資源 (命名空間等)];

    subgraph Git 儲存庫
        direction LR
        G[bootstrap/]
        H[apps/]
        I[packages/]
        J[memory-bank/]
    end

    A -- 管理 --> I;
    A -- 包含原始檔 --> H;
    A -- 包含引導檔 --> G;
    A -- 包含文件 --> J;

    style B fill:#f9f,stroke:#333,stroke-width:2px
    style D fill:#ccf,stroke:#333,stroke-width:2px
```

## 關鍵技術決策

-   **GitOps 引擎：** 使用 ArgoCD 持續監控 Git 儲存庫並協調叢集狀態。
-   **套件管理：** 採用 Glasskube 在叢集中管理應用程式套件，簡化安裝、更新和依賴管理。Glasskube 本身透過 ArgoCD 進行引導和管理。
-   **應用程式定義：** 目標應用程式 ("shiori", "sample-web-app") 將被定義為 Glasskube `Package` 或 `ClusterPackage` 資源，並在 Git 儲存庫中以宣告方式管理。

## 使用中的設計模式

-   **GitOps：** 整個系統設定和應用程式部署生命週期透過 Git 提交和拉取請求進行管理。
-   **宣告式設定：** Kubernetes 資源，包括 ArgoCD 應用程式和 Glasskube 套件，都以儲存在 Git 中的 YAML 清單進行宣告式定義。
-   **控制器模式：** ArgoCD 和 Glasskube 都使用控制器運作，這些控制器監看自訂資源，並根據這些資源中定義的期望狀態採取行動。

## 元件關係

-   **ArgoCD：** 監看 `bootstrap/glasskube/applicationset.yaml` (可能) 以管理 Glasskube 安裝本身，以及可能指向 `packages/` 等目錄的其他 `Application` 資源。
-   **Glasskube 控制器：** 在叢集中運行，監看由 ArgoCD 應用的 `Package` / `ClusterPackage` 資源，並管理底層應用程式元件（部署、服務等）的生命週期。
-   **應用程式清單 (`apps/`)：** 目前存放 "shiori" 和 "sample-web-app" 的來源清單/charts。這些將作為建立 Glasskube 套件的基礎。
-   **Glasskube 套件 (`packages/`)：** 此目錄是 "shiori" 和 "sample-web-app" 的新 Glasskube `Package` / `ClusterPackage` 清單的可能目標位置。現有套件 (argo-cd, cloudnative-pg, kube-prometheus-stack) 已存在於此，表明這是一種模式。

## 關鍵實施路徑

1.  **Glasskube 引導：** 確保 Glasskube 正確安裝並由 ArgoCD 管理（可能透過 `bootstrap/glasskube/glasskube.yaml` 和相關的 ApplicationSet）。
2.  **套件建立：** 將 `apps/` 中的現有應用程式定義轉換為有效的 Glasskube `Package` 或 `ClusterPackage` 清單。這需要理解 Glasskube 所需的結構。
3.  **ArgoCD 應用程式設定：** 確保 ArgoCD 配置為能夠找到並管理新建立的 Glasskube 套件清單（可能透過更新 ApplicationSet 或建立新的 Application 資源）。
