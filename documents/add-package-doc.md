以下整理成 **一份 Markdown 文件**，協助開發者瞭解 Glasskube **Package Definition** 與 **自建 Package Repository** 的完整流程，並快速把自己的 Helm Chart 或原生 K8s Manifests 上架到 Glasskube Package Manager。

---

## ⚡️摘要

Glasskube 透過「Package Definition (`package.yaml`)＋Package Repository」機制，把傳統 Helm / YAML 部署流程抽象化成可版本化、可複用的套件。  
官方套件倉庫 (`glasskube/packages`) 採四層目錄：`index.yaml → <pkg>/versions.yaml → v<semver+build>/package.yaml`。  
要自建倉庫，只需複製此結構、靜態託管並用 `glasskube repo add` 或 `PackageRepository` CRD 掛載即可。  
以下內容包含：

1. **Package Definition 結構與範例**  
2. **官方倉庫完整目錄解析**  
3. **自行建立 / 託管 Repository 的逐步指引**  
4. 發布前 **Checklist** 與常用 CLI/CRD 範例  

---

## 1. 什麼是 Package Definition？

Package Definition 是一份經 JSON-Schema 驗證的 `package.yaml`，描述 **如何安裝、升級與曝光** 一個應用。核心欄位如下：

| 區段 | 關鍵欄位 | 說明 |
|------|---------|------|
| Metadata | `name`, `scope`, `shortDescription`, `iconUrl` | 基本資訊與安裝範圍 (`Cluster` / `Namespaced`)  |
| Install Sources | `helm` / `manifests` | 指定 Helm Chart 或 YAML URL 及版本  |
| Value Definitions | `valueDefinitions` | 宣告可互動參數，支援 JSON-Patch 或 Helm Values patch  |
| Entrypoints | `entrypoints` | 若需暴露 Web/UI 服務，定義 Service 與 Port  |

### 範例（節錄自 `akri` 套件）

```yaml
# yaml-language-server: $schema=https://glasskube.dev/schemas/v1/package-manifest.json
name: akri
iconUrl: https://avatars.githubusercontent.com/u/91915613
shortDescription: Akri lets you easily expose heterogeneous devices …
helm:
  repositoryUrl: https://project-akri.github.io/akri/
  chartName: akri
  chartVersion: 0.12.20
valueDefinitions:
  useLatestContainers:
    type: boolean
    defaultValue: "false"
entrypoints:
  - serviceName: akri-controller
    port: 8080
    name: metrics
```  
 ([packages/packages/akri/v0.12.20+1/package.yaml at main · glasskube/packages · GitHub](https://github.com/glasskube/packages/blob/main/packages/akri/v0.12.20%2B1/package.yaml))

---

## 2. 官方 Package Repository 結構

官方倉庫網址：<https://github.com/glasskube/packages>。  
目錄設計（所有檔案皆純 YAML，適合 Git + 靜態伺服）：

```text
packages/                     # <root>
├─ index.yaml                 # 套件總覽
└─ <package-name>/            # 例如 akri/
   ├─ versions.yaml           # 版本清單 + latestVersion
   └─ v<version>/             # e.g. v0.12.20+1/
      └─ package.yaml         # 此版 Package Definition
```  
 ([Package Repository | Glasskube](https://glasskube.dev/products/package-manager/docs/components/package-repository/), [packages/packages/akri/versions.yaml at main · glasskube/packages · GitHub](https://github.com/glasskube/packages/blob/main/packages/akri/versions.yaml), [packages/packages/index.yaml at main · glasskube/packages · GitHub](https://github.com/glasskube/packages/blob/main/packages/index.yaml))

- **index.yaml**：每個項目列出 `name`, `iconUrl`, `latestVersion`, `shortDescription`，供 UI/CLI 快速索引。 ([packages/packages/index.yaml at main · glasskube/packages · GitHub](https://github.com/glasskube/packages/blob/main/packages/index.yaml))  
- **versions.yaml**：維護 `latestVersion` 與可用 `version` 陣列，檔案通常不到 10 行。 ([packages/packages/akri/versions.yaml at main · glasskube/packages · GitHub](https://github.com/glasskube/packages/blob/main/packages/akri/versions.yaml))  
- **package.yaml**：單一版本 manifest，結構見上一節。 ([packages/packages/akri/v0.12.20+1/package.yaml at main · glasskube/packages · GitHub](https://github.com/glasskube/packages/blob/main/packages/akri/v0.12.20%2B1/package.yaml))  

### 版本命名規則

版本必須符合 **SemVer+Build**，且 Build 僅能是數字，例如 `2.7.0+2`，方便 Operator 判斷新版與修正版。 ([Package Repository | Glasskube](https://glasskube.dev/products/package-manager/docs/components/package-repository/))  

---

## 3. 自建 Package Repository 步驟

| # | 操作 | 指令 / 說明 |
|---|------|-------------|
| 1 | **Fork / 建立空白 Repo**，複製 `packages/` 目錄 | `git clone` 之後自行新增資料夾  ([glasskube/CONTRIBUTING.md at main · glasskube/glasskube · GitHub](https://github.com/glasskube/glasskube/blob/main/CONTRIBUTING.md)) |
| 2 | 為每套件建立 `versions.yaml` 與 `v<ver>/package.yaml` | 可參考 `akri` 範例結構  ([packages/packages/akri/versions.yaml at main · glasskube/packages · GitHub](https://github.com/glasskube/packages/blob/main/packages/akri/versions.yaml), [packages/packages/akri/v0.12.20+1/package.yaml at main · glasskube/packages · GitHub](https://github.com/glasskube/packages/blob/main/packages/akri/v0.12.20%2B1/package.yaml)) |
| 3 | 更新根 `index.yaml`（手動或 CI 產生） | 確保 `latestVersion` 與 versions.yaml 一致  ([packages/packages/index.yaml at main · glasskube/packages · GitHub](https://github.com/glasskube/packages/blob/main/packages/index.yaml)) |
| 4 | **靜態託管**：用 GitHub Pages、S3 或 Caddy | `caddy file-server --root ./packages --listen :9684`  ([glasskube/CONTRIBUTING.md at main · glasskube/glasskube · GitHub](https://github.com/glasskube/glasskube/blob/main/CONTRIBUTING.md)) |
| 5 | 在叢集掛載 Repo | `glasskube repo add myrepo http://<host>:9684 --default`  ([glasskube/CONTRIBUTING.md at main · glasskube/glasskube · GitHub](https://github.com/glasskube/glasskube/blob/main/CONTRIBUTING.md)) |
| 6 | （可選）用 `PackageRepository` CRD 宣告 | 支援 Basic/Bearer Auth 與 `defaultRepository=true`  ([Glasskube Repositories | Glasskube](https://glasskube.dev/products/package-manager/docs/design/repositories/?utm_source=chatgpt.com)) |
| 7 | 變更內容後記得清 Cache | Operator 對 Repo 有約 5 分鐘快取  ([glasskube/CONTRIBUTING.md at main · glasskube/glasskube · GitHub](https://github.com/glasskube/glasskube/blob/main/CONTRIBUTING.md)) |

> **提示**：在私有網段或離線環境，可用 `--create-default-repository=false` 跳過預設 Repo，再手動新增自建 Repo。 ([Glasskube Repositories | Glasskube](https://glasskube.dev/products/package-manager/docs/design/repositories/?utm_source=chatgpt.com))  

---

## 4. 將應用打包並發布

1. **撰寫 package.yaml**  
   - 若已有 Helm Chart，只需填 `helm.repositoryUrl/chartName/chartVersion`。  
   - 若是純 YAML，填 `manifests: - url: https://…/install.yaml`。  
2. **版本號規劃**  
   - 首次發布 `vX.Y.Z+1`；如需修正 manifest 而軟體未升版，僅遞增 `+2`。 ([Package Repository | Glasskube](https://glasskube.dev/products/package-manager/docs/components/package-repository/))  
3. **本地測試**  
   ```bash
   glasskube repo add local http://localhost:9684
   glasskube install my-package --value useLatestContainers=true
   kubectl get pods -n <ns>
   ```  ([glasskube/CONTRIBUTING.md at main · glasskube/glasskube · GitHub](https://github.com/glasskube/glasskube/blob/main/CONTRIBUTING.md))  
4. **（可選）加到官方公共 Repo**  
   - Fork `glasskube/packages`、建立分支、提交 PR。  
   - CI 會自動執行安裝驗證；如有互動參數，在版本資料夾放 `.test/config-values.txt`。 ([How to add a Package to Glasskube](https://glasskube.dev/products/package-manager/guides/how-to-add-a-package/?utm_source=chatgpt.com))  

---

## 5. 發布前 Checklist ✅

- [ ] 目錄層級與官方一致（`index.yaml → versions.yaml → package.yaml`）。 ([Package Repository | Glasskube](https://glasskube.dev/products/package-manager/docs/components/package-repository/))  
- [ ] `package.yaml` 加上 `$schema` 註解，IDE 自動驗證。 ([packages/packages/akri/v0.12.20+1/package.yaml at main · glasskube/packages · GitHub](https://github.com/glasskube/packages/blob/main/packages/akri/v0.12.20%2B1/package.yaml))  
- [ ] `latestVersion` 同步於兩處 YAML。 ([packages/packages/index.yaml at main · glasskube/packages · GitHub](https://github.com/glasskube/packages/blob/main/packages/index.yaml), [packages/packages/akri/versions.yaml at main · glasskube/packages · GitHub](https://github.com/glasskube/packages/blob/main/packages/akri/versions.yaml))  
- [ ] Helm Chart / Manifest URL 可正常下載。 ([How to add a Package to Glasskube](https://glasskube.dev/products/package-manager/guides/how-to-add-a-package/?utm_source=chatgpt.com))  
- [ ] 若含 `valueDefinitions`，提供 `.test/config-values.txt`。 ([How to add a Package to Glasskube](https://glasskube.dev/products/package-manager/guides/how-to-add-a-package/?utm_source=chatgpt.com))  

---

## 6. 常用指令與 CRD 範例

```bash
# 新增自建 Repo 並設為預設
glasskube repo add corp https://repo.corp.local/packages --default

# 檢視已掛載的 Repositories
glasskube repo list
```

```yaml
apiVersion: packages.glasskube.dev/v1alpha1
kind: PackageRepository
metadata:
  name: corp
  annotations:
    packages.glasskube.dev/defaultRepository: "true"
spec:
  url: https://repo.corp.local/packages/
  auth:
    basic:
      username: myuser
      password: $secure:BASE64
```

---

## 7. 延伸閱讀

- 官方「How to add a Package」指南（包含 Argo Workflows 範例） ([How to add a Package to Glasskube](https://glasskube.dev/products/package-manager/guides/how-to-add-a-package/?utm_source=chatgpt.com))  
- Package Manifest 與 Repo 設計文件  ([Package Repository | Glasskube](https://glasskube.dev/products/package-manager/docs/components/package-repository/))  
- Glasskube/CONTRIBUTING.md：Custom Package Repository 章節  ([glasskube/CONTRIBUTING.md at main · glasskube/glasskube · GitHub](https://github.com/glasskube/glasskube/blob/main/CONTRIBUTING.md))  
- Repo 結構設計與多 Repo 支援  ([Glasskube Repositories | Glasskube](https://glasskube.dev/products/package-manager/docs/design/repositories/?utm_source=chatgpt.com))  
- Glasskube GitHub README（為何選用 Glasskube） ([GitHub - glasskube/glasskube: The next generation Package Manager for Kubernetes Featuring a GUI and a CLI. Glasskube packages are ...](https://github.com/glasskube/glasskube/?utm_source=chatgpt.com))  

---

> 依照本文件完成 `package.yaml` 撰寫、目錄建置與 Repo 託管後，就能透過 Glasskube CLI/UI 在任何 Kubernetes 叢集一鍵安裝、升級並管理你的應用！