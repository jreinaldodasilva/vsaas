# Prompt for Claude / Amazon Q Developer

## Role

You are a principal software architect and large-scale codebase refactoring expert.

Your task is to analyze an existing multi-tenant Vertical SaaS boilerplate repository named `vsaas` and transform it into an architecture that supports two independent commercial products that can be distributed and sold separately.

The original repository (`vsaas`) must remain untouched as a backup. New repositories must be created from it.

The architecture must introduce a shared core repository containing reusable logic, while the two final products remain independent repositories.

This prompt is intentionally domain-agnostic. The system may represent any type of business application.

---

# Objective

Transform the original repository into the following ecosystem:

* `vsaas` (original repository kept as backup)
* `vsaas-core`
* `vsaas-saas-platform`
* `vsaas-app-boilerplate`

Repository purposes:

`vsaas-core`

A shared repository containing reusable modules used by both products.

`vsaas-saas-platform`

A multi-tenant SaaS platform boilerplate.

`vsaas-app-boilerplate`

A single-tenant business application boilerplate intended for one organization installation.

Goals of the transformation:

* avoid code duplication
* allow both products to evolve independently
* maintain a clean and maintainable architecture

---

# Repository Creation Process

Assume the current repository is named `vsaas`. This repository must remain unchanged and serve as the reference and backup.

## Step 1 — Create New Repositories

Create three new empty repositories:

* `vsaas-core`
* `vsaas-saas-platform`
* `vsaas-app-boilerplate`

## Step 2 — Create the SaaS Platform Repository

Clone the original repository and create the SaaS platform repository from it.

Commands:

```
git clone git@github.com:ORG/vsaas.git vsaas-saas-platform
cd vsaas-saas-platform

git remote remove origin

git remote add origin git@github.com:ORG/vsaas-saas-platform.git

git push -u origin main
```

This repository becomes the multi-tenant SaaS platform product.

## Step 3 — Create the Single-Tenant Repository

Clone the original repository again to generate the single-tenant product.

```
git clone git@github.com:ORG/vsaas.git vsaas-app-boilerplate
cd vsaas-app-boilerplate

git remote remove origin

git remote add origin git@github.com:ORG/vsaas-app-boilerplate.git

git push -u origin main
```

This repository will later have all multi-tenant logic removed.

## Step 4 — Create the Shared Core Repository

Initialize the core repository.

```
git clone git@github.com:ORG/vsaas-core.git
```

The core repository must contain only reusable logic that is independent of deployment model.

## Step 5 — Link the Core Repository

Both product repositories must consume the shared core.

Recommended method: Git submodules.

Example:

```
cd vsaas-saas-platform

git submodule add git@github.com:ORG/vsaas-core.git core

cd ../vsaas-app-boilerplate

git submodule add git@github.com:ORG/vsaas-core.git core
```

---

# Key Architectural Principles

## Separation Between Domain Logic and Platform Logic

Two categories of logic must be separated during refactoring.

### Domain Logic

Reusable application logic that represents the core business behavior of the system.

This logic must be extracted into the `vsaas-core` repository.

Rules:

* must not depend on tenant context
* must not depend on organization isolation
* must not depend on SaaS subscription logic

### Platform Logic

Deployment-specific infrastructure and platform behavior.

This logic must remain only inside the SaaS repository.

Examples of platform concerns include:

* multi-tenancy
* organization or workspace management
* subscription management
* tenant provisioning
* platform administration

---

# Core Repository Requirements

The core repository must contain only reusable and deployment-independent modules.

Rules:

* no multi-tenant concepts
* no SaaS billing logic
* no platform administration logic
* must be usable by both products

---

# SaaS Platform Repository Requirements

The SaaS repository contains platform-level functionality required to operate a multi-tenant SaaS product.

Responsibilities include:

* tenant isolation
* organization management
* subscription handling
* onboarding and provisioning
* platform administration

It must import reusable modules from `vsaas-core`.

---

# Single-Tenant Repository Requirements

The single-tenant repository contains a simplified application intended for deployment for a single organization.

Rules:

* no multi-tenant logic
* no subscription logic
* no tenant provisioning

The system assumes one organization instance only.

---

# Multi-Tenant Removal Requirements

Inside the single-tenant repository remove elements related to tenancy such as:

* tenant identifiers
* organization identifiers
* workspace identifiers

Also remove database tables and logic related to:

* tenants
* organizations
* workspaces
* subscriptions

Queries must no longer filter by tenant.

---

# Authorization Simplification

Replace SaaS platform role models with a simplified authorization model appropriate for a single organization.

Remove platform-specific roles and keep only roles required for application-level access control.

---

# Expected Deliverables

Provide the following outputs.

1. Architecture Overview

Explain the new architecture and how the repositories interact.

2. Repository Design

Describe the responsibilities of `vsaas-core`, `vsaas-saas-platform`, and `vsaas-app-boilerplate`.

3. Module Extraction Plan

Identify which modules must be moved into the core repository.

4. SaaS Refactor Plan

Explain what logic remains in the SaaS repository.

5. Single-Tenant Refactor Plan

Explain how to remove multi-tenant logic from the single-tenant application.

6. Database Changes

Describe how the schema must be simplified for the single-tenant version.

7. Code Transformation Examples

Provide examples such as removing tenant filters, removing tenant middleware, and simplifying authentication.

8. Migration Steps

Provide a step-by-step plan to migrate from the original `vsaas` repository to the new architecture.

9. Long-Term Maintenance Strategy

Explain how both products can evolve independently while sharing the core repository.

---

# Constraints

* Do not break existing domain logic.
* Avoid duplicated modules between repositories.
* Keep the architecture framework-agnostic whenever possible.

---

# Final Goal

Produce a professional repository ecosystem capable of supporting two independent commercial boilerplates while sharing a reusable and maintainable core codebase.
