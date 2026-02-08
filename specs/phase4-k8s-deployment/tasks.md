# Phase IV – Local Kubernetes Deployment – Tasks

## Task 1: Backend Dockerfile and .dockerignore

- [ ] Add `phase-2/backend/Dockerfile`: multi-stage or single stage; Python 3.11+; install deps from requirements.txt; run uvicorn on 8001; expose 8001.
- [ ] Add `phase-2/backend/.dockerignore`: exclude `.venv`, `__pycache__`, `.env.local`, `.git`, etc.
- [ ] Document required env vars (DATABASE_URL, BETTER_AUTH_SECRET, OPENROUTER_API_KEY) in chart or README.

**Acceptance**: `docker build -t todo-backend ./backend` and `docker run -e DATABASE_URL=... -e BETTER_AUTH_SECRET=... -e OPENROUTER_API_KEY=... -p 8001:8001 todo-backend` runs backend.

---

## Task 2: Frontend Dockerfile and .dockerignore

- [ ] Add `phase-2/frontend/Dockerfile`: Node 20+; build with ARG BACKEND_URL (default http://localhost:8001); `next build` then `next start`; expose 3000.
- [ ] Add `phase-2/frontend/.dockerignore`: exclude `node_modules`, `.next`, `.git`, `.env.local`, etc.
- [ ] Ensure next.config.js uses `process.env.BACKEND_URL` so build-time ARG is applied.

**Acceptance**: `docker build --build-arg BACKEND_URL=http://backend:8001 -t todo-frontend ./frontend` and run; frontend proxies /api to backend.

---

## Task 3: Helm chart – structure and backend

- [ ] Create `phase-2/helm/todo-chatbot/`: Chart.yaml, values.yaml, templates/.
- [ ] Backend: Deployment (image from values, env from Secret/ConfigMap), Service (ClusterIP 8001), optional NodePort.
- [ ] Secret for DATABASE_URL, BETTER_AUTH_SECRET, OPENROUTER_API_KEY (from values or existingSecret).

**Acceptance**: `helm install todo ./helm/todo-chatbot` creates backend Deployment and Service; pods become Running when Secret is provided.

---

## Task 4: Helm chart – frontend

- [ ] Frontend: Deployment (image from values, build-time BACKEND_URL set to backend service URL), Service (ClusterIP 3000), optional NodePort.
- [ ] ConfigMap or values for non-sensitive frontend env if needed.

**Acceptance**: Frontend pods run; they can reach backend via service name (e.g. `http://todo-backend:8001` if release name is `todo` and service name is `todo-backend`).

---

## Task 5: Minikube and AI DevOps documentation

- [ ] Add `phase-2/PHASE4-MINIKUBE-DEPLOY.md` (or under docs/): Minikube start, Docker build, load images into Minikube (minikube image load or registry), Helm install, access via `minikube service`.
- [ ] Gordon: enable (Docker Desktop 4.53+ Beta), example `docker ai "What can you do?"` and “build Dockerfile for this app”; fallback to standard Docker commands.
- [ ] kubectl-ai: install and example commands (“deploy todo frontend with 2 replicas”, “scale backend”, “check why pods are failing”).
- [ ] Kagent: install and example commands (“analyze cluster health”, “optimize resource allocation”).

**Acceptance**: A developer can follow the doc to run Minikube, build/load images, install Helm release, and use (or skip) Gordon, kubectl-ai, and Kagent.
