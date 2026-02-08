# Feature Specification: Phase V – Advanced Cloud Deployment

**Feature**: Phase V – Advanced features, Kafka, Dapr, Minikube → Cloud (DOKS/GKE/AKS)  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: Hackathon II Phase V – Advanced Level functionality, event-driven architecture, Dapr, cloud K8s, Redpanda/Kafka, CI/CD.

---

## Objective

1. **Part A:** Implement Advanced + Intermediate features (recurring tasks, due dates & reminders, priorities, tags, search, filter, sort); add event-driven architecture with Kafka; integrate Dapr (Pub/Sub, State, Bindings, Secrets, Service Invocation).
2. **Part B:** Deploy to Minikube with Dapr (full building blocks).
3. **Part C:** Deploy to production-grade Kubernetes (DigitalOcean DOKS / GKE / AKS); Dapr on cloud; Kafka on Redpanda Cloud; CI/CD (GitHub Actions); monitoring and logging.

---

## Part A: Advanced Features

### A.1 Intermediate Level (Priorities, Tags, Search, Filter, Sort)

| Requirement | Status / Notes |
|-------------|----------------|
| Priorities (high/medium/low) | Backend + frontend already support; ensure UI and API consistent. |
| Tags / categories | Backend (array) + frontend (TaskForm, filters); ensure filter-by-tag works. |
| Search (keyword in title/description) | Backend GET /api/tasks?search=; frontend TaskFilters; verify end-to-end. |
| Filter (status, priority, tags) | Backend query params; frontend TaskFilters; verify. |
| Sort (created_at, due_date, priority, title; asc/desc) | Backend + frontend; verify. |

**Acceptance:** User can filter by status/priority/tags, search by keyword, and sort; results match API.

### A.2 Advanced Level (Recurring Tasks, Due Dates & Reminders)

| Requirement | Status / Notes |
|-------------|----------------|
| Due dates | Model + API + TaskForm; ensure date picker and API round-trip. |
| Reminder time | Model + API; when set, publish reminder event (see Kafka). |
| Recurring pattern (daily/weekly/monthly) | Model + next_occurrence on create/update; when task completed, event triggers next occurrence (Recurring Task Service). |
| Recurring task engine | On “task completed” event, consumer creates next occurrence in DB. |

**Acceptance:** Create task with due date + recurring; complete it; next occurrence appears (via event consumer or existing logic). Reminder event published when due_date/remind_at set.

### A.3 Event-Driven Architecture (Kafka)

| Topic | Producer | Consumer | Purpose |
|-------|----------|----------|---------|
| **task-events** | Chat API / Task API (on create, update, delete, complete) | Recurring Task Service, Audit Service | CRUD and completion events |
| **reminders** | Task API (when due_date / reminder_time set) | Notification Service | Schedule reminders |
| **task-updates** | Task API (on any change) | WebSocket Service (optional) | Real-time sync across clients |

**Event schemas (examples):**

- **Task event:** `event_type` (created|updated|completed|deleted), `task_id`, `task_data`, `user_id`, `timestamp`
- **Reminder event:** `task_id`, `title`, `due_at`, `remind_at`, `user_id`

**Acceptance:** Task create/update/complete publishes to task-events; setting due_date/reminder publishes to reminders (or single topic with event_type). At least one consumer (e.g. Recurring Task Service or Audit) runs and processes events.

### A.4 Dapr Integration

| Building Block | Use Case |
|----------------|----------|
| **Pub/Sub** | Publish task-events / reminders via Dapr (Kafka backend); no direct Kafka client in app. |
| **State** | Optional: conversation or session state via Dapr state store (e.g. Redis/PostgreSQL). |
| **Bindings** | Cron binding for scheduled reminder checks (or internal scheduler). |
| **Secrets** | DB URL, API keys via Dapr secret store. |
| **Service Invocation** | Frontend → Backend via Dapr (optional); or Backend → Notification/Recurring services. |

**Acceptance:** Backend (and optionally frontend) uses Dapr sidecar; at least Pub/Sub and Secrets configured; events flow via Dapr to Kafka.

---

## Part B: Local Deployment (Minikube)

| Requirement | Detail |
|-------------|--------|
| Deploy app to Minikube | Use Phase IV Helm chart (backend + frontend). |
| Deploy Dapr on Minikube | `dapr init -k`; apply Dapr components (Pub/Sub, State, Bindings, Secrets). |
| Kafka locally | Redpanda Docker (or Bitnami/Strimzi); create topics task-events, reminders. |
| Full Dapr | Pub/Sub (Kafka), State, Bindings (cron), Secrets, Service Invocation documented and working. |

**Acceptance:** `minikube start` → install Dapr → install Kafka (e.g. Redpanda) → deploy app with Dapr sidecars → publish/consume events.

---

## Part C: Cloud Deployment

| Requirement | Detail |
|-------------|--------|
| Kubernetes | DigitalOcean DOKS / Google GKE / Azure AKS (one or more). |
| Dapr on cloud | Install Dapr on cluster; same building blocks as Minikube. |
| Kafka | Redpanda Cloud (serverless) or Confluent/Aiven; create topics; configure Dapr Pub/Sub. |
| CI/CD | GitHub Actions: build images, push to registry, deploy to K8s (helm upgrade or manifest apply). |
| Monitoring & logging | Cluster/workload metrics (e.g. Prometheus/DO metrics); log aggregation (e.g. DO Logs, GCP Logging, Azure Monitor). |

**Acceptance:** Push to branch triggers workflow; app deploys to cloud K8s; Dapr and Kafka used; basic monitoring/logging in place.

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| App | Phase III/IV Todo Chatbot (FastAPI + Next.js) |
| Messaging | Kafka (Redpanda Cloud or Redpanda Docker locally) |
| Runtime | Dapr (sidecar: Pub/Sub, State, Bindings, Secrets, Service Invocation) |
| Local K8s | Minikube |
| Cloud K8s | DOKS / GKE / AKS |
| CI/CD | GitHub Actions |
| Observability | Provider-native or Prometheus + log aggregation |

---

## Out of Scope (Phase V)

- Full WebSocket multi-client sync (task-updates consumer) – optional.
- Schema Registry / Avro – optional.
- Multi-region or multi-cluster.

---

## Definition of Done

- [ ] Intermediate features (priorities, tags, search, filter, sort) verified in UI and API.
- [ ] Advanced features (due dates, reminders, recurring) implemented; recurring “next occurrence” via event or inline.
- [ ] Task CRUD (and optionally chat) publish to Kafka (direct or via Dapr Pub/Sub).
- [ ] At least one consumer: Recurring Task Service and/or Audit Service and/or Notification Service.
- [ ] Dapr components defined (Pub/Sub, Secrets minimum); app uses Dapr where specified.
- [ ] Minikube: Dapr + Kafka + app deployed; events flow.
- [ ] Cloud: App + Dapr + Kafka (Redpanda Cloud) on DOKS/GKE/AKS; CI/CD and basic monitoring/logging documented or implemented.
