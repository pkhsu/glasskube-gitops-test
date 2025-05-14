# US-ENG-POC-004: Validate Glasskube's Offline/Local Deployment Capabilities

## User Story
As an engineer for the APP Center solution,  
I want to install application packages through locally prepared files on a completely offline Edge device (MicroK8s + Glasskube),  
So that I can validate the deployment solution in situations where connection to a central platform or network is isolated.

## Acceptance Criteria
- **AC1:** Package a Glasskube application and its dependencies into offline installation files (or confirm whether Glasskube supports such operations and how to perform them).
- **AC2:** Transfer the offline installation files to an offline Edge device (e.g., via USB).
- **AC3:** Successfully install the application using Glasskube CLI through the offline files on the offline Edge device.
- **AC4:** (Risk assessment) Evaluate the complexity and usability of creating, transferring, and installing offline packages. 