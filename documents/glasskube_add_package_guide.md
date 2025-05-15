# 如何將套件新增至 Glasskube (包含自建應用程式)

本文檔旨在說明如何將新的套件（例如您自行開發的 Helm chart 或 Kubernetes manifest）新增至 Glasskube 套件管理器，以及如何建立自己的套件儲存庫。

## ⚡️ 摘要

Glasskube 透過「Package Definition (`package.yaml`)＋Package Repository」機制，把傳統 Helm / YAML 部署流程抽象化成可版本化、可複用的套件。本文件將引導您完成以下步驟：

1.  **理解 Package Definition (`package.yaml`)**：如何描述您的應用程式。
2.  **理解 Package Repository 結構**：官方與自建倉庫的目錄格式。
3.  **建立您自己的 Package Repository**：託管與掛載您的私有套件。
4.  **打包與發布您的應用程式**：將您的 Helm Chart 或 Manifests 上架。
5.  **發布前檢查清單** 與 **常用指令/CRD**。

## 前置準備

*   存取 **Kubernetes 叢集**（[Minikube](https://minikube.sigs.k8s.io/docs/start) 即可）
*   已安裝 [Glasskube CLI](https://github.com/glasskube/glasskube)

### 安裝 Glasskube CLI

如果您尚未安裝 `glasskube`，可以透過以下適用於您作業系統的方式安裝：

*   **macOS (使用 [Homebrew](https://brew.sh/))**
    ```bash
    brew install glasskube/tap/glasskube
    ```
*   **Linux**
    *   RPM-based (RedHat/CentOS/Fedora)
        ```bash
        dnf install https://releases.dl.glasskube.dev/glasskube_latest_amd64.rpm
        ```
    *   DEB-based (Ubuntu/Debian)
        ```bash
        curl -LO https://releases.dl.glasskube.dev/glasskube_latest_amd64.deb
        sudo dpkg -i glasskube_latest_amd64.deb
        ```
    *   APK-based (Alpine)
        ```bash
        curl -LO https://releases.dl.glasskube.dev/glasskube_latest_amd64.apk
        apk add --allow-untrusted glasskube_latest_amd64.apk
        ```
    *   其他發行版或 32 位元二進制檔案，請參閱 [最新版本](https://github.com/glasskube/glasskube/releases/latest) 的下載選項。
*   **Windows**
    從 [最新版本](https://github.com/glasskube/glasskube/releases/latest) 下載 windows archive 並使用 Windows Explorer 解壓縮。
*   **NixOS/Nixpkgs**
    *   暫時使用：`nix-shell -p glasskube`
    *   全域安裝：將 `pkgs.glasskube` 加入您的 `environment.systemPackages`。

安裝後，請執行 `glasskube bootstrap` 在您的 Kubernetes 叢集中安裝 Glasskube Operator 元件。更多資訊請參閱 [bootstrap 指南](https://glasskube.dev/products/package-manager/docs/getting-started/bootstrap/)。

## 什麼是 Glasskube？ 🧊

Glasskube 是一個 **開源的 Kubernetes 套件管理器**。您可以選擇使用 Glasskube UI、CLI 或直接透過 GitOps 部署套件。

Glasskube 部署定義在 **Package Repository** 中的套件。預設會配置官方的公開儲存庫。

```bash
glasskube repo list # 查看已配置的儲存庫
```

> ✋ 如果您希望將**公開**的開源套件新增至**官方目錄**，請在此處[開啟 issue](https://github.com/glasskube/glasskube/issues)。對於您**自行開發**的應用程式，建議建立**自己的 Package Repository**。

## 1. 理解 Package Definition (`package.yaml`)

Package Definition 是一份描述**如何安裝、升級與曝光**一個應用程式的 YAML 檔案。它遵循特定的 JSON Schema ([`https://glasskube.dev/schemas/v1/package-manifest.json`](https://glasskube.dev/schemas/v1/package-manifest.json))，建議在檔案開頭加上 schema 註解以獲得 IDE 驗證支援。

```yaml
# yaml-language-server: $schema=https://glasskube.dev/schemas/v1/package-manifest.json
name: my-app
# ... 其他欄位 ...
```

### 核心欄位說明

| 區段 (Section)      | 關鍵欄位 (`key`)        | 說明                                                                 | 必要性 |
| :------------------ | :---------------------- | :------------------------------------------------------------------- | :----- |
| **Metadata**        | `name`                  | 套件的唯一名稱 (例如 `my-app`)                                         | ✅      |
|                     | `scope`                 | 安裝範圍: `Cluster` (叢集範圍) 或 `Namespaced` (命名空間範圍)            | ✅      |
|                     | `shortDescription`      | 套件的簡短描述 (顯示在列表)                                            | ✅      |
|                     | `longDescription`       | 套件的詳細描述 (支援 Markdown, 顯示在詳情頁)                           | ❌      |
|                     | `iconUrl`               | 套件圖示的 URL                                                         | ❌      |
|                     | `defaultNamespace`      | 如果 `scope` 是 `Namespaced`，指定預設安裝的命名空間                     | ❌      |
| **Install Sources** | `helm`                  | 指定 Helm Chart 來源 (見下方 Helm 說明)                               | ⚠️ [^1] |
|                     | `manifests`             | 指定 Kubernetes Manifest YAML 來源 (見下方 Manifests 說明)             | ⚠️ [^1] |
| **Configuration**   | `valueDefinitions`      | 宣告使用者可互動配置的參數 (見下方 Value Definitions 說明)             | ❌      |
|                     | `values`                | 硬式編碼或預先建立 Helm values 路徑 (見下方 Values 說明)               | ❌      |
| **Access**          | `entrypoints`           | 定義如何存取應用程式的服務 (例如 Web UI, API) (見下方 Entrypoints 說明) | ❌      |
| **References**      | `references`            | 提供相關連結 (例如 文件、GitHub Repo) (見下方 References 說明)         | ❌      |

[^1]: `helm` 和 `manifests` 至少需要提供其中一個作為安裝來源。可以同時提供。

### 詳細欄位說明

#### 1.1 Helm (`helm`)

如果您的應用程式是透過 Helm Chart 部署：

*   **`chartName`:** (必要) Helm chart 的名稱。
*   **`chartVersion`:** (必要) Helm chart 的版本。
*   **`repositoryUrl`:** (必要) Helm chart 儲存庫的 URL。

```yaml
helm:
  chartName: my-chart
  chartVersion: 1.2.3
  repositoryUrl: https://charts.example.com/
```

#### 1.2 Manifests (`manifests`)

如果您的應用程式是透過原生 Kubernetes YAML Manifests 部署：

*   **`url`:** (必要) 指向單一 YAML 檔案或包含多個 YAML 檔案的 URL。可以有多個 `url` 項目。

```yaml
manifests:
  - url: https://github.com/my-org/my-app/releases/download/v1.0.0/install.yaml
  - url: https://raw.githubusercontent.com/my-org/my-app/main/configmap.yaml
```

#### 1.3 Value Definitions (`valueDefinitions`)

讓使用者可以在安裝或更新時，透過 UI 或 CLI 互動式地設定參數。這些參數會被轉換成對 Helm `values` 的修改。

*   **`metadata.description`:** (必要) 參數的說明文字。
*   **`type`:** (必要) 參數類型，例如 `text`, `number`, `boolean`, `select`。
*   **`defaultValue`:** (選用) 參數的預設值 (字串格式)。
*   **`targets`:** (必要) 定義此參數如何影響 Helm Chart。
    *   `chartName`: (必要) 目標 Helm Chart 的名稱 (需與 `helm.chartName` 匹配)。
    *   `patch`: (必要) 使用 JSON Patch 語法來修改 Helm 的 `values`。
        *   `op`: 操作類型 (`add`, `replace`, `remove`)。
        *   `path`: 要修改的 Helm `values` 中的路徑 (JSON Pointer 格式，例如 `/service/port`)。

```yaml
valueDefinitions:
  replicaCount:
    metadata:
      description: "設定部署的 Pod 數量"
    type: number
    defaultValue: "1"
    targets:
      - chartName: my-chart
        patch:
          op: replace # 或 add 如果路徑不存在但父路徑存在
          path: /replicaCount # 修改 Helm values.yaml 中的 replicaCount
  ingress:
    enabled:
      metadata:
        description: "是否啟用 Ingress"
      type: boolean
      defaultValue: "false"
      targets:
        - chartName: my-chart
          patch:
            op: replace
            path: /ingress/enabled
```
官方套件配置[文件](https://glasskube.dev/products/package-manager/docs/design/package-config/)。

#### 1.4 Values (`values`)

主要有兩個用途：
1.  **硬式編碼 (Hardcode) Helm Values:** 直接在 `package.yaml` 中設定某些 Helm `values`，這些值會覆蓋 Chart 中的預設值，但優先級低於使用者透過 `valueDefinitions` 或 `--value` CLI 參數設定的值。
2.  **建立空路徑 (Instantiate Paths):** `valueDefinitions` 只能修補 (patch) **已存在**的路徑。如果您的 Chart `values.yaml` 中沒有某個路徑 (例如 `ingressController.config`)，但您想讓 `valueDefinitions` 能夠設定其下的值 (例如 `ingressController.config.email`)，您需要先在這裡建立這個空路徑。

```yaml
values:
  # 硬式編碼範例
  serviceAccount:
    create: true
    name: my-app-sa
  # 建立空路徑範例 (為了讓 valueDefinitions 能修補 /ingressController/config/email)
  ingressController:
    config: {}
```

#### 1.5 Entrypoints (`entrypoints`)

定義使用者如何存取應用程式提供的服務 (通常是 Web UI 或 API)。Glasskube UI 會顯示這些連結，`glasskube open <package-name>` 指令也會使用這些資訊。

*   **`serviceName`**: (必要) Kubernetes Service 的名稱。
*   **`port`**: (必要) Service 的埠號。
*   **`localPort`**: (必要) 執行 `glasskube open` 時，本機監聽的埠號。
*   **`name`**: (必要) Entrypoint 的名稱 (例如 `ui`, `api`, `metrics`)。
*   **`scheme`**: (選用) 協定 (`http` 或 `https`)，預設為 `http`。
*   **`context`**: (選用) URL 的路徑前綴 (例如 `/dashboard`)。

```yaml
entrypoints:
  - name: web-ui
    serviceName: my-app-service # K8s Service 名稱
    port: 8080                 # Service Port
    localPort: 9090            # 本機訪問 localhost:9090
    scheme: http
  - name: metrics
    serviceName: my-app-metrics-svc
    port: 9100
    localPort: 9100
    scheme: http
    context: /metrics
```

#### 1.6 References (`references`)

提供相關的外部連結。

*   **`label`:** (必要) 連結的顯示文字。
*   **`url`:** (必要) 連結的 URL。

```yaml
references:
  - label: "官方文件"
    url: https://docs.my-app.com/
  - label: "GitHub Repo"
    url: https://github.com/my-org/my-app
```

### 完整範本 (`package.yaml`)

```yaml
# yaml-language-server: $schema=https://glasskube.dev/schemas/v1/package-manifest.json
name: my-awesome-app
scope: Namespaced # 或 Cluster
defaultNamespace: my-apps
shortDescription: 這是一個很棒的應用程式
longDescription: |
  ## 功能
  - 功能 A
  - 功能 B

  支援 **Markdown** 格式。
iconUrl: https://example.com/icon.png

helm:
  chartName: my-awesome-app-chart
  chartVersion: 0.1.0
  repositoryUrl: https://charts.my-org.com/

# manifests: # 如果同時有 Helm 和 Manifests，或只有 Manifests
#   - url: https://.../manifest.yaml

values: # 硬式編碼或建立空路徑
  someDefault: value
  ingress:
    config: {} # 為了讓 valueDefinitions 能修補

valueDefinitions:
  adminPassword:
    metadata:
      description: "設定管理員密碼"
    type: text # 應考慮使用 secret type (如果支援)
    targets:
      - chartName: my-awesome-app-chart
        patch:
          op: add # 假設 chart values 中沒有 password 欄位
          path: /adminPassword # 注意：敏感資訊處理方式
  enableIngress:
    metadata:
      description: "是否啟用 Ingress"
    type: boolean
    defaultValue: "true"
    targets:
      - chartName: my-awesome-app-chart
        patch:
          op: replace
          path: /ingress/enabled

entrypoints:
  - name: ui
    serviceName: my-awesome-app-svc
    port: 80
    localPort: 8080
    scheme: http

references:
  - label: "文件"
    url: https://docs.my-org.com/my-awesome-app
  - label: "原始碼"
    url: https://github.com/my-org/my-awesome-app
```

## 2. Package Repository 結構

Glasskube 從 Package Repository 讀取套件資訊。您可以貢獻到官方倉庫，或建立自己的私有/公有倉庫。

官方倉庫網址：<https://github.com/glasskube/packages>

倉庫目錄結構（所有檔案皆為純 YAML，適合 Git + 靜態伺服器託管）：

```text
packages/                     # <root> - 倉庫的根目錄，URL 指向此目錄
├─ index.yaml                 # 套件索引檔 (必要)
└─ <package-name>/            # 例如 my-awesome-app/ (必要)
   ├─ versions.yaml           # 版本索引檔 (必要)
   └─ v<version>/             # 例如 v0.1.0+1/ (必要, 至少一個版本)
      ├─ package.yaml         # 此版本的 Package Definition (必要)
      └─ .test/               # (選用, 僅用於官方 CI)
         └─ config-values.txt # (選用, 僅用於官方 CI)
```
([Package Repository | Glasskube](https://glasskube.dev/products/package-manager/docs/components/package-repository/), [packages/packages/akri/versions.yaml at main · glasskube/packages · GitHub](https://github.com/glasskube/packages/blob/main/packages/akri/versions.yaml), [packages/packages/index.yaml at main · glasskube/packages · GitHub](https://github.com/glasskube/packages/blob/main/packages/index.yaml))

*   **`packages/index.yaml`**: 包含倉庫中所有套件的摘要列表。每個套件條目包含 `name`, `iconUrl`, `latestVersion`, `shortDescription`。Glasskube UI/CLI 使用此檔案快速顯示可用套件。**`latestVersion` 必須與對應套件的 `versions.yaml` 中的 `latestVersion` 一致。**
*   **`packages/<package-name>/versions.yaml`**: 列出特定套件的所有可用版本，並指定 `latestVersion`。`versions` 陣列中的每個 `version` 字串必須對應到一個 `v<version>` 資料夾。
*   **`packages/<package-name>/v<version>/package.yaml`**: 包含該特定版本套件的完整 Package Definition。

### 版本命名規則

套件版本資料夾名稱和 `versions.yaml` / `index.yaml` 中引用的版本號必須遵循 **`v<SemVer>+<Build>`** 格式，其中：
*   `<SemVer>` 是標準語義化版本號 (例如 `1.2.3`, `0.1.0`)。
*   `<Build>` 是一個**正整數**，代表 Glasskube 套件定義的修訂版號。

**範例:**
*   應用程式版本 `0.1.0` 的首次發布：`v0.1.0+1`
*   如果應用程式本身未更新，但您需要修改 `package.yaml` (例如修正 `entrypoint` 或新增 `valueDefinition`)：`v0.1.0+2`
*   應用程式更新到 `0.2.0`：`v0.2.0+1`

Glasskube Operator 使用此格式來判斷是否有新版本或修正版本可用。([Package Repository | Glasskube](https://glasskube.dev/products/package-manager/docs/components/package-repository/))

## 3. 建立您自己的 Package Repository

如果您想發布私有應用程式，或不想依賴官方倉庫的審核流程，可以輕鬆建立自己的倉庫。

| # | 操作                     | 指令 / 說明                                                                                                                               | 參考                                                                                                                                                                                                                                                           |
| :-: | :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | **建立 Git Repo**        | 建立一個新的 Git 儲存庫 (例如在 GitHub, GitLab)。                                                                                           | -                                                                                                                                                                                                                                                              |
| 2 | **建立 `packages/` 目錄** | 在 Repo 根目錄下建立 `packages` 資料夾。                                                                                                    | [結構](#2-package-repository-結構)                                                                                                                                                                                                                              |
| 3 | **新增您的套件**         | 在 `packages/` 下為您的應用程式建立 `<package-name>/versions.yaml` 和 `<package-name>/v<version>/package.yaml`。                               | [結構](#2-package-repository-結構), [範例](#1-理解-package-definition-packageyaml)                                                                                                                                                                            |
| 4 | **建立/更新 `index.yaml`** | 在 `packages/` 根目錄下建立或更新 `index.yaml`，加入您的套件資訊，確保 `latestVersion` 正確。                                                 | [結構](#2-package-repository-結構)                                                                                                                                                                                                                              |
| 5 | **靜態託管 (Hosting)**   | 將 `packages/` 目錄的內容透過靜態網站伺服器公開存取。                                                                                       |                                                                                                                                                                                                                                                                |
|   |                          | - **GitHub Pages:** 最簡單的方式，直接從您的 Repo 設定。URL 會類似 `https://<user>.github.io/<repo>/packages/`                               | [GitHub Pages](https://pages.github.com/)                                                                                                                                                                                                                      |
|   |                          | - **其他:** AWS S3, Google Cloud Storage, Netlify, Vercel, 或自架 Nginx/Caddy。                                                             | -                                                                                                                                                                                                                                                              |
|   |                          | - **本地測試:** `caddy file-server --root ./packages --listen :9684` (需安裝 Caddy)                                                          | [CONTRIBUTING.md](https://github.com/glasskube/glasskube/blob/main/CONTRIBUTING.md#custom-package-repository)                                                                                                                                                  |
| 6 | **在 K8s 叢集掛載 Repo** | 告訴您的 Glasskube Operator 這個新倉庫的存在。                                                                                              |                                                                                                                                                                                                                                                                |
|   | **方法 A (CLI)**         | `glasskube repo add <repo-name> <repo-url>` (例如 `glasskube repo add my-repo https://<user>.github.io/<repo>/packages/`)。可加 `--default` 設為預設。 | [CONTRIBUTING.md](https://github.com/glasskube/glasskube/blob/main/CONTRIBUTING.md#custom-package-repository)                                                                                                                                                  |
|   | **方法 B (CRD)**         | 建立 `PackageRepository` Custom Resource。支援 Basic/Bearer Auth 認證，適合 GitOps。                                                        | [Repositories Design](https://glasskube.dev/products/package-manager/docs/design/repositories/), [常用指令與 CRD 範例](#6-常用指令與-crd-範例)                                                                                                                   |
| 7 | **注意快取**             | Glasskube Operator 對倉庫內容有約 5 分鐘的快取。更新倉庫後，需等待或重啟 Operator Pod 才會看到變更。                                          | [CONTRIBUTING.md](https://github.com/glasskube/glasskube/blob/main/CONTRIBUTING.md#testing-package-changes)                                                                                                                                                     |

> **提示**：在私有網段或離線環境，可以在 `glasskube bootstrap` 時使用 `--create-default-repository=false` 跳過預設的官方 Repo，然後再手動新增您的自建 Repo。 ([Repositories Design](https://glasskube.dev/products/package-manager/docs/design/repositories/))

## 4. 打包與發布您的應用程式

現在您可以將自己開發的應用程式打包成 Glasskube 套件了。

1.  **撰寫 `package.yaml`**
    *   根據 [第 1 節](#1-理解-package-definition-packageyaml) 的說明，為您的應用程式建立 `package.yaml`。
    *   如果您的應用程式是 Helm Chart，填寫 `helm` 區段。
    *   如果是原生 YAML Manifests，填寫 `manifests` 區段。
    *   考慮是否需要 `valueDefinitions` 讓使用者配置參數。
    *   如果應用程式有 UI 或 API，設定 `entrypoints`。
2.  **版本號規劃**
    *   決定您的第一個 Glasskube 套件版本，例如 `v<app-version>+1`。
    *   將 `package.yaml` 放入對應的 `v<app-version>+1` 資料夾。
3.  **更新 `versions.yaml` 和 `index.yaml`**
    *   在 `<package-name>/versions.yaml` 中加入新版本並設定 `latestVersion`。
    *   在根 `packages/index.yaml` 中加入或更新您的套件條目，確保 `latestVersion` 同步。
4.  **本地測試 (強烈建議)**
    *   使用 Caddy 或其他方式在本機託管您的 `packages/` 目錄 (見 [步驟 3.5](#3-建立您自己的-package-repository))。
    *   `glasskube repo add local http://localhost:<port>` 將本地倉庫加入 Glasskube。
    *   `glasskube list --repo local` 查看您的套件是否出現。
    *   `glasskube install <your-package-name> --version <version> --repo local` 嘗試安裝。
    *   (可選) `glasskube install <your-package-name> --value <key>=<value>` 測試 `valueDefinitions`。
    *   `kubectl get pods -n <namespace>` 檢查應用程式是否正常運行。
    *   `glasskube open <your-package-name>` 測試 `entrypoints`。
    *   `glasskube uninstall <your-package-name>` 測試卸載。
5.  **推送變更到您的 Git Repo**
    *   `git add .`
    *   `git commit -m "feat(<package-name>): add package v<version>+build"`
    *   `git push`
6.  **更新 K8s 中的 Glasskube**
    *   如果您的 K8s 叢集已經掛載了您的 Git Repo (例如透過 GitHub Pages URL)，等待快取過期 (約 5 分鐘) 或重啟 Operator Pod。
    *   現在您應該可以在 Glasskube UI 或 CLI 中看到並安裝/更新您的應用程式了！
7.  **（可選）貢獻到官方公共 Repo**
    *   如果您的應用程式是**開源**且對社群有價值，可以考慮將其加入官方 `glasskube/packages` 倉庫。
    *   Fork `glasskube/packages`、建立分支、將您的套件檔案複製過去、提交 PR。
    *   官方 CI 會自動執行安裝驗證。如果您的套件有 `valueDefinitions`，需要在版本資料夾內建立 `.test/config-values.txt` 檔案供 CI 使用。

## 5. 發布前檢查清單 ✅

- [ ] 目錄層級與官方一致 (`packages/index.yaml`, `<pkg>/versions.yaml`, `<pkg>/v<ver>+<build>/package.yaml`)。
- [ ] `package.yaml` 開頭加上 `$schema` 註解以利驗證。
- [ ] `index.yaml` 中的 `latestVersion` 與 `<pkg>/versions.yaml` 中的 `latestVersion` 一致。
- [ ] `versions.yaml` 中的 `version` 列表包含所有存在的 `v<ver>+<build>` 資料夾。
- [ ] 版本號格式為 `v<SemVer>+<Build>` (Build 為正整數)。
- [ ] `helm.repositoryUrl` / `manifests.url` 可公開或在目標叢集內可訪問並能成功下載。
- [ ] `helm.chartName` 與 `valueDefinitions.targets.chartName` 匹配 (如果使用 Helm)。
- [ ] `entrypoints.serviceName` 與實際部署的 K8s Service 名稱匹配。
- [ ] 已在本機或測試環境成功執行安裝、更新、卸載測試。
- [ ] (若貢獻至官方) 若含 `valueDefinitions`，已提供 `.test/config-values.txt`。

## 6. 常用指令與 CRD 範例

### CLI 指令

```bash
# 新增自建 Repo (例如 GitHub Pages) 並設為預設
glasskube repo add my-corp-repo https://my-org.github.io/glasskube-pkgs/packages/ --default

# 新增需要認證的 Repo (假設是 Basic Auth)
# glasskube repo add private-repo https://repo.internal/packages --auth-type basic --auth-username user --auth-password pass
# (注意：密碼處理方式，建議使用 CRD)

# 列出所有已配置的 Repo
glasskube repo list

# 從特定 Repo 安裝套件
glasskube install my-app --repo my-corp-repo

# 更新時也會檢查所有 Repo (預設 Repo 優先)
glasskube update
```

### PackageRepository CRD 範例

使用 CRD 進行聲明式配置，適合 GitOps 流程，且支援更安全的認證方式。

```yaml
apiVersion: packages.glasskube.dev/v1alpha1
kind: PackageRepository
metadata:
  # 名稱會作為 repo list 中的 NAME
  name: my-corp-repo
  annotations:
    # 將此 Repo 設為預設 Repo
    packages.glasskube.dev/defaultRepository: "true"
spec:
  # 指向 packages/ 目錄的 URL
  url: https://my-org.github.io/glasskube-pkgs/packages/

  # --- 選用：認證 ---
  # auth:
    # Basic Auth 範例 (密碼應來自 Secret)
    # basic:
    #   username: my-user
    #   passwordSecretRef:
    #     name: my-repo-secret # K8s Secret 名稱
    #     key: password       # Secret 中的 Key
    # Bearer Token 範例 (Token 應來自 Secret)
    # bearer:
    #   tokenSecretRef:
    #     name: my-repo-token-secret
    #     key: token
```

將此 YAML 應用到您的 Kubernetes 叢集即可。

## 7. 延伸閱讀

*   官方「How to add a Package」指南（包含 Argo Workflows 範例） ([How to add a Package to Glasskube](https://glasskube.dev/products/package-manager/guides/how-to-add-a-package/))
*   Package Manifest Schema ([`package-manifest.json`](https://glasskube.dev/schemas/v1/package-manifest.json))
*   Package Repository 設計文件 ([Package Repository | Glasskube](https://glasskube.dev/products/package-manager/docs/components/package-repository/))
*   多 Repo 與認證設計文件 ([Repositories Design | Glasskube](https://glasskube.dev/products/package-manager/docs/design/repositories/))
*   Glasskube 貢獻指南：Custom Package Repository 章節 ([glasskube/CONTRIBUTING.md](https://github.com/glasskube/glasskube/blob/main/CONTRIBUTING.md#custom-package-repository))
*   Glasskube GitHub README ([GitHub - glasskube/glasskube](https://github.com/glasskube/glasskube))

---

> 依照本文件完成 `package.yaml` 撰寫、目錄建置與 Repo 託管後，就能透過 Glasskube CLI/UI 在任何 Kubernetes 叢集一鍵安裝、升級並管理你的應用！
