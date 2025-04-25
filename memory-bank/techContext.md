# Technical Context

## Technologies Used

### Core Technologies
- **Kubernetes**: Container orchestration platform
- **Glasskube**: Kubernetes package manager
- **Docker**: Container platform used for hosting the package repository

### Package Definition
- **YAML**: Used for Kubernetes manifests and Glasskube package definitions
- **JSON Schema**: Used for package.yaml validation (https://glasskube.dev/schemas/v1/package-manifest.json)

### Web Server
- **Caddy**: Lightweight, modern web server used to serve static files
- **HTTP/HTTPS**: Protocol for accessing the package repository

## Development Setup

### Prerequisites
- **Docker**: Required for running the Caddy server
- **Kubernetes Cluster**: Required for testing package installations
- **Glasskube CLI**: Required for interacting with packages and repositories

### Directory Structure
```
glasskube-gitops-test/
├── apps/                      # Original application sources
│   ├── shiori/                # K8s manifests for Shiori
│   │   ├── cluster.yaml
│   │   ├── deployment.yaml
│   │   ├── ingress.yaml
│   │   ├── namespace.yaml
│   │   ├── persistentvolumeclaim.yaml
│   │   └── service.yaml
│   └── sample-web-app/        # Sample Node.js app with Helm
│       ├── chart/             # Helm chart directory
│       │   ├── templates/     # Helm templates
│       │   ├── Chart.yaml     # Chart definition
│       │   └── values.yaml    # Default values
│       ├── Dockerfile         # Container image definition
│       ├── index.js           # Application code
│       └── package.json       # Node.js dependencies
├── glasskube-packages/        # Glasskube package repository
│   ├── packages/              # Package definitions directory
│   │   ├── index.yaml         # Repository index
│   │   ├── shiori/            # Shiori package
│   │   │   ├── versions.yaml  # Version list
│   │   │   └── v1.0.0+1/      # Specific version
│   │   │       └── package.yaml # Package definition
│   │   └── sample-web-app/    # Sample Web App package
│   │       ├── versions.yaml  # Version list
│   │       └── v1.0.0+1/      # Specific version
│   │           └── package.yaml # Package definition
│   └── README.md              # Repository documentation
├── docker-caddy.sh            # Script to start Docker Caddy server
├── README.md                  # Project overview
└── USAGE-GUIDE.md             # Detailed usage instructions
```

## Technical Constraints

### Glasskube Package Schema
- Package definitions must follow the official Glasskube schema
- Required fields: name, scope, shortDescription
- For manifests packages: must include valid manifest URLs
- For Helm packages: must include chartName, chartVersion, repositoryUrl

### File Paths
- URLs in package.yaml must be relative to the repository server root
- Docker container maps the host directory to `/srv`, so paths must be adjusted accordingly

### Docker Requirements
- Docker must be installed and running
- Container needs network port 9684 exposed
- Host file system must be accessible to the container

## Tool Usage Patterns

### Static File Server
```bash
# Start Caddy server via Docker
docker run --rm -it \
  -v "$(pwd):/srv" \
  -p 9684:80 \
  caddy:2-alpine \
  caddy file-server --root /srv --listen :80
```

### Glasskube Repository Management
```bash
# Add the local repository
glasskube repo add local-repo http://localhost:9684/glasskube-packages/packages

# List available packages
glasskube list --repo local-repo

# Install a package
glasskube install shiori --repo local-repo
```

### Package Installation with Values
```bash
# Install with custom values
glasskube install shiori --repo local-repo \
  --value hostname=shiori.example.com \
  --value replicas=2
```
