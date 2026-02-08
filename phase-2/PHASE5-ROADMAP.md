# Phase V: Advanced Cloud Deployment – Roadmap

Phase V adds **advanced features**, **event-driven architecture (Kafka)**, **Dapr**, and **cloud deployment with CI/CD**. This doc points to the spec and gives a quick start.

## Specs (SDD)

| Document | Path | Purpose |
|----------|------|---------|
| Spec | `specs/phase5-advanced-cloud/spec.md` | Part A/B/C requirements, Kafka topics, Dapr building blocks |
| Plan | `specs/phase5-advanced-cloud/plan.md` | Architecture, decisions, interfaces |
| Tasks | `specs/phase5-advanced-cloud/tasks.md` | Ordered, testable tasks (A.1–A.6, B.1–B.3, C.1–C.4) |

## Part A – What to implement first

1. **Verify** Intermediate (priorities, tags, search, filter, sort) and Advanced (due date, reminder, recurring) in UI and API – most already exist.
2. **Event publishing:** After task create/update/delete/complete, publish to Kafka topic `task-events`; when due_date/reminder set, publish to `reminders`. Prefer **Dapr Pub/Sub** (HTTP to sidecar).
3. **Dapr:** Add component YAMLs (Pub/Sub → Kafka/Redpanda, Secret store); backend calls Dapr when sidecar present.
4. **Recurring Task Service:** Consumer for `task-events`; on `completed` + recurring, create next occurrence in DB.
5. **Optional:** Notification Service (reminders), Audit Service (task-events).

## Part B – Minikube

- Run **Redpanda** (Docker or in Minikube) and create topics `task-events`, `reminders`.
- Install **Dapr** on Minikube (`dapr init -k`); apply Dapr components.
- **Helm:** Enable Dapr sidecar on backend (annotations); deploy app; verify events.

## Part C – Cloud

- **Kafka:** Redpanda Cloud (free tier); create same topics; configure Dapr Pub/Sub with bootstrap + credentials.
- **K8s:** Create cluster on DOKS / GKE / AKS; install Dapr; deploy app (Phase IV Helm); configure secrets.
- **CI/CD:** GitHub Actions – build images, push to registry, `helm upgrade` or `kubectl apply`.
- **Monitoring/logging:** Provider-native or Prometheus + log aggregation.

## Kafka topics (reference)

| Topic | Producer | Consumer |
|-------|----------|----------|
| task-events | Task API (and Chat tools) | Recurring Task Service, Audit Service |
| reminders | Task API (when due/reminder set) | Notification Service |
| task-updates | Optional (any change) | WebSocket Service (optional) |

## Dapr building blocks (Phase V)

| Block | Use |
|-------|-----|
| Pub/Sub | Kafka abstraction for task-events, reminders |
| Secrets | DB URL, OpenRouter, Kafka credentials |
| State | Optional (conversation/cache) |
| Bindings | Optional (cron for reminder sweep) |
| Service Invocation | Optional (frontend → backend via Dapr) |

## Quick start (local Kafka with Docker)

See `deploy/redpanda/docker-compose.redpanda.yml` (if added). Example:

```yaml
# deploy/redpanda/docker-compose.redpanda.yml
services:
  redpanda:
    image: redpandadata/redpanda:latest
    command: redpanda start --smp 1 --memory 512M --overprovisioned --kafka-addr PLAINTEXT://0.0.0.0:9092 --advertise-kafka-addr PLAINTEXT://localhost:9092
    ports:
      - "9092:9092"
      - "8081:8081"
      - "8082:8082"
```

Then create topics: `task-events`, `reminders`.

## Execution order (from tasks.md)

A.1 → A.2 → A.3 → A.4 → A.5 → A.6 (optional) → B.1 → B.2 → B.3 → C.1 → C.2 → C.3 → C.4.
