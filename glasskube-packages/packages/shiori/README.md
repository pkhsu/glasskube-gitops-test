# Shiori for Glasskube

This directory contains the [Shiori](https://github.com/go-shiori/shiori) package for [Glasskube](https://glasskube.dev/).

## Description

Shiori is a simple bookmarks manager written in Go. It is intended to be a simple, easy to use, and self-hosted alternative to services like Pocket, Instapaper, and Readability.

## Installation

To install Shiori with Glasskube, run:

```bash
glasskube install shiori
```

### Configuration Options

During installation, you can customize the following options:

- **Hostname**: The hostname for accessing Shiori (default: `my-shiori.example`)
- **Replicas**: Number of Shiori instances to run (default: `1`)
- **Storage Size**: Size of persistent storage for Shiori data (default: `1Gi`)
- **Enable Ingress**: Enable ingress for external access (default: `true`)

Example with custom values:

```bash
glasskube install shiori --value "hostname=shiori.mydomain.com" --value "replicas=2" --value "storageSize=5Gi"
```

## Usage

Once deployed, access Shiori through your web browser at the configured hostname.

Default credentials:
- Username: `shiori`
- Password: `shiori`

Remember to change these credentials after your first login.

## Versions

This package is currently available in the following versions:

- v1.0.0+1 