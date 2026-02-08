# Phase V – Advanced Cloud Deployment – Architecture Plan

## 1. Scope and Dependencies

**In scope**

- **Part A:** Intermediate/Advanced features (verify/complete); Kafka event producers in Task API (and optionally Chat); Dapr integration (Pub/Sub, Secrets, optional State/Bindings/Service Invocation); consumers: Recurring Task Service, and optionally Notification Service, Audit Service.
- **Part B:** Minikube + Dapr + Kafka (Redpanda Docker); Helm chart with Dapr sidecar injection; component manifests.
- **Part C:** One cloud provider (DOKS or GKE or AKS); Dapr on cluster; Redpanda Cloud (or equivalent) for Kafka; GitHub Actions CI/CD; monitoring/logging (provider-native or standard stack).

**Out of scope**

- Full WebSocket service and task-updates consumer (optional).
- Multi-cloud or multi-region.

**Dependencies**

- Phase IV: Helm chart, Dockerfiles, backend/frontend images.
- Kafka: Redpanda Cloud (free tier) or Redpanda Docker / Strimzi for local.
- Dapr: CLI and Kubernetes mode; component CRDs.

---

## 2. Key Decisions

| Decision | Options | Choice | Rationale |
|----------|---------|--------|------------|
| Kafka API usage | Direct (kafka-python) vs Dapr Pub/Sub | Dapr Pub/Sub | Loose coupling; swap broker via config; aligns with hackathon. |
| Event producer location | Only Task API vs Task + Chat API | Task API (and Chat tools) | Single place for task mutations; chat uses same API/tools; events emitted after DB commit. |
| Recurring “next” creation | Inline in API vs event consumer | Event consumer (Recurring Task Service) | Decoupled; scales; matches spec. |
| Reminders | Cron job vs event-driven | Event to reminders topic; consumer schedules/sends | Decoupled notification service. |
| Dapr State for conversation | Use vs keep Neon for chat | Keep Neon for chat; Dapr State optional | Fewer changes; optional later. |
| Local Kafka | Redpanda Docker vs Strimzi | Redpanda Docker (single container) | Easiest for Minikube/dev. |
| Cloud Kafka | Redpanda Cloud vs Confluent | Redpanda Cloud serverless | Free tier; Kafka-compatible. |
| CI/CD | GitHub Actions vs other | GitHub Actions | Common; docs and examples abundant. |

---

## 3. Interfaces and Contracts

**Kafka topics (via Dapr Pub/Sub)**

- **task-events:** Payload: `event_type`, `task_id`, `task_data` (or id + version), `user_id`, `timestamp`. Consumers: recurring-service, audit-service.
- **reminders:** Payload: `task_id`, `title`, `due_at`, `remind_at`, `user_id`. Consumer: notification-service.

**Dapr components (minimal)**

- Pub/Sub: type `pubsub.kafka` (or Redpanda); metadata: brokers, consumer group.
- Secret store: type `secretstores.kubernetes` or cloud secret manager; for DB URL, OpenRouter key, Kafka credentials if needed.

**Services**

- **Todo Backend (existing):** After task create/update/delete/complete, publish to task-events; when due_date/reminder_time set, publish to reminders. Uses Dapr sidecar HTTP (e.g. `POST /v1.0/publish/<pubsub>/task-events`).
- **Recurring Task Service:** Subscribes to task-events; on `event_type=completed` and task has recurring_pattern, create next occurrence (same user_id, title, due_date = next_occurrence).
- **Notification Service (optional):** Subscribes to reminders; stores or schedules reminder; sends at remind_at (email/push later).
- **Audit Service (optional):** Subscribes to task-events; appends to audit log (DB or object store).

---

## 4. Non-Functional Requirements

- **Events:** At-least-once delivery; idempotent consumers where possible (e.g. recurring: dedupe by task_id + completed_at window).
- **Dapr:** Sidecar resource limits in Helm; component scoping (namespace) for multi-tenant later.
- **CI/CD:** Build and push on main or release tag; deploy to staging/production namespace; use Helm or kubectl apply.

---

## 5. Data and Config

- **Neon:** Remains source of truth for tasks, users, chat. Recurring and Audit services may write to Neon or separate DB.
- **Kafka:** Event store; retention per topic (e.g. 7 days for task-events).
- **Secrets:** Dapr secret store for DATABASE_URL, OPENROUTER_API_KEY, Kafka SASL if needed.

---

## 6. Operational Readiness

- **Monitoring:** Cluster metrics (CPU/memory); app health endpoints; optional Dapr metrics.
- **Logging:** Stdout; aggregate to provider (DO Logs, Cloud Logging, Log Analytics).
- **Runbooks:** Deploy, rollback, scale; Kafka topic creation; Dapr component troubleshooting.

---

## 7. Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Event ordering / exactly-once | Accept at-least-once; design idempotent consumers. |
| Dapr learning curve | Start with Pub/Sub and Secrets only; add State/Bindings incrementally. |
| Redpanda Cloud free tier limits | Document limits; optional Strimzi for full control. |

---

## 8. Evaluation

- Unit/integration: Task API publishes; consumer creates next occurrence or appends audit.
- E2E: Minikube – deploy → create recurring task → complete → verify next in list.
- Cloud: Pipeline green; app and Dapr healthy in cluster; events in Redpanda.
