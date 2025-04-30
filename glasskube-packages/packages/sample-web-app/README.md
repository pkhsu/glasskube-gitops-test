# Sample Web App for Glasskube

This directory contains the Sample Web App package for [Glasskube](https://glasskube.dev/).

## Description

This is a sample Node.js web application that demonstrates deploying a simple web service to Kubernetes using Glasskube.

## Installation

To install Sample Web App with Glasskube, run:

```bash
glasskube install sample-web-app
```

### Configuration Options

During installation, you can customize the following options:

- **Replicas**: Number of replicas to run (default: `1`)
- **Enable Ingress**: Enable ingress for external access (default: `false`)
- **Ingress Hostname**: Hostname for the ingress (default: `sample-web-app.example`)
- **Resource Limits**: Configure CPU/Memory resource limits (default: `false`)

Example with custom values:

```bash
glasskube install sample-web-app --value "replicaCount=2" --value "ingressEnabled=true" --value "ingressHost=webapp.mydomain.com" --value "resources=true"
```

## Usage

Once deployed, access the Sample Web App through your web browser at the configured hostname.

The application displays a simple "Hello World" page with Node.js information.

## Versions

This package is currently available in the following versions:

- v1.0.0+1 