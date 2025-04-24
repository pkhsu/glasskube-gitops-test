# 當前情境 (Active Context)

## 目前焦點

Memory Bank 初始化與翻譯已完成。目前的主要焦點是執行已確定的計畫，將 `apps/` 目錄中的 "shiori" 和 "sample-web-app" 應用程式轉換為 Glasskube `ClusterPackage` 資源。

## 最近變更

-   建立了所有核心 Memory Bank 檔案 (`projectbrief.md`, `productContext.md`, `activeContext.md`, `systemPatterns.md`, `techContext.md`, `progress.md`)。
-   將所有核心 Memory Bank 檔案翻譯成繁體中文。
-   與使用者討論並最終確定了應用程式轉換計畫：
    -   `shiori`: 嵌入 YAML 清單。
    -   `sample-web-app`: 打包 Helm chart，由使用者上傳至外部 Helm Registry，然後在 `ClusterPackage` 中引用該 Registry。
-   更新 Memory Bank (`activeContext.md`, `progress.md`) 以包含詳細的任務列表和進度追蹤。
-   完成階段 1：建立 Shiori 套件。

## 後續步驟 (任務列表與進度)

**總體進度：25%**

*   **階段 1: 建立 Shiori 套件 (100%)**
    *   [x] 任務 1.1: 建立目錄 `packages/shiori/`。(已由任務 1.3 隱含完成)
    *   [x] 任務 1.2: 讀取 `apps/shiori/` 中的所有 YAML 清單檔案內容。
    *   [x] 任務 1.3: 建立 `packages/shiori/clusterpackage.yaml`，定義 `ClusterPackage` 並使用 `spec.manifests` 嵌入任務 1.2 的清單內容。
*   **階段 2: 處理 Sample Web App Helm Chart (0%)**
    *   [ ] 任務 2.1: 使用 `helm package` 指令打包 `apps/sample-web-app/chart/` 為 `.tgz` 檔案。
    *   [ ] **(使用者)** 任務 2.2: 上傳 `.tgz` 檔案至 Helm Registry 並提供 Registry URL、Chart 名稱和版本。
*   **階段 3: 建立 Sample Web App 套件 (0%)**
    *   [ ] 任務 3.1: 建立目錄 `packages/sample-web-app/`。
    *   [ ] 任務 3.2: 根據使用者提供的資訊，建立 `packages/sample-web-app/clusterpackage.yaml`，定義 `ClusterPackage` 並使用 `spec.helm` 引用 Helm Registry 中的 Chart。
*   **階段 4: 驗證與完成 (0%)**
    *   [ ] 任務 4.1: (隱含) 確認 ArgoCD ApplicationSet 能偵測到 `packages/` 中的新套件。
    *   [ ] 任務 4.2: 最終 Memory Bank 更新。
    *   [ ] 任務 4.3: 提交最終成果 (`attempt_completion`)。

## 當前決策與考量

-   Memory Bank 結構遵循指定的層次結構。
-   所有 Memory Bank 檔案均使用 Markdown 格式和繁體中文。
-   最終計畫已確定：`shiori` 使用嵌入式 manifests，`sample-web-app` 使用外部 Helm Registry。
-   執行流程依賴使用者在階段 2 完成 Helm chart 的上傳並提供必要資訊。

## 重要模式與偏好

-   在 Memory Bank 中保持清晰簡潔的文件記錄。
-   遵循指定的 Memory Bank 結構和更新流程。
-   優先使用繁體中文進行溝通和文件記錄。
-   按階段執行任務並更新進度。

## 學習與專案洞見

-   此專案旨在為 ArgoCD + Glasskube 整合提供一個實用的範本。
-   一個關鍵的交付成果是使用 Glasskube 將現有應用程式（"shiori"、"sample-web-app"）進行封裝。
-   與使用者溝通確定最適合專案目標（簡潔範本 vs. 標準流程）的技術路徑非常重要。
-   採用外部 Helm Registry 是處理 Helm chart 的標準方法，但需要使用者端的配合。
