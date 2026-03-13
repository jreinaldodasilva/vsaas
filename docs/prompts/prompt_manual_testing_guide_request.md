
# 🧪 VSAAS Manual Testing Guide – Authoring Prompt (Chrome + Full Documentation Aware)

## 🎯 Mission

You are acting as a **Senior QA Engineer and Technical Documentation Specialist**.

Your task is to create a **comprehensive Manual Testing Guide** for the **VSAAS Video Surveillance as a Service Platform**, intended for **real-world, end-to-end manual testing using Google Chrome**.

The guide must enable **any tester (QA, developer, product owner, or auditor)** to manually verify:

* Core business functionality
* UI/UX behavior
* Backend integrations
* Data consistency
* Multi-tenant and role-based access control

⚠️ **Important:**
The guide is **not limited to the README or a single document**.
You must **use and reconcile all existing project documentation**, including but not limited to:

* README.md
* Test_Data_Documentation.md
* `/docs` architecture and design documents
* Backend API design and authentication docs
* Frontend architecture and navigation docs
* Seed scripts, configuration files, and environment variables

Assume the documentation set is **authoritative and complete**, and your output must reflect the **actual behavior of the system**, not assumptions.

---

## 🧠 Project Context (Authoritative)

### Product Overview

* **Name:** VSAAS – Video Surveillance as a Service Platform
* **Domain:** Multi-tenant video surveillance and monitoring
* **Locale:** Configurable (default: en-US)
* **Compliance:** LGPD/data privacy (partially implemented)
* **Access Modes:** Admin Portal and Client Portal

### Architecture & Stack

* **Frontend:** React 18, TypeScript, Vite, Zustand, TanStack Query, React Router, CSS Modules, Framer Motion
* **Backend:** Node.js 18+, Express, TypeScript, MongoDB, Redis, BullMQ
* **Authentication:** JWT + refresh tokens, dual authentication (admin vs client)
* **External Services:**

  * Stripe (payments)
  * Twilio (SMS)
  * SendGrid / Nodemailer (email)
  * AWS S3 (file storage)
* **Rate Limiting & Security:** Redis-based rate limiting, bcrypt password hashing, audit logging

### Deployment & URLs (Local Development)

* **Frontend:** `http://localhost:3000`
* **Backend API:** `http://localhost:5000`
* **Health Check:** `http://localhost:5000/health`

---

## 🧪 Test Data & Seeded Environment (Mandatory Usage)

Manual tests **must leverage the official seeded test data**, generated via:

```bash
npm run seed:test
```

### Global Rules

* **Password (all users):** `Test@123`
* **Email pattern:** `*@vsaas.test`
* **Multi-tenant:** Strict organization isolation
* **Date coverage:** Past 6 months, current day, next 3 months

### Roles & Accounts

* **System Admins (Global):**

  * `admin@vsaas.test`
  * `admin2@vsaas.test`

* **Organization Admins, Operators, Viewers**

  * Organizations: Multiple test organizations
  * Roles and permissions as defined in the seed data and RBAC documentation

* **Client Portal**

  * URL: `/client/login`
  * All clients have verified emails and active portal access

All test cases must explicitly state **which role, organization, and seeded account** is being used.

---

## 📋 Required Output

Generate **one Markdown file only**:

```
MANUAL_TESTING_GUIDE.md
```

The document must be:

* Structured and professional
* Checklist-oriented
* Fully executable without prior project knowledge
* Suitable for QA execution, UAT, and audits

Do **not** include commentary about how the guide was generated.

---

## 1️⃣ Test Environment Setup

Provide **precise, reproducible instructions** for preparing a clean test environment.

### Google Chrome Configuration

* Installing the latest stable Chrome
* Creating a fresh Chrome profile for testing
* Clearing cache, cookies, IndexedDB, and localStorage
* Disabling extensions
* Handling:

  * Third-party cookies
  * Popups and redirects
  * Mixed content warnings
* Using Chrome DevTools:

  * Console
  * Network tab
  * Application tab (storage, cookies)

### Application Setup

* Running frontend and backend locally
* Verifying MongoDB and Redis availability
* Confirming API health endpoint
* Optional Docker / Docker Compose setup

### Test Data Preparation

* Running seed scripts
* Verifying seeded organizations, users, and roles
* Resetting test data between executions

---

## 2️⃣ Manual Test Plan Overview

Define:

* Scope of manual testing
* Testing objectives aligned with real user workflows
* Browser-specific risks (Chrome behavior)
* Entry and exit criteria

Include a **test tracking table**:

| Area                   | Priority | Tester | Status  | Notes |
| ---------------------- | -------- | ------ | ------- | ----- |
| Authentication         | High     | QA     | Pending |       |
| Multi-Tenant Isolation | High     | QA     | Pending |       |
| Camera Management      | High     | QA     | Pending |       |
| Video Streaming        | High     | QA     | Pending |       |
| Recording Management   | High     | QA     | Pending |       |
| Alerts & Events        | Medium   | QA     | Pending |       |

---

## 3️⃣ Test Case Design Standard (Strict)

Each test case **must include**:

* Test ID
* User role
* Organization context
* Preconditions (including seeded account)
* Numbered steps
* Expected result
* Actual result (blank)
* Status (Pass / Fail)
* Notes / screenshot reference

### Mandatory Format Example

| Test ID | Role | Organization | Preconditions | Steps | Expected Result | Actual Result | Status | Notes |
| ------- | ---- | ------------ | ------------- | ----- | --------------- | ------------- | ------ | ----- |

---

## 4️⃣ Core Functional Areas (Based on Full Documentation Set)

Create **multiple detailed manual test cases per area**, including edge cases and failure scenarios.

### Authentication & Authorization

* Admin vs client login flows
* Role-based access control
* Organization isolation
* Token expiration and refresh
* Invalid credentials

### Organization & Multi-Tenant Management

* System admin cross-organization access
* Organization admin restrictions
* Cross-organization data leakage prevention

### Camera Management

* Add, edit, remove cameras
* Camera configuration
* Camera status monitoring
* Stream health checks

### Video Streaming & Playback

* Live video streaming
* Recorded video playback
* Multi-camera views
* Stream quality adjustment

### Recording Management

* Recording schedules
* Storage management
* Recording retention policies
* Export and download

### Alerts & Event Management

* Motion detection alerts
* Custom event triggers
* Alert notifications
* Event history and logs

### UI / UX Validation

* Layout and navigation
* Loading, empty, and error states
* Animations and transitions
* Accessibility and usability

### Data Consistency

* MongoDB persistence
* Redis cache behavior
* State consistency after refresh

---

## 5️⃣ Chrome-Specific Compatibility Tests

Include explicit Chrome-focused validations:

| Area      | Test                       | Expected Result | Notes |
| --------- | -------------------------- | --------------- | ----- |
| Cookies   | Session persistence        | JWT retained    |       |
| Storage   | Local/session storage      | Correct values  |       |
| Popups    | Modals & Stripe            | Not blocked     |       |
| Redirects | Auth & payment flows       | Work correctly  |       |
| DevTools  | No critical console errors |                 |       |

---

## 6️⃣ Bug Reporting & Issue Tracking

Define:

* Reporting workflow (e.g., GitHub Issues)
* Required evidence (screenshots, console logs, network traces)
* Severity classification
* Retest and regression flow

### Mandatory Bug Template

```md
**Title:**  
**Environment:** Chrome vXX, OS  
**User Role:**  
**Organization:**  
**Preconditions:**  
**Steps to Reproduce:**  
**Expected Result:**  
**Actual Result:**  
**Severity:** Critical / Major / Minor / UI  
**Attachments:** Screenshots / Logs
```

---

## 7️⃣ Acceptance Criteria

The guide is accepted only if:

* All major features documented across the project are covered
* All test cases use real seeded accounts
* Multi-tenant isolation is validated
* Chrome-specific behavior is addressed
* No automated tools are referenced
* All steps are clear, reproducible, and unambiguous

---

## 8️⃣ Final Constraints

* Output **only** the contents of `MANUAL_TESTING_GUIDE.md`
* Do **not** invent features, roles, or workflows
* Base everything on the **entire documentation set**
* Assume the tester is technical but unfamiliar with VSAAS

