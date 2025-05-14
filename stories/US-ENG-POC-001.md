# US-ENG-POC-001: Validate Glasskube's Basic Package Management Capabilities on MicroK8s

## User Story
As an engineer for the APP Center solution,  
I want to use Glasskube CLI to successfully install, upgrade, query, and remove applications in a MicroK8s Edge device environment,  
So that I can validate the basic feasibility of Glasskube as a local package management tool for Edge devices.

## Acceptance Criteria
- **AC1:** Successfully install Glasskube in a MicroK8s environment.
- **AC2:** Use Glasskube CLI to search for available sample application packages.
- **AC3:** Use Glasskube CLI to successfully install a sample application package to MicroK8s.
- **AC4:** Use Glasskube CLI to list installed application packages with their versions and status.
- **AC5:** Use Glasskube CLI to successfully upgrade an installed application package to a new version.
- **AC6:** Use Glasskube CLI to successfully remove an installed application package.
- **AC7:** (Risk assessment) Document the resource consumption (CPU, Memory) of Glasskube on MicroK8s. 