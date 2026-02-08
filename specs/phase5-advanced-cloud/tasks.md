# Phase V – Advanced Cloud Deployment – Tasks

Order: Part A (features + events + Dapr) → Part B (Minikube) → Part C (Cloud + CI/CD). Dependencies noted.

---

## Part A: Advanced Features

### Task A.1 – Verify Intermediate features (priorities, tags, search, filter, sort)

- [ ] Confirm backend GET /api/tasks accepts priority, tags, search, sort, order and returns correct results.
- [ ] Confirm frontend TaskFilters and task list use these params; test filter by priority, tag, search, and sort by due_date, priority, title.
- [ ] Document any gap (e.g. reminder_time in UI) and fix if required.

**Acceptance:** E2E test: set priority/tags, search, filter, sort; results match.

---

### Task A.2 – Verify Advanced features (due date, reminder, recurring)

- [ ] Confirm due_date and reminder_time round-trip in API and TaskForm.
- [ ] Confirm recurring_pattern (daily/weekly/monthly) and next_occurrence in API and UI.
- [ ] If “complete recurring → create next” is still inline in backend, leave as is for now; Task A.5 will add event-driven next occurrence.

**Acceptance:** Create task with due date + recurring; complete it; next occurrence visible (inline or after A.5).

---

### Task A.3 – Add Kafka event publishing (Task API)

- [ ] Introduce event payload types (TaskEvent, ReminderEvent) and a small producer abstraction (e.g. `events.publish_task_event`, `events.publish_reminder_event`).
- [ ] On task create/update/delete/PATCH complete: after DB commit, publish to topic `task-events` (event_type, task_id, task_data, user_id, timestamp).
- [ ] When task has due_date or reminder_time set (create or update): publish to topic `reminders` (task_id, title, due_at, remind_at, user_id).
- [ ] Producer: either (1) Dapr HTTP to sidecar (`/v1.0/publish/<pubsub>/task-events`) or (2) direct Kafka client. Prefer Dapr for Part B/C.
- [ ] Make producer switchable (env: USE_DAPR_PUBSUB=true vs direct Kafka bootstrap); if no Kafka/Dapr, no-op (no crash).

**Acceptance:** Create/update/complete task; event appears in Kafka (or in Dapr sidecar log when sidecar present).

---

### Task A.4 – Dapr Pub/Sub and Secrets (backend)

- [ ] Add Dapr component YAMLs (scoped to namespace): Pub/Sub (Kafka/Redpanda), Secret store (e.g. kubernetes).
- [ ] Backend reads Dapr sidecar port from env (e.g. DAPR_HTTP_PORT=3500); if present, use Dapr for publish and for secrets (DB URL, OpenRouter key) instead of env only.
- [ ] Optional: keep env fallback when Dapr not injected (local dev without K8s).

**Acceptance:** Backend with Dapr sidecar publishes to topic via Dapr; secrets resolved via Dapr.

---

### Task A.5 – Recurring Task Service (consumer)

- [ ] New service (Python or Node): subscribes to `task-events` (via Dapr or direct Kafka).
- [ ] On event_type=completed: load task from DB (or from event payload); if recurring_pattern and next_occurrence, create new task (user_id, title, due_date=next_occurrence, recurring_pattern, original_task_id); update next_occurrence on original if needed.
- [ ] Deployable as separate Deployment in K8s; same Neon DB or read from API.
- [ ] Idempotency: ignore duplicate completed events for same task_id in short window.

**Acceptance:** Complete a recurring task; consumer runs; next occurrence appears in task list.

---

### Task A.6 – Notification Service (optional) and Audit Service (optional)

- [ ] **Notification Service:** Subscribe to `reminders`; store in queue or DB; cron or binding triggers send at remind_at (e.g. email/push stub).
- [ ] **Audit Service:** Subscribe to `task-events`; append to audit table or file; queryable.
- [ ] At least one of the two implemented for “event-driven” demo; both can be stubs (log + ack).

**Acceptance:** Events consumed; no crash; optional email/audit log written.

---

## Part B: Local Deployment (Minikube)

### Task B.1 – Redpanda (Kafka) on Minikube or Docker

- [ ] Add docker-compose or Helm for Redpanda (single node); create topics: task-events, reminders (and task-updates if needed).
- [ ] Document: start Redpanda, create topics, bootstrap address for Dapr component.

**Acceptance:** Redpanda running; topics exist; Dapr Pub/Sub component points to it.

---

### Task B.2 – Dapr on Minikube

- [ ] Document or script: `dapr init -k`; apply Dapr components (Pub/Sub, Secret store) for namespace.
- [ ] Optional: State store, Cron binding components for Phase V “full Dapr”.

**Acceptance:** Dapr sidecar injectable; components applied; backend pod has sidecar.

---

### Task B.3 – Deploy app + Dapr to Minikube

- [ ] Update Phase IV Helm chart: enable Dapr annotation on backend (and optional frontend) so sidecars inject.
- [ ] Backend env: DAPR_HTTP_PORT, USE_DAPR_PUBSUB=true; Kafka brokers from Dapr component (or Redpanda service name).
- [ ] Deploy Redpanda, Dapr components, then Helm release; verify backend publishes and Recurring Task Service consumes.

**Acceptance:** `helm install` on Minikube; create/complete recurring task; next occurrence created via consumer.

---

## Part C: Cloud Deployment

### Task C.1 – Redpanda Cloud (or equivalent)

- [ ] Sign up Redpanda Cloud; create cluster; create topics task-events, reminders.
- [ ] Document: bootstrap URL, SASL credentials; store in Dapr secret store or K8s Secret for Dapr component.

**Acceptance:** Dapr Pub/Sub component in cloud uses Redpanda Cloud; events flow.

---

### Task C.2 – Deploy to DOKS / GKE / AKS

- [ ] Create cluster (one provider); configure kubectl; install Dapr; apply components (Pub/Sub with Redpanda Cloud, Secrets).
- [ ] Deploy app using Phase IV Helm chart (images from registry); set secrets and backend URL for frontend.
- [ ] Document: cluster creation, kubectl, Helm values, ingress/LB if needed.

**Acceptance:** App and Dapr running on cloud K8s; tasks and chat work; events in Redpanda.

---

### Task C.3 – CI/CD (GitHub Actions)

- [ ] Workflow: on push to main (or tag) build backend and frontend images; push to registry (Docker Hub, GCR, ACR, or DO registry).
- [ ] Deploy step: helm upgrade --install or kubectl apply using images from registry; use GitHub secrets for cluster kubeconfig or service account.
- [ ] Document: required secrets, branch/tag strategy.

**Acceptance:** Push triggers build and deploy; app version in cluster updates.

---

### Task C.4 – Monitoring and logging

- [ ] Enable provider-native metrics (e.g. DO monitoring, GCP Monitoring, Azure Monitor); or deploy Prometheus + Grafana in cluster.
- [ ] Logging: stdout; configure aggregation (DO Logs, Cloud Logging, Azure Log Analytics) or Fluent Bit sidecar.
- [ ] Document: where to see metrics and logs; optional alert on health check failure.

**Acceptance:** Metrics and logs visible in provider console or Grafana.

---

## Summary order

1. A.1, A.2 (verify features)  
2. A.3 (publish events)  
3. A.4 (Dapr)  
4. A.5 (Recurring Task Service)  
5. A.6 (optional Notification/Audit)  
6. B.1 (Redpanda local)  
7. B.2 (Dapr Minikube)  
8. B.3 (Deploy to Minikube)  
9. C.1 (Redpanda Cloud)  
10. C.2 (Deploy to cloud K8s)  
11. C.3 (CI/CD)  
12. C.4 (Monitoring/logging)
