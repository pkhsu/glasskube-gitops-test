# Active Context 活動環境

## 當前工作重點

目前的工作重點是將 Glasskube 套件庫從使用本地檔案伺服器轉換為直接使用 GitHub raw URL，這使得套件庫更容易分享和使用，無需額外的伺服器設置。

### 最近完成的變更

1. **URL 更新** - 所有套件定義中的 URL 已從相對路徑更新為完整的 GitHub raw URLs
   - 格式: `https://raw.githubusercontent.com/pkhsu/glasskube-gitops-test/main/apps/...`
   - 這適用於 shiori 套件中的所有清單檔和 sample-web-app 的 Helm chart 位置

2. **移除 Caddy 伺服器** - 不再需要 `docker-caddy.sh` 腳本，因為我們現在直接從 GitHub 提供檔案

3. **文檔更新** - 更新了 `README.md` 以反映新的使用方式，包括:
   - 使用 GitHub URL 添加套件庫
   - 移除了啟動本地伺服器的部分
   - 更新了故障排除指南

## 當前決策和考量

1. **使用 GitHub raw URLs 的優勢**:
   - 無需維護本地伺服器
   - 套件庫可以直接分享給其他人使用
   - 整合到 GitOps 工作流更加容易

2. **考量事項**:
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

## 下一步

1. 進行整合測試以確保更新後的 URL 可正常運作
2. 考慮為新增套件建立自動化工作流程
3. 探索使用版本標籤而非固定分支，提高版本管理彈性

## Active Decisions

### Direct File References
We decided to use direct references to original application files (/apps/* directory) in the package.yaml definitions instead of duplicating files. This approach:
- Eliminates redundancy and maintenance overhead
- Creates a single source of truth for application manifests
- Simplifies updates when application files change

### Docker-Based Hosting
We chose to use Docker with Caddy for hosting the package repository because:
- It provides a consistent environment across different machines
- Requires minimal setup (just Docker)
- Can easily serve the entire project directory structure
- Is suitable for both development and testing

### Package Configuration Strategy
For both packages, we implemented valueDefinitions that allow end-users to customize:
- For Shiori: hostname, replicas, and storage size
- For Sample Web App: replica count, ingress enablement, and ingress hostname

## Key Insights
1. **Single Source of Truth**: The direct file reference approach creates a clean separation between application sources and package definitions
2. **Path Resolution**: The key to making direct references work is ensuring the static server is started from the project root
3. **Docker Simplicity**: Using Docker for the repository server eliminates environment-specific setup issues
4. **Value Targeting**: The valueDefinitions targeting system in Glasskube is powerful for patching specific parts of manifests or charts

## Current Patterns and Preferences
1. Keep application files in their original location
2. Use Docker for consistent environments
3. Favor clear documentation over implicit understanding
4. Design for single source of truth
5. Provide customization options via valueDefinitions
