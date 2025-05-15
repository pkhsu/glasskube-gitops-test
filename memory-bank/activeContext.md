# Active Context 活動環境

## 當前工作重點

目前的工作重點包括：
1. 將 Glasskube 套件庫從使用本地檔案伺服器轉換為直接使用 GitHub raw URL
2. 建立系統架構圖以更好地理解和溝通系統組件和關係

### 最近完成的變更

1. **URL 更新** - 所有套件定義中的 URL 已從相對路徑更新為完整的 GitHub raw URLs
   - 格式: `https://raw.githubusercontent.com/pkhsu/glasskube-package-test/main/apps/...`
   - 這適用於 shiori 套件中的所有清單檔和 sample-web-app 的 Helm chart 位置

2. **移除 Caddy 伺服器** - 不再需要 `docker-caddy.sh` 腳本，因為我們現在直接從 GitHub 提供檔案

3. **文檔更新** - 更新了 `README.md` 以反映新的使用方式，包括:
   - 使用 GitHub URL 添加套件庫
   - 移除了啟動本地伺服器的部分
   - 更新了故障排除指南

4. **系統架構圖** - 使用 C4 模型創建了高級系統架構圖：
   - 採用 Mermaid 格式，可直接在 GitHub 上查看
   - 定義了系統範圍、核心系統和外部系統
   - 識別了關鍵使用者角色及其與系統的互動方式
   - 位於 `documents/glasskube_architecture_diagram.md`

## 當前決策和考量

1. **使用 GitHub raw URLs 的優勢**:
   - 無需維護本地伺服器
   - 套件庫可以直接分享給其他人使用
   - 整合到 GitOps 工作流更加容易

2. **架構設計考量**:
   - 明確定義 Glasskube 應用程式在 Kubernetes 上的運行
   - 區分 Glasskube 套件庫和應用程式的不同角色
   - 使 Package Author 和 Package Client 的互動路徑清晰化

3. **系統範圍劃分**:
   - 將核心 Glasskube 功能歸類在 System Scope
   - 將監控功能獨立為 APM Scope

4. **其他考量事項**:
   - 確保 GitHub 儲存庫保持公開以允許訪問
   - 確保分支名稱(main)在 URL 中正確指定
   - 在進行任何變更時需要更新 raw URL

## 學習和洞察

1. Glasskube 套件庫可以靈活地使用不同的檔案源，包括:
   - 本地伺服器 (之前實作)
   - GitHub raw URLs (目前實作)
   - 其他公開可存取的 Web 伺服器

2. 直接引用原始位置的檔案(而非複製)可以:
   - 減少同步問題
   - 確保使用最新版本
   - 簡化維護流程

3. C4 模型提供了有效的方式來:
   - 可視化系統組件及其關係
   - 明確定義系統範圍和邊界
   - 識別不同使用者角色與系統的互動方式

## 下一步

1. 進行整合測試以確保更新後的 URL 可正常運作
2. 考慮為新增套件建立自動化工作流程
3. 探索使用版本標籤而非固定分支，提高版本管理彈性
4. 進一步完善架構文檔，可能添加其他 C4 模型圖表（如容器圖、組件圖）

## Active Decisions

### Direct File References
We decided to use direct references to original application files (/apps/* directory) in the package.yaml definitions instead of duplicating files. This approach:
- Eliminates redundancy and maintenance overhead
- Creates a single source of truth for application manifests
- Simplifies updates when application files change

### Package Configuration Strategy
For both packages, we implemented valueDefinitions that allow end-users to customize:
- For Shiori: hostname, replicas, and storage size
- For Sample Web App: replica count, ingress enablement, and ingress hostname

### Architecture Visualization
We chose to use the C4 model for architecture documentation because it:
- Provides a clear way to communicate system structure to both technical and non-technical stakeholders
- Effectively captures different levels of abstraction (from high-level context to details)
- Uses a format (Mermaid) that can be directly rendered in GitHub

## Key Insights
1. **Single Source of Truth**: The direct file reference approach creates a clean separation between application sources and package definitions.
2. **URL Correctness**: With GitHub raw URLs, the key to making direct references work is ensuring correct URL formatting and public repository access.
3. **Value Targeting**: The valueDefinitions targeting system in Glasskube is powerful for patching specific parts of manifests or charts.
4. **System Boundaries**: Clearly defining system boundaries in the architecture diagram helps identify responsibilities and interfaces.

## Current Patterns and Preferences
1. Keep application files in their original location.
2. Favor clear documentation over implicit understanding.
3. Design for single source of truth.
4. Provide customization options via valueDefinitions.
5. Utilize GitHub raw URLs for package file hosting to simplify access and eliminate server maintenance.
6. Use C4 model and Mermaid for architecture documentation.
7. Clearly distinguish between system components and their relationships.
