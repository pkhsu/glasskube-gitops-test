# 系統模式

## 架構概述

```
glasskube-gitops-test/
├── apps/                       # 原始應用程式定義
│   ├── shiori/                 # Shiori Kubernetes 清單檔
│   └── sample-web-app/         # Sample Web App 與 Helm chart
└── glasskube-packages/         # Glasskube 套件庫
    └── packages/               # 套件定義目錄
        ├── index.yaml          # 套件庫索引
        ├── shiori/             # Shiori 套件
        └── sample-web-app/     # Sample Web App 套件
```

## 關鍵元件

### 1. 應用程式 (最原始資源)
`apps/` 目錄包含做為單一資料來源的原始應用程式定義：
- **Shiori**: 使用 Kubernetes YAML 清單定義部署、服務等
- **Sample Web App**: 使用 Helm chart 進行部署

### 2. Glasskube 套件庫
`glasskube-packages/` 目錄包含 Glasskube 套件定義：
- **index.yaml**: 列出所有可用的套件
- **套件目錄**: 每個應用程式都有自己的目錄和版本

### 3. 套件定義
每個套件都有標準化的結構：
- **versions.yaml**: 列出所有可用版本，並標記最新版本
- **v{version}+{build}/package.yaml**: 特定版本的完整套件定義

## 實作模式

### GitHub 直接引用模式
套件定義使用 GitHub raw URL 直接引用原始檔案，避免重複：
```yaml
# 對於基於清單的套件 (Shiori)
manifests:
  - url: https://raw.githubusercontent.com/pkhsu/glasskube-gitops-test/main/apps/shiori/namespace.yaml
  - url: https://raw.githubusercontent.com/pkhsu/glasskube-gitops-test/main/apps/shiori/deployment.yaml
  # ...

# 對於基於 Helm 的套件 (Sample Web App)
helm:
  chartName: eap-distr-simulator
  chartVersion: 0.1.0
  repositoryUrl: https://raw.githubusercontent.com/pkhsu/glasskube-gitops-test/main/apps/sample-web-app/chart/
```

### 值定義模式
配置參數使用目標定義，對清單或圖表的特定部分進行修補：
```yaml
valueDefinitions:
  hostname:
    metadata:
      description: "用於訪問應用的主機名..."
    type: text
    defaultValue: "example.com"
    targets:
      - manifests:
          - selector: "kind=Ingress,name=shiori"
            patch:
              op: replace
              path: /spec/rules/0/host
```

### 套件庫訪問模式
套件庫直接通過 GitHub raw URLs 訪問，無需本地伺服器：
```bash
# 添加基於 GitHub 的套件庫
glasskube repo add github-repo https://raw.githubusercontent.com/pkhsu/glasskube-gitops-test/main/glasskube-packages/packages
```

## 關鍵實作路徑

1. **套件定義 → GitHub 原始檔案**: 套件定義必須正確引用 GitHub 上 `apps/` 目錄中的檔案
2. **GitHub URLs → 套件檔案**: GitHub raw URLs 必須是公開可訪問的，並指向正確的分支
3. **Glasskube CLI → 套件庫**: Glasskube CLI 必須能夠通過 HTTPS 訪問 GitHub 上的套件庫
