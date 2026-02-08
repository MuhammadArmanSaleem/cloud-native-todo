# Phase IV: Local Kubernetes Deployment (Minikube, Helm, Gordon, kubectl-ai, Kagent)

Deploy the Todo Chatbot on a local Kubernetes cluster using Minikube and Helm. Use Docker (Gordon), kubectl-ai, and Kagent for AI-assisted operations when available.

## Prerequisites

- **Docker Desktop** (or Docker + Minikube)
- **Minikube** – [install](https://minikube.sigs.k8s.io/docs/start/)
- **kubectl** – [install](https://kubernetes.io/docs/tasks/tools/)
- **Helm 3** – [install](https://helm.sh/docs/intro/install/)
- Optional: **Gordon** (Docker AI) – Docker Desktop 4.53+, Settings > Beta > enable Docker AI  
- Optional: **kubectl-ai** – [install](https://github.com/sozercan/kubectl-ai)  
- Optional: **Kagent** – [install](https://github.com/kubernetes-sigs/kagent) (or project docs)

---

## 1. Containerize (Docker)

### Option A: Standard Docker CLI

From repo root (e.g. `phase-3/phase-2`):

**Backend**

```bash
cd backend
docker build -t todo-backend:latest .
# Run locally to test (set env or use .env.local):
# docker run --env-file .env.local -p 8001:8001 todo-backend:latest
```

**Frontend**  
Frontend must be built with the **in-cluster backend URL** so Next.js rewrites work inside Kubernetes. Use the Helm release and service name (e.g. `todo-backend:8001`):

```bash
cd frontend
docker build --build-arg BACKEND_URL=http://todo-backend:8001 -t todo-frontend:latest .
```

### Option B: Docker AI (Gordon)

If Gordon is enabled (Docker Desktop 4.53+ Beta):

```bash
docker ai "What can you do?"
docker ai "Build a Dockerfile for this FastAPI backend in ./backend"
docker ai "Build a Dockerfile for this Next.js app in ./frontend with BACKEND_URL=http://todo-backend:8001"
```

If Gordon is unavailable in your region or tier, use Option A or ask Claude to generate the same `docker build` commands (see Phase IV Dockerfiles in `backend/` and `frontend/`).

---

## 2. Minikube and load images

```bash
minikube start
# Load local images into Minikube's Docker env
eval $(minikube docker-env)
cd phase-2/backend && docker build -t todo-backend:latest .
cd ../frontend && docker build --build-arg BACKEND_URL=http://todo-backend:8001 -t todo-frontend:latest .
```

Or build on the host and load:

```bash
minikube image load todo-backend:latest
minikube image load todo-frontend:latest
```

---

## 3. Deploy with Helm

From `phase-2` (where `helm/` lives):

```bash
helm install todo ./helm/todo-chatbot \
  --set secret.databaseUrl="YOUR_DATABASE_URL_BASE64_OR_PLAIN" \
  --set secret.betterAuthSecret="YOUR_BETTER_AUTH_SECRET" \
  --set secret.openrouterApiKey="YOUR_OPENROUTER_API_KEY"
```

For Minikube with NodePort (so you can open the app in the browser):

```bash
helm install todo ./helm/todo-chatbot \
  --set backend.service.nodePort=30081 \
  --set frontend.service.nodePort=30080 \
  --set secret.databaseUrl="postgresql+asyncpg://user:pass@host/db" \
  --set secret.betterAuthSecret="your-secret" \
  --set secret.openrouterApiKey="sk-or-..."
```

**Note:** Secret values are passed as plain strings; Helm will base64-encode them for the Kubernetes Secret. Do not commit real values; use a local values file or env.

Check pods:

```bash
kubectl get pods
kubectl get svc
```

---

## 4. Access the app

**NodePort (if set above):**

- Frontend: `http://$(minikube ip):30080`
- Backend API: `http://$(minikube ip):30081`

**Using minikube service (tunnel or port-forward):**

```bash
minikube service todo-frontend
minikube service todo-backend
```

Browser will open the service URL. Frontend talks to backend via in-cluster URL `http://todo-backend:8001` (server-side rewrites).

---

## 5. AI-assisted Kubernetes (kubectl-ai)

If **kubectl-ai** is installed and configured (e.g. OpenAI API key):

```bash
kubectl-ai "deploy the todo frontend with 2 replicas"
kubectl-ai "scale the backend to handle more load"
kubectl-ai "check why the pods are failing"
```

Use the same Helm release name (`todo`) and image names so that kubectl-ai suggestions align with this setup. You can paste the Helm chart path or describe that the app is already deployed via Helm and you want to scale or debug.

---

## 6. Kagent (cluster analysis)

If **Kagent** is installed:

```bash
kagent "analyze the cluster health"
kagent "optimize resource allocation"
```

Use for advanced use cases; Minikube is the target cluster.

---

## 7. Research note – Spec-driven deployment

Phase IV uses a **spec-driven approach** for infrastructure:

- **Spec**: `specs/phase4-k8s-deployment/spec.md` – requirements, scenarios, DoD  
- **Plan**: `specs/phase4-k8s-deployment/plan.md` – decisions, interfaces, NFRs  
- **Tasks**: `specs/phase4-k8s-deployment/tasks.md` – testable tasks and acceptance  

Blueprints (templates) for Docker and Helm are in the repo; Claude Code Agent Skills can generate or adjust them from the spec. This supports the hackathon question: *Is Spec-Driven Development key for infrastructure automation?* – by treating deployment as a specified, task-driven workflow with clear acceptance criteria.

---

## Quick reference

| Item | Location |
|------|----------|
| Backend Dockerfile | `phase-2/backend/Dockerfile` |
| Frontend Dockerfile | `phase-2/frontend/Dockerfile` (uses `BACKEND_URL` build arg) |
| Helm chart | `phase-2/helm/todo-chatbot/` |
| Phase IV spec/plan/tasks | `specs/phase4-k8s-deployment/` |
