# Product Context

## Problem Statement
Traditional Kubernetes application deployment involves complex Helm charts or YAML manifests that are difficult to maintain and share. Glasskube aims to solve this by providing a standardized package format that is easy to create, distribute, and install.

## Target Use Cases
1. **Application Distribution**: Packaging applications like Shiori and Sample Web App for easy distribution and installation
2. **Local Testing**: Testing packages locally before publishing them to production repositories
3. **Maintenance Efficiency**: Creating a structure that minimizes duplication and maintenance overhead
4. **GitOps Integration**: Enabling integration with GitOps workflows for Kubernetes deployments

## User Journey
1. User discovers Glasskube packages in a repository
2. User views available packages and their configurations
3. User installs a package with custom configuration values
4. User manages the package lifecycle (update, uninstall)
5. User potentially contributes new packages to the repository

## Key Differentiators
- **Single Source of Truth**: Direct references to original manifests/charts to avoid duplication
- **Simplified Configuration**: Structured parameter definitions for consistent configuration
- **Docker-based Testing**: Easy local testing using Docker without complex setup
- **Dual Packaging Approach**: Support for both Kubernetes manifests and Helm charts
