# System Patterns

## Architecture Overview

```
glasskube-gitops-test/
├── apps/                       # Original application definitions
│   ├── shiori/                 # Shiori Kubernetes manifests
│   └── sample-web-app/         # Sample Web App with Helm chart
└── glasskube-packages/         # Glasskube package repository
    └── packages/               # Package definitions directory
        ├── index.yaml          # Repository index
        ├── shiori/             # Shiori package
        └── sample-web-app/     # Sample Web App package
```

## Key Components

### 1. Applications (Source of Truth)
The `apps/` directory contains the original application definitions that serve as the single source of truth:
- **Shiori**: Uses Kubernetes YAML manifests to define deployments, services, etc.
- **Sample Web App**: Uses a Helm chart for deployment

### 2. Glasskube Package Repository
The `glasskube-packages/` directory contains the Glasskube package definitions:
- **index.yaml**: Lists all available packages in the repository
- **Package Directories**: Each application has its own directory with versions

### 3. Package Definitions
Each package has a standardized structure:
- **versions.yaml**: Lists all available versions with the latest marked
- **v{version}+{build}/package.yaml**: Full package definition for specific versions

## Implementation Patterns

### Direct File Reference Pattern
Instead of duplicating files, package definitions reference original files directly:
```yaml
# For manifests-based packages (Shiori)
manifests:
  - url: /apps/shiori/namespace.yaml
  - url: /apps/shiori/deployment.yaml
  # ...

# For Helm-based packages (Sample Web App)
helm:
  chartName: eap-distr-simulator
  chartVersion: 0.1.0
  repositoryUrl: /apps/sample-web-app/chart/
```

### Value Definition Pattern
Configuration parameters are defined with targets that patch specific parts of manifests/charts:
```yaml
valueDefinitions:
  hostname:
    metadata:
      description: "The hostname for accessing..."
    type: text
    defaultValue: "example.com"
    targets:
      - manifests:
          - selector: "kind=Ingress,name=shiori"
            patch:
              op: replace
              path: /spec/rules/0/host
```

### Repository Hosting Pattern
The repository is hosted using a static file server with Docker for consistency:
```bash
docker run --rm -it \
  -v "$(pwd):/srv" \
  -p 9684:80 \
  caddy:2-alpine \
  caddy file-server --root /srv --listen :80
```

## Critical Implementation Paths

1. **Package Definition → Original Files**: Package definitions must correctly reference files in the `apps/` directory
2. **Static Server → Package Repository**: The Docker-based Caddy server must serve files from the correct root directory
3. **Glasskube CLI → Repository**: Glasskube CLI must be able to access the repository via HTTP
