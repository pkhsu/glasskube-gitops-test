# 技術背景

## 使用的技術

### 核心技術
- **Kubernetes**: 容器編排平台
- **Glasskube**: Kubernetes 套件管理器
- **GitHub**: 檔案託管和版本控制平台，用於託管套件庫和應用程式檔案

### 套件定義
- **YAML**: 用於 Kubernetes 清單和 Glasskube 套件定義
- **JSON Schema**: 用於 package.yaml 驗證 (https://glasskube.dev/schemas/v1/package-manifest.json)

### 網路訪問
- **HTTPS**: 用於存取 GitHub raw 內容的協議
- **Raw GitHub URLs**: 用於直接存取 GitHub 上的檔案內容

## 開發設置

### 前置需求
- **GitHub 帳號**: 用於存儲和訪問套件庫檔案
- **Kubernetes 叢集**: 用於測試套件安裝
- **Glasskube CLI**: 用於與套件和套件庫交互

### 目錄結構
```
glasskube-package-test/
├── apps/                      # 原始應用程式源碼
│   ├── shiori/                # Shiori 的 K8s 清單檔
│   │   ├── cluster.yaml
│   │   ├── deployment.yaml
│   │   ├── ingress.yaml
│   │   ├── namespace.yaml
│   │   ├── persistentvolumeclaim.yaml
│   │   └── service.yaml
│   └── sample-web-app/        # Sample Node.js 應用與 Helm
│       ├── chart/             # Helm chart 目錄
│       │   ├── templates/     # Helm 模板
│       │   ├── Chart.yaml     # Chart 定義
│       │   └── values.yaml    # 預設值
│       ├── Dockerfile         # 容器映像定義
│       ├── index.js           # 應用程式代碼
│       └── package.json       # Node.js 依賴
├── glasskube-packages/        # Glasskube 套件庫
│   ├── packages/              # 套件定義目錄
│   │   ├── index.yaml         # 套件庫索引
│   │   ├── shiori/            # Shiori 套件
│   │   │   ├── versions.yaml  # 版本列表
│   │   │   └── v1.0.0+1/      # 特定版本
│   │   │       └── package.yaml # 套件定義
│   │   └── sample-web-app/    # Sample Web App 套件
│   │       ├── versions.yaml  # 版本列表
│   │       └── v1.0.0+1/      # 特定版本
│   │           └── package.yaml # 套件定義
│   └── README.md              # 套件庫文檔
├── README.md                  # 專案概述
└── memory-bank/               # 專案記憶庫
```

## 技術限制

### Glasskube 套件結構
- 套件定義必須遵循官方 Glasskube 結構
- 必需欄位: name, scope, shortDescription
- 對於清單套件: 必須包含有效的清單 URL
- 對於 Helm 套件: 必須包含 chartName, chartVersion, repositoryUrl

### GitHub 檔案路徑
- package.yaml 中的 URL 必須是完整的 GitHub raw URL
- URL 格式: `https://raw.githubusercontent.com/{user}/{repo}/{branch}/path/to/file`
- GitHub 儲存庫必須是公開的，以便 Glasskube 能夠訪問檔案

### GitHub 限制
- GitHub 有 API 請求限制，可能影響高頻率的訪問
- 依賴公開的 GitHub 儲存庫，如果設為私有將無法訪問

## 工具使用模式

### Glasskube 套件庫管理
```bash
# 添加 GitHub 套件庫
glasskube repo add github-repo https://raw.githubusercontent.com/pkhsu/glasskube-package-test/main/glasskube-packages/packages

# 列出可用套件
glasskube list --repo github-repo

# 安裝套件
glasskube install shiori --repo github-repo
```

### 套件安裝與值設定
```bash
# 使用自定義值安裝
glasskube install shiori --repo github-repo \
  --value hostname=shiori.example.com \
  --value replicas=2
```

### GitHub URLs 格式
```yaml
# 清單 URL 格式
url: https://raw.githubusercontent.com/pkhsu/glasskube-package-test/main/apps/shiori/deployment.yaml

# Helm 套件 URL 格式
repositoryUrl: https://raw.githubusercontent.com/pkhsu/glasskube-package-test/main/apps/sample-web-app/chart/
```
