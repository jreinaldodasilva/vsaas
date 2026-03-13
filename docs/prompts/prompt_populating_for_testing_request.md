# VSAAS – Test Data Population Prompt, Test Dataset & QA Guide

## 1. Master Prompt – Test Data Population, Seeding Script & Documentation

Use the prompt below with an LLM or internal tooling to **design, generate, and document** a complete test dataset **and the script that populates it** for the VSAAS platform.

---

### **Prompt: VSAAS Full Test Environment Generator**

You are acting as a **senior full-stack QA & platform simulation engineer** for the VSAAS video surveillance as a service system.

Before producing any output, you must **read, analyze, and extract requirements from ALL existing VSAAS documentation**, including but not limited to:

* Backend architecture and MongoDB schema documentation
* Frontend architecture, component library, and state management docs
* Navigation, user flows, forms, validation, UX, and accessibility documentation

You must treat the existing documentation as the **single source of truth** for:

* Data models and relationships
* Role permissions and access rules
* Validation constraints
* Frontend behaviour and UI expectations

No assumptions may contradict the documented architecture. Any ambiguity must be explicitly noted in the output documentation as an assumption or open question.

Your task is to **design, generate, and document** a complete **test environment** that simulates real-world usage of VSAAS across:

* Backend (Node.js / Express / MongoDB)
* Frontend (React / Vite / role-based routing)
* Authentication (admin + client portals)
* Video surveillance workflows (cameras, streams, recordings, alerts)

You must produce **three deliverables**:

1. **A runnable data population script** (seed script)
2. **Comprehensive documentation of all generated accounts and data**
3. **A full testing guide describing expected frontend and backend behaviour**

---

### **Global Rules & Constraints**

* Use **appropriate locale defaults** (configurable, default: en-US).
* Follow VSAAS's **multi-tenant organization isolation model** strictly.
* All MongoDB documents must use valid ObjectId references.
* Emails must be unique, clearly marked as test accounts, and grouped by role.
* Passwords must be compatible with VSAAS auth (bcrypt/JWT). If hashing is abstracted, clearly document plaintext → hash mapping.
* Dates must cover **historical, current, and future** ranges to exercise dashboards, filters, and reports.
* Respect backend validation (Zod / express-validator) and frontend form constraints.

---

### **Prompt: VSAAS Test Data Seeder**

You are acting as a **backend test data generator** for the VSAAS video surveillance as a service platform.

Your task is to **populate a MongoDB database** with realistic, production-like **test data** that simulates an active video surveillance system.

#### **General Rules**

* Use **appropriate locale defaults** for names, phone formats, and text.
* All data must be **internally consistent** and reference valid ObjectIds.
* Emails must be unique and clearly marked as test accounts.
* Passwords should be hashed using the platform's standard auth mechanism (use placeholder values if hashing is abstracted).
* Respect role-based access and ownership (organization → users → cameras → recordings).
* Dates should span **past, present, and near future** to test reporting and timeline views.

---

### **Entities to Create & Populate via Script**

Your seeding script must create the following entities **in the correct dependency order**, ensuring referential integrity.

#### 1. System Administrators

* 2 global administrators
* role = SUPER_ADMIN / ADMIN
* Not scoped to organizations
* Purpose: platform-wide access, audits, configuration

#### 2. Organizations

Create **2 organizations**, each with:

* name, address, phone, timezone
* operating hours
* storage quotas
* retention policies

#### 3. Organization Administrators

* 1 admin per organization
* role = ORG_ADMIN
* Scoped strictly to one organization

#### 4. Operators

* 3 operators per organization
* role = OPERATOR
* Camera management and monitoring permissions
* Alert response capabilities

#### 5. Viewers

* 2 viewer users per organization
* role = VIEWER
* Read-only access to cameras and recordings

#### 6. Cameras

* 10 cameras per organization
* Mix of:

  * online / offline
  * indoor / outdoor
  * different resolutions
  * various locations
* Full configuration data

#### 7. Video Streams

For active cameras:

* Live stream metadata
* Stream health status
* Bandwidth usage
* Connection details

#### 8. Recordings

* Past recordings (completed)
* Current recordings (in-progress)
* Scheduled recordings (future)
* Edge cases: failed, corrupted, deleted

#### 9. Alerts & Events

For monitored cameras:

* Motion detection events
* System alerts
* Custom triggers
* Event history

---

### **Output Requirements**

1. Return structured JSON per collection
2. Clearly separate collections
3. Include comments explaining relationships
4. Flag edge cases (offline cameras, failed recordings, triggered alerts)

---

## 2. Test Account Inventory & Documentation Output

The generator must also output **human-readable documentation** describing every account and dataset created.

### 2.1 Global Accounts

| Role         | Email                                         | Password | Scope  | Notes                  |
| ------------ | --------------------------------------------- | -------- | ------ | ---------------------- |
| System Admin | admin@vsaas.test                              | Test@123 | Global | Full platform access   |
| System Admin | admin2@vsaas.test                             | Test@123 | Global | Audit & backup testing |

---

### 2.2 Organization A – Main Office

**Organization:** VSAAS Main Office

**Organization Admin:**

* admin.main@vsaas.test

**Operators:**

* operator1.main@vsaas.test – Camera Management
* operator2.main@vsaas.test – Alert Response
* operator3.main@vsaas.test – System Monitoring

**Viewers:**

* viewer1.main@vsaas.test
* viewer2.main@vsaas.test

**Cameras:**

* camera01.main@vsaas.test → camera10

---

### 2.3 Organization B – Branch Office

(Same structure as Organization A with unique identifiers and emails)

---

### 2.4 Required Documentation Artifacts

The output must include:

* Account tables (role, email, permissions)
* Organization → users → cameras hierarchy diagrams
* Recording timelines per organization
* Known edge cases and why they exist

---

## 3. Seeding Script Requirements

The solution must include a **clear, executable script** that populates the database.

### 3.1 Script Characteristics

* Language: TypeScript (Node.js)
* Uses existing Mongoose models
* Idempotent (safe to re-run in test environments)
* Logs created ObjectIds and relationships

### 3.2 Execution Order

1. Create system admins
2. Create organizations
3. Create organization admins
4. Create operators
5. Create viewers
6. Create cameras
7. Create video streams
8. Create recordings
9. Create alerts & events

### 3.3 Script Output

* Console summary
* JSON artifact with all created entities
* Markdown or HTML documentation

---

## 4. Technical Assumptions

* Database: MongoDB
* Relationships via ObjectId references
* Soft deletes enabled
* Status-driven workflows (online, recording, offline)
* Zod validation rules respected
* Timezone-aware datetime storage

---

## 5. Full Platform Testing Guide (Frontend + Backend)

This section must guide a tester through **realistic end‑to‑end usage** of the platform using the generated data.

### 5.1 Authentication & Authorization

* Login as each role
* Verify JWT/session handling
* Confirm route protection (admin vs client)
* Attempt forbidden access paths

### 5.2 Frontend Behaviour Expectations

* Role-based navigation menus
* Correct data scoping by organization
* Form validation feedback
* Video player rendering with various stream states

### 5.3 Backend Behaviour Expectations

* Correct filtering by organization ObjectId
* Audit logs generated for key actions
* Status transitions enforced (online → recording → offline)
* Validation errors returned consistently

### 5.4 Core Workflows

**Operator:**

* Add camera
* Configure camera settings
* Start/stop recording
* View live stream
* Respond to alerts

**Viewer:**

* Login to portal
* View camera list
* Watch live streams
* Review recorded footage

### 5.5 Edge Case Testing

* Offline cameras
* Failed recordings
* Storage quota exceeded
* Network connectivity issues

---

## 6. Success Criteria

* No broken references
* No validation errors on load
* Realistic UX flows
* Data usable for demos, QA, and automation tests

---

**Document version:** 1.0
**Purpose:** QA, demos, automated testing, onboarding
