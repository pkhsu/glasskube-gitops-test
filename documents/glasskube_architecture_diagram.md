# Glasskube Package Repository Architecture

This diagram illustrates the high-level architecture of the Glasskube Package Repository system using the C4 model contextual approach.

```mermaid
graph TB
    %% Define styles
    classDef persona fill:#08427B,color:white,stroke:none
    classDef system fill:#1168BD,color:white,stroke:none
    classDef externalSystem fill:#999999,color:white,stroke:none
    classDef boundary fill:none,stroke:#cccccc,stroke-width:2px,stroke-dasharray: 5 5
    
    %% Define boundary for scope
    subgraph SystemScope ["System Scope"]
        %% Core system
        subgraph GlasskubePackageRepository ["Glasskube Package Repository"]
            PackageDefs["Package Definitions<br/>(Shiori, Sample Web App)"]
            K8sManifests["K8s Manifests"]
            HelmCharts["Helm Charts"]
            
            %% Internal relationship between package components
            PackageDefs -->|References| K8sManifests
            PackageDefs -->|References| HelmCharts
        end

        %% Glasskube Application as a System
        subgraph GlasskubeApplication ["Glasskube Application<br/><font size=1>(System)</font>"]
            GlasskubeCLI["Glasskube CLI"]
            GlasskubeGUI["Glasskube GUI"]
        end
    end

    %% APM Scope
    subgraph APMScope ["APM"]
        MonitoringSystem["Monitoring System<br/><font size=1>(External System)</font>"]
    end

    %% Define personas
    PackageAuthor["Package Author<br/><font size=1>(Person)</font>"]
    SIEngineer["Package Client<br/>SI Engineer<br/><font size=1>(Person)</font>"]
    DevOpsEngineer["DevOps Engineer<br/><font size=1>(Person)</font>"]
    AppUser["Application User<br/><font size=1>(Person)</font>"]

    %% External systems
    GitHub["GitHub<br/><font size=1>(External System)</font>"]
    K8sCluster["Kubernetes Cluster<br/><font size=1>(External System)</font>"]
    ContainerRegistry["Container Registry<br/><font size=1>(External System)</font>"]
    
    %% Applications
    subgraph DeployedApps ["Deployed Applications"]
        Shiori["Shiori Bookmark Manager<br/>with CloudNativePG"]
        WebApp["Sample Web App<br/>Node.js Application"]
    end

    %% Define relationships
    PackageAuthor -->|Creates and<br/>maintains packages| GlasskubePackageRepository
    PackageAuthor -->|Pushes changes| GitHub
    
    SIEngineer -->|Uses GUI to install/<br/>uninstall packages| GlasskubeGUI
    SIEngineer -->|Uses CLI to install/<br/>uninstall packages| GlasskubeCLI
    DevOpsEngineer -->|Manages| K8sCluster
    
    GitHub -->|Hosts raw files| GlasskubePackageRepository
    GlasskubeCLI -->|Fetches package info| GlasskubePackageRepository
    GlasskubeGUI -->|Fetches package info| GlasskubePackageRepository
    GlasskubeCLI -->|Deploys to| K8sCluster
    GlasskubeGUI -->|Deploys to| K8sCluster
    
    %% Show that Glasskube Application runs on K8s
    K8sCluster -->|Hosts| GlasskubeApplication
    
    GlasskubePackageRepository -->|References images in| ContainerRegistry
    K8sCluster -->|Runs| DeployedApps
    DeployedApps -->|Observed by| MonitoringSystem
    
    AppUser -->|Uses| DeployedApps
    
    %% Apply styles
    class PackageAuthor,SIEngineer,DevOpsEngineer,AppUser persona
    class GlasskubePackageRepository,GlasskubeApplication system
    class GitHub,K8sCluster,ContainerRegistry,MonitoringSystem,DeployedApps externalSystem
    class SystemScope,APMScope boundary
```

## Diagram Components

### Personas
- **Package Author**: Creates and maintains packages in the repository
- **Package Client (SI Engineer)**: Uses Glasskube tools to install/uninstall packages
- **DevOps Engineer**: Manages Kubernetes clusters
- **Application User**: End user who interacts with deployed applications

### Systems
- **Glasskube Package Repository**: Central system containing package definitions and references to K8s manifests and Helm charts
- **Glasskube Application**: System running on Kubernetes that includes:
  - **Glasskube CLI**: Command-line interface component for managing packages
  - **Glasskube GUI**: Graphical interface component for managing packages

### External Systems
- **GitHub**: Hosts raw files for the package repository
- **Kubernetes Cluster**: Target deployment environment for packages and hosts the Glasskube Application
- **Container Registry**: Stores container images referenced by packages
- **Monitoring System**: Observes deployed applications (within APM scope)
- **Deployed Applications**: Applications deployed to Kubernetes clusters

### Scopes
- **System Scope**: Encompasses the Glasskube Package Repository and its tools
- **APM Scope**: Application Performance Monitoring scope 