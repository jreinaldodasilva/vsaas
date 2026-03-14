# Prompt for Claude / Amazon Q Developer

## Role

You are a **principal software architect and large-scale codebase refactoring expert**.

Your task is to analyze an existing **multi-tenant Vertical SaaS boilerplate repository named `vsaas`** and transform it into an architecture that supports **two independent commercial products** that can be distributed and sold separately.

The original repository (`vsaas`) must remain **untouched as a backup**. New repositories must be created from it.

The architecture must introduce a **shared core repository** containing reusable logic, while the two final products remain independent repositories.

This prompt is intentionally **domain-agnostic**. The system may represent any type of business application.

---

# Objective

Transform the original repository into the following ecosystem:

```
vsaas (original repository kept as backup)

vsaas-core
vsaas-saas-platform
vsaas-app-boilerplate
```

### Repository Purposes

**vsaas-core**

Reusable modules shared by both products.

**vsaas-saas-platform**

A **multi-tenant SaaS boilerplate platform**.

**vsaas-app-boilerplate**

A **single-tenant business application boilerplate**.

Goals:

* avoid code duplication
* allow both products to evolve independently
* maintain a clean architecture

---

# Repository Creation Process

Assume the current repository is named:

```
vsaas
```

This repository must be preserved as a **backup reference**.

## Step 1 — Create New Repositories

Create the following empty repositories:

```
vsaas-core
vsaas-saas-platform
vsaas-app-boilerplate
```

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

This repository becomes the **multi-tenant SaaS platform boilerplate**.

## Step 3 — Create the Single-Tenant Repository

Clone the original repository again to generate the single-tenant product.

```
git clone git@github.com:ORG/vsaas.git vsaas-app-boilerplate
cd vsaas-app-boilerplate

git remote remove origin

git remote add origin git@github.com:ORG/vsaas-app-boilerplate.git

git push -u origin main
```

This repository will later have **all multi-tenant logic removed**.

## Step 4 — Create the Shared Core Repository

Create and initialize the core repository.

```
git clone git@github.com:ORG/vsaas-core.git
```

Example structure:

```
vsaas-core

/src

/auth
/database
/domain
/shared
/utils
/config
```

## Step 5 — Link the Core Repository

Both product repositories must consume the shared core.

Recommended method:

```
Git submodules
```

Example:

```
cd vsaas-saas-platform

git submodule add git@github.com:ORG/vsaas-core.git core

cd ../vsaas-app-boilerplate

git submodule add git@github.com:ORG/vsaas-core.git core
```

Final layout:

```
vsaas-saas-platform

core/
src/
```

and

```
vsaas-app-boilerplate

core/
src/
```

---

# Key Architectural Principles

## 1. Strict Separation Between Domain and Platform

Separate two categories of logic.

### Domain Logic

Reusable application logic such as:

```
users
entities
records
transactions
notifications
files
reporting
```

This logic must be moved into **vsaas-core**.

Rules:

* no tenant context
* no platform-specific dependencies

### Platform Logic

Deployment-specific logic such as:

```
tenancy
organization management
subscription management
provisioning
platform administration
```

This logic must remain **only inside `vsaas-saas-platform`**.

---

# Core Repository Design

The shared repository must contain reusable modules.

Example:

```
vsaas-core

/src

/auth
/database
/domain

   /users
   /records
   /transactions
   /notifications

/shared
/utils
/config
```

Rules:

* no multi-tenant concepts
* no SaaS billing
* no platform administration

---

# SaaS Platform Repository

Structure example:

```
vsaas-saas-platform

/src

/platform
/tenancy
/organization-management
/subscription-management
/provisioning

/modules
/infrastructure
```

Responsibilities:

* tenant isolation
* organization management
* SaaS subscriptions
* onboarding
* platform administration

Imports reusable modules from **vsaas-core**.

---

# Single-Tenant Repository

Structure example:

```
vsaas-app-boilerplate

/src

/app
/auth
/modules
/dashboard
/infrastructure
```

Rules:

* no multi-tenant logic
* no subscription logic
* no tenant provisioning

The system assumes **one organization instance only**.

---

# Multi-Tenant Removal Requirements

Inside the single-tenant repository remove fields such as:

```
tenant_id
organization_id
workspace_id
```

Remove tables such as:

```
tenants
organizations
workspaces
subscriptions
```

Queries must be simplified.

Example transformation:

Before:

```
SELECT * FROM entities
WHERE tenant_id = ?
```

After:

```
SELECT * FROM entities
```

---

# Authorization Simplification

Replace SaaS roles such as:

```
PLATFORM_ADMIN
TENANT_ADMIN
TENANT_USER
```

With simplified roles:

```
ADMIN
USER
```

---

# Expected Deliverables

Provide the following outputs.

## 1. Architecture Overview

Explain the new architecture.

## 2. Repository Structures

Provide directory structures for:

* vsaas-core
* vsaas-saas-platform
* vsaas-app-boilerplate

## 3. Module Extraction Plan

Identify which modules must be moved into the core repository.

## 4. SaaS Refactor Plan

Explain what remains in the SaaS repository.

## 5. Single-Tenant Refactor Plan

Explain how to remove multi-tenant logic.

## 6. Database Changes

Describe schema simplification for the single-tenant version.

## 7. Code Transformation Examples

Provide examples such as:

* removing tenant filters
* removing tenant middleware
* simplifying authentication

## 8. Migration Steps

Provide a **step-by-step plan** to migrate from the original `vsaas` repository to the new architecture.

## 9. Long-Term Maintenance Strategy

Explain how both products can evolve independently while sharing the core.

---

# Constraints

* Do not break existing domain logic.
* Avoid duplicated modules between repositories.
* Keep the architecture framework-agnostic when possible.

---

# Final Goal

Produce a **professional repository ecosystem** capable of supporting two independent commercial boilerplates while sharing a reusable and maintainable core codebase.
