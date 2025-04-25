# Glasskube Package Repository

This repository contains Glasskube packages for:
- **Shiori**: A simple bookmark manager for self-hosted deployments
- **Sample Web App**: A sample Node.js web application

## Usage

### Local Testing

1. Start a local HTTP server in the project root directory (not in the glasskube-packages directory):

```bash
# Using Caddy (from project root directory)
caddy file-server --root . --listen :9684

# Alternative with Python (from project root directory)
python3 -m http.server 9684
```

> **Important**: Note that the server must be started from the project root directory to allow access to both the `glasskube-packages` and `apps` directories.

2. Add the repository to Glasskube:

```bash
glasskube repo add local-repo http://localhost:9684/glasskube-packages/packages
```

3. List available packages:

```bash
glasskube list --repo local-repo
```

4. Install a package:

```bash
# Install Shiori
glasskube install shiori --repo local-repo

# Install Sample Web App
glasskube install sample-web-app --repo local-repo
```

5. Configure a package during installation (optional):

```bash
# Install Shiori with custom values
glasskube install shiori --repo local-repo --value hostname=shiori.example.com --value replicas=2

# Install Sample Web App with ingress enabled
glasskube install sample-web-app --repo local-repo --value ingressEnabled=true --value ingressHost=webapp.example.com
```

### Repository Structure

```
project-root/
├── apps/                   # Original applications
│   ├── shiori/             # Shiori Kubernetes manifests
│   └── sample-web-app/     # Sample Web App with Helm chart
└── glasskube-packages/     # Glasskube package repository
    ├── README.md
    └── packages/           # Glasskube package definitions
        ├── index.yaml      # Package index
        ├── sample-web-app/ # Sample Web App package
        │   ├── v1.0.0+1/
        │   │   └── package.yaml
        │   └── versions.yaml
        └── shiori/         # Shiori package
            ├── v1.0.0+1/
            │   └── package.yaml
            └── versions.yaml
```

### Publishing

To publish this repository:

1. Push the entire project directory to a Git repository.
2. Set up GitHub Pages or another static hosting service to serve the entire project directory.
3. Add the public URL to Glasskube:

```bash
glasskube repo add my-repo https://username.github.io/repo-name/glasskube-packages/packages
```

## Development

To add a new package version:

1. Create a new version directory:
   ```
   glasskube-packages/packages/<package-name>/v<version>+<build>/
   ```

2. Create the `package.yaml` file with references to the original files in the `apps` directory.

3. Update `versions.yaml` with the new version.

4. Update `index.yaml` with the latest version.

## Maintenance Benefits

Using direct references to the original application files in the `apps` directory offers several advantages:

1. **Single Source of Truth**: Changes to manifest files only need to be made in one place
2. **Easier Maintenance**: No need to synchronize duplicate copies of files
3. **Reduced Storage**: Eliminates duplicate files
4. **Version Control**: Simpler tracking of changes to application files 