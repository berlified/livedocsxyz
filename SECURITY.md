# Security policy

## Supported versions

Security fixes land on the default branch (`main`) and are included in the latest GitHub release.

## Report a vulnerability

**Do not open a public issue** for security reports.

Use [GitHub private vulnerability reporting](https://github.com/berlified/livedocsxyz/security/advisories/new) on this repository.

Include:

- A description of the issue
- Steps to reproduce, or a proof of concept
- Affected files, components, or install URLs (`https://livedocs.xyz/r/*.json`)
- Impact (for example: XSS in docs, supply-chain risk in generated registry JSON)

We aim to acknowledge reports within **5 business days**.

## What we treat as in scope

- Secrets or credentials committed to the repo
- XSS, HTML injection, or open redirects on the docs site
- Tampering risk in published registry JSON (`/r/*.json`)
- Dependency issues that affect the docs site or generated component source

## What is out of scope

- Issues that only exist in a consumer app after they copy a component (they own that copy)
- Social-engineering reports without a technical vulnerability
- Findings that require physical access or a compromised GitHub account

## Supply chain

This project publishes **source**, not compiled npm packages for the charts. Treat `https://livedocs.xyz/r/<name>.json` like any other third-party install URL: pin, review the copied files, and do not pipe unknown JSON into a privileged environment.
