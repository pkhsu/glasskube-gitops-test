# 技術背景 (Tech Context)

## 使用的技術

-   **Kubernetes:** 底層的容器編排平台。
-   **Git:** 用於版本控制，是 GitOps 工作流程的骨幹。
-   **ArgoCD:** GitOps 持續交付工具，用於將叢集狀態與 Git 儲存庫同步。
-   **Glasskube:** Kubernetes 的套件管理器，此處用於宣告式地管理應用程式。
-   **YAML:** 定義 Kubernetes 資源、ArgoCD 應用程式和 Glasskube 套件的主要語言。
-   **Helm:** 可能用於定義 `apps/` 中的原始應用程式（特別是 `sample-web-app` 似乎具有 Helm chart 結構）。需要透過檢查 `apps/` 目錄來確認。
-   **Docker:** 很可能用於容器化 `sample-web-app`（由 `Dockerfile` 和 `.dockerignore` 表明）。
-   **Node.js:** 由 `sample-web-app` 使用（由 `package.json`, `index.js` 表明）。

## 開發設定

-   很可能需要一個本地 Kubernetes 叢集（例如 Minikube、Kind、k3d、Docker Desktop）進行測試。
-   `kubectl` CLI 用於與 Kubernetes 叢集互動。
-   `git` CLI 用於版本控制。
-   `glasskube` CLI 可能對套件開發和測試有用，儘管目標是透過 GitOps 進行管理。簡介中提到的 `bootstrap --dry-run` 指令暗示了它的用途。
-   `argocd` CLI 可能對與 ArgoCD 互動有用。
-   文字編輯器或 IDE（如 VS Code）用於編輯 YAML 檔案和可能的應用程式程式碼。

## 技術限制

-   解決方案必須遵守 GitOps 原則。所有對應用程式和設定的變更都應透過 Git 提交來驅動。
-   應用程式必須使用 Glasskube 的 `Package` 或 `ClusterPackage` 格式進行封裝。
-   此設定假設 ArgoCD 已經設定好或將被設定為管理此儲存庫。

## 依賴關係

-   一個正在運行的 Kubernetes 叢集。
-   在叢集中安裝並設定好的 ArgoCD。
-   在叢集中安裝好的 Glasskube 控制器（透過 ArgoCD 引導）。

## 工具使用模式

-   **Git:** 用於所有設定和應用程式定義的變更。
-   **ArgoCD:** 自動將 Git 中的變更應用到叢集。管理 Glasskube 安裝和應用程式套件。
-   **Glasskube:** 根據 ArgoCD 應用的 `Package` / `ClusterPackage` 資源，管理已封裝應用程式（"shiori"、"sample-web-app"）的生命週期。
-   **`glasskube bootstrap --dry-run -o yaml`:** 被提及作為一種產生清單的方式，可能對理解所需結構或用於自訂設定有用。
