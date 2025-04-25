# Project Brief: Glasskube Package Repository

## Core Objectives
- Create a Glasskube package repository for Shiori and Sample Web App applications
- Implement a structure that avoids duplicate files and simplifies maintenance
- Enable local testing and deployment of Glasskube packages

## Key Requirements
- Package Shiori as a Kubernetes manifests-based Glasskube package
- Package Sample Web App as a Helm-based Glasskube package
- Use direct references to original files to avoid duplication
- Provide a Docker-based solution for running the package repository locally
- Create documentation for using and extending the package repository

## Success Criteria
- Working Glasskube package definitions for both applications
- Ability to install packages via Glasskube CLI
- Clean directory structure that minimizes maintenance overhead
- Well-documented process for testing and extending the repository

# 專案簡介

使用此儲存庫作為範本，即可在幾分鐘內（而非數小時）開始使用 ArgoCD 和 Glasskube。
在我們的 GitOps 範本中，我們說明了如何使用 `glasskube bootstrap git` 指令將 Glasskube 與 ArgoCD 一起設定。

如果您偏好不同的 GitOps 工具或需要更客製化的解決方案，可以使用 `glasskube bootstrap --dry-run -o yaml` 來產生 Glasskube 清單，並將其放入您的 GitOps 儲存庫中。

我的目標是把 'apps/' (參見下方的資料夾內容) 中的 "shiori" & "sample-web-app" 這兩個應用，製作成讓 glasskube 管理的 package 資源。

## 資料夾內容 (apps/)

```
apps/
├── sample-web-app/
└── shiori/
