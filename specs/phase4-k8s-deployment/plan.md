# Phase IV – Local Kubernetes Deployment – Architecture Plan

## 1. Scope and Dependencies

**In scope**

- Backend (FastAPI) and frontend (Next.js) container images.
- Single Helm chart (e.g. `todo-chatbot`) with backend + frontend.
- Minikube as the only target cluster.
- Docs for: Docker build/run, Helm install, Minikube, Gordon, kubectl-ai, Kagent.

**Out of scope**

- Production clouds; multi-region; managed DB in cluster (Neon remains external).
- Full CI/CD (manual build/install only).

**Dependencies**

- Docker Desktop (or Docker + Minikube).
- Minikube, kubectl, Helm 3.
- Optional: Gordon (Docker Desktop 4.53+ Beta), kubectl-ai, Kagent.
- Phase III app (backend on 8001, frontend on 3000, Next rewrites to backend).

## 2. Key Decisions

| Decision | Options | Choice | Rationale |
|----------|---------|--------|-----------|
| Image build | Gordon vs standard Dockerfile | Standard Dockerfile; Gordon in docs as optional | Reproducible, works in all regions; Gordon for AI-assisted edits/commands. |
| Chart layout | Monorepo chart vs separate charts | Single chart, backend + frontend | Simpler for Phase IV; one `helm install`. |
| Backend URL (frontend) | Build-time vs runtime | Build-time ARG in Dockerfile | Next rewrites are build-time; keep image portable with default; override in Helm. |
| Secrets | Plain ConfigMap vs Secret | K8s Secret for DB/Auth/API keys | Best practice; values from env or Helm values. |
| Exposure (Minikube) | NodePort vs Ingress | NodePort by default; Ingress optional | Minikube-friendly; `minikube service` works. |

## 3. Interfaces and Contracts

- **Backend container**: Listen on 8001; env: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `OPENROUTER_API_KEY`, optional `OPENROUTER_MODEL`, `API_URL`.
- **Frontend container**: Listen on 3000; build-time `BACKEND_URL` (e.g. `http://todo-backend:8001` for in-cluster).
- **Helm values**: image repos/tags, replica counts, backend URL for frontend build, env overrides, NodePorts if used.

## 4. Non-Functional Requirements

- **Containers**: Start without root where possible; health/readiness via existing or simple HTTP checks.
- **Resources**: Optional limits/requests in Helm for backend/frontend (documented).
- **Security**: No secrets in image; use K8s Secret and env.

## 5. Data and Config

- **Source of truth for env**: Helm values + K8s Secret (from values or external secret store).
- **Database**: External (Neon); same `DATABASE_URL` as Phase III.

## 6. Operational Readiness

- **Docs**: Single “Phase IV” doc: build images, push (optional), Helm install, Minikube access, Gordon / kubectl-ai / Kagent examples.
- **Validation**: `kubectl get pods`, `minikube service list`, manual smoke test (login, chat, tasks).

## 7. Risks and Mitigations

| Risk | Mitigation |
|------|-------------|
| Next.js rewrites wrong backend | Use ARG at build; document BACKEND_URL for in-cluster service name. |
| Gordon/kubectl-ai unavailable | Document standard Docker and kubectl/Helm commands. |
| Minikube resource limits | Document minimum memory/CPU and `minikube start --memory=4096` (or similar). |

## 8. Evaluation

- Backend and frontend images build and run locally.
- `helm install` creates Running pods; app is reachable.
- Doc includes at least one kubectl-ai and one Kagent example and Gordon fallback.
