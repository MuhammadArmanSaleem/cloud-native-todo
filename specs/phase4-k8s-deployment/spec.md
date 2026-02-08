# Feature Specification: Phase IV – Local Kubernetes Deployment

**Feature**: Phase IV – Minikube, Helm, Docker (Gordon), kubectl-ai, Kagent  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: Hackathon II Phase IV – Deploy Todo Chatbot on local Kubernetes.

## Objective

Deploy the Phase III Todo Chatbot on a local Kubernetes cluster using Minikube and Helm. Use Docker (Gordon), kubectl-ai, and Kagent for AI-assisted container and cluster operations.

## Requirements

| Requirement | Detail |
|-------------|--------|
| Containerization | Containerize frontend and backend (Docker); use Gordon when available |
| Package manager | Helm charts for deployment |
| Orchestration | Kubernetes via Minikube (local) |
| AI DevOps | kubectl-ai and/or Kagent for AI-assisted K8s operations |
| Application | Phase III Todo Chatbot (frontend + backend + chat) |

## Technology Stack

| Component | Technology |
|-----------|------------|
| Containerization | Docker (Docker Desktop) |
| Docker AI | Docker AI Agent (Gordon) – optional; fallback: standard Docker CLI / Claude |
| Orchestration | Kubernetes (Minikube) |
| Package Manager | Helm Charts |
| AI DevOps | kubectl-ai, Kagent |
| Application | Phase III Todo Chatbot |

## User Scenarios

### 1. Build and run images locally (without Gordon)

- Developer runs `docker build` for backend and frontend, then `docker run` (or docker-compose) to verify images.
- **Acceptance**: Both images start; frontend can reach backend; health/readiness endpoints respond.

### 2. Deploy to Minikube with Helm

- Developer runs `minikube start`, then `helm install todo ./helm/todo-chatbot` (or equivalent).
- **Acceptance**: Backend and frontend pods are Running; Services expose them; app is reachable (e.g. via `minikube service` or Ingress).

### 3. Use kubectl-ai for operations (when installed)

- Developer runs prompts such as: “deploy the todo frontend with 2 replicas”, “scale the backend to handle more load”, “check why the pods are failing”.
- **Acceptance**: kubectl-ai can target the same Helm release / manifests; operations are reproducible.

### 4. Use Kagent for cluster analysis (when installed)

- Developer runs: “analyze the cluster health”, “optimize resource allocation”.
- **Acceptance**: Kagent can inspect the Minikube cluster and suggest or apply changes.

### 5. Gordon (Docker AI) – optional

- If Gordon is enabled (Docker Desktop 4.53+ Beta): use `docker ai "What can you do?"` and AI-assisted Docker commands.
- If unavailable: use standard Docker CLI; docs reference Gordon and fallback.

## Out of Scope (Phase IV)

- Production-grade ingress/ TLS (optional Ingress for Minikube is in scope).
- Managed Kubernetes (GKE, EKS, AKS); only Minikube.
- CI/CD pipelines (manual build/install is sufficient).
- Database run in cluster (external Neon DB is fine); no mandatory in-cluster PostgreSQL.

## Definition of Done

- [ ] Backend Dockerfile builds and runs (env via env vars or file).
- [ ] Frontend Dockerfile builds and runs; rewrites point to backend URL (build-time or runtime as designed).
- [ ] Helm chart deploys backend and frontend (Deployments, Services, optional ConfigMap/Secret).
- [ ] Minikube deployment steps documented (start cluster, install chart, access app).
- [ ] Documentation references Gordon, kubectl-ai, and Kagent with example commands and fallbacks.
