# Phase V: Advanced Cloud Deployment – Deployment Guide (Roman Urdu)

Yeh guide aapko Todo Chatbot ko **event-driven architecture (Kafka)**, **Dapr**, aur **production Kubernetes** (pehle Minikube, phir DOKS/GKE/AKS) par deploy karne ka step-by-step tareeqa batati hai.

---

## Overview (Jhaankaa)

| Part | Scope | Kab use karein |
|------|--------|----------------|
| **Part A** | Advanced features + Kafka events + Dapr code mein | Kisi bhi Phase V deploy se pehle |
| **Part B** | **Minikube** par deploy – Redpanda (local Kafka) + Dapr | Local/dev aur test ke liye |
| **Part C** | **Cloud K8s** (DOKS/GKE/AKS) + Redpanda Cloud + CI/CD + monitoring | Production / hackathon submit ke liye |

---

## Prerequisites (Sab parts ke liye zaroori cheezein)

- **Phase IV ho chuka ho:** Dockerfiles, Helm chart (`helm/todo-chatbot`), app local chal rahi ho.
- **Docker** (Desktop ya Engine).
- **kubectl** – [install](https://kubernetes.io/docs/tasks/tools/).
- **Helm 3** – [install](https://helm.sh/docs/intro/install/).
- **Neon PostgreSQL** – backend env/Helm secrets mein `DATABASE_URL`.
- **Better Auth** – `BETTER_AUTH_SECRET` set ho.
- **OpenRouter** (ya koi aur LLM) – chat ke liye `OPENROUTER_API_KEY`.

**Part B (Minikube) ke liye:**

- **Minikube** – [install](https://minikube.sigs.k8s.io/docs/start/).
- **Dapr CLI** – [install](https://docs.dapr.io/getting-started/install-dapr-cli/).

**Part C (Cloud) ke liye:**

- **DigitalOcean** / **Google Cloud** / **Azure** par account.
- **Redpanda Cloud** account – [sign up](https://redpanda.com/cloud) (free tier).
- **GitHub** repo agar CI/CD ke liye GitHub Actions use karna ho.

---

## Part A: Deploy Se Pehle (Implementation Checklist)

Phase V deploy ye maan kar chalti hai ke app **events publish** karti hai aur (optional) **Dapr** use karti hai. Agar abhi implement nahi hua to neeche diye order mein karein.

1. **Features verify karein (A.1–A.2)**  
   Priorities, tags, search, filter, sort, due date, reminder, recurring – API/UI mein pehle se hain; browser mein ek baar smoke-test karein.

2. **Event publishing (A.3)**  
   Task API mein (create/update/delete/complete): DB commit ke baad Kafka topics par publish karein:
   - `task-events` – payload: `event_type`, `task_id`, `task_data`, `user_id`, `timestamp`.
   - `reminders` – jab `due_date` ya `reminder_time` set ho: `task_id`, `title`, `due_at`, `remind_at`, `user_id`.  
   **Dapr Pub/Sub** prefer karein (sidecar ko HTTP). Agar Dapr maujood nahi to env se band karein ya direct Kafka client use karein.

3. **Dapr integration (A.4)**  
   - Dapr component YAMLs add karein: Pub/Sub (Kafka/Redpanda), Secret store.  
   - Backend: `DAPR_HTTP_PORT` (maslan 3500) read karein; agar set hai to publish aur (optional) secrets ke liye Dapr call karein.

4. **Recurring Task Service (A.5)**  
   - `task-events` ka consumer. Jab `event_type=completed` ho aur task mein `recurring_pattern` ho to DB mein next occurrence banaein.  
   - Alag service ki tarah deploy karein (maslan same Helm chart mein dusra Deployment ya alag chart).

5. **Optional (A.6)**  
   Notification Service (`reminders` consume kare), Audit Service (`task-events` consume kare).

Tafseel: `specs/phase5-advanced-cloud/spec.md`, `specs/phase5-advanced-cloud/tasks.md`.

---

## Part B: Local Deployment (Minikube + Redpanda + Dapr)

### B.1 Minikube start karein aur images build/load karein

```bash
minikube start
eval $(minikube docker-env)   # Linux/macOS; PowerShell: minikube docker-env | Invoke-Expression
cd phase-2/backend && docker build -t todo-backend:latest .
cd ../frontend && docker build --build-arg BACKEND_URL=http://todo-backend:8001 -t todo-frontend:latest .
```

Ya pehle se banayi hui images load karein: `minikube image load todo-backend:latest` (aur frontend ke liye bhi same).

### B.2 Redpanda (Kafka) chalaein aur topics banaein

Project root se (maslan `phase-3/phase-2`):

```bash
docker compose -f deploy/redpanda/docker-compose.redpanda.yml up -d
```

Topics banaein (Redpanda ka `rpk` ya koi Kafka CLI use karein). Container ke andar `rpk` ka example:

```bash
docker exec -it <redpanda-container-name> rpk topic create task-events reminders
```

Agar Redpanda **Minikube ke andar** chal raha ho to use Helm se deploy karein (maslan Redpanda Helm chart) aur Dapr component mein in-cluster service name use karein (maslan `redpanda:9092`). Simple setup ke liye zyada tar dev Redpanda host par chala kar Minikube se test karte waqt `host.docker.internal:9092` ya NodePort use karte hain.

**Dapr ke liye broker address (local host Redpanda):**  
- Host se: `localhost:9092`  
- Minikube pod se: `host.minikube.internal:9092` (Minikube) use karein, ya agar Redpanda cluster mein deploy kiya hai to uski service.

### B.3 Minikube par Dapr install karein

```bash
dapr init -k
```

Verify:

```bash
kubectl get pods -n dapr-system
```

### B.4 Dapr components apply karein

`deploy/dapr/components/pubsub-kafka.yaml` edit karein: `brokers` woh address set karein jo backend pods use karenge (maslan host par Redpanda ho to `host.minikube.internal:9092`, ya cluster mein ho to `redpanda.default.svc.cluster.local:9092`).

Apply:

```bash
kubectl apply -f deploy/dapr/components/pubsub-kafka.yaml -n default
```

Agar chahein to Dapr se DB/API keys dilwana ho to Secret store component bhi add kar sakte hain (optional; Helm ke K8s Secret se bhi kaam chal jata hai).

### B.5 Helm chart mein Dapr enable karein aur deploy karein

`helm/todo-chatbot/templates/backend-deployment.yaml` mein Dapr annotations add karein taake backend ko sidecar mile:

```yaml
annotations:
  dapr.io/enabled: "true"
  dapr.io/app-id: "todo-backend"
  dapr.io/app-port: "8001"
```

Backend env `values.yaml` mein ya `--set` se set karein:

- `USE_DAPR_PUBSUB=true` (ya jo bhi aapka code check karta hai).
- `DAPR_HTTP_PORT=3500`.

App install karein (`phase-2` se):

```bash
helm install todo ./helm/todo-chatbot \
  --set secret.databaseUrl="postgresql+asyncpg://..." \
  --set secret.betterAuthSecret="your-secret" \
  --set secret.openrouterApiKey="sk-or-..." \
  --set backend.service.nodePort=30081 \
  --set frontend.service.nodePort=30080
```

### B.6 App tak pahunchna

- Frontend: `http://$(minikube ip):30080`  
- Backend API: `http://$(minikube ip):30081`  
Ya: `minikube service todo-frontend` aur `minikube service todo-backend`.

### B.7 Events verify karein

UI mein task create/complete karein; Dapr sidecar logs ya Redpanda mein `task-events` / `reminders` par messages dekhein. Agar Recurring Task Service deploy ki hai to ek recurring task complete karein aur confirm karein ke next occurrence aa raha hai.

---

## Part C: Cloud Deployment (DOKS / GKE / AKS)

### C.1 Redpanda Cloud

1. [redpanda.com/cloud](https://redpanda.com/cloud) par sign up karein.  
2. **Serverless** cluster banaein (free tier).  
3. Topics banaein: `task-events`, `reminders` (aur optional `task-updates`).  
4. **Bootstrap URL** aur **SASL credentials** (username/password) copy karein.

Redpanda ke liye K8s Secret banaein (apna namespace use karein):

```bash
kubectl create secret generic redpanda-secret \
  --from-literal=username=YOUR_REDPANDA_USER \
  --from-literal=password=YOUR_REDPANDA_PASSWORD \
  -n default
```

### C.2 Redpanda Cloud ke liye Dapr Pub/Sub

Ek Dapr component banaein (maslan `deploy/dapr/components/pubsub-redpanda-cloud.yaml`) jo Redpanda Cloud use kare:

- `brokers`: aapka cluster bootstrap URL (maslan `xxx.cloud.redpanda.com:9092`).
- `authType`: `sasl`.
- `saslUsername` / `saslPassword`: `secretKeyRef` se jo `redpanda-secret` ko point kare.

App jis namespace mein hai usi par apply karein.

### C.3 Kubernetes cluster banaein (ek provider)

**DigitalOcean (DOKS):**

1. DO dashboard se Kubernetes cluster banaein.  
2. Config download karein aur `KUBECONFIG` set karein ya `~/.kube/config` mein merge karein.  
3. `kubectl get nodes` se confirm karein.

**Google Cloud (GKE):**

```bash
gcloud container clusters create todo-cluster --zone YOUR_ZONE --num-nodes 1
gcloud container clusters get-credentials todo-cluster --zone YOUR_ZONE
```

**Azure (AKS):**

```bash
az aks create --resource-group myResourceGroup --name todo-aks --node-count 1
az aks get-credentials --resource-group myResourceGroup --name todo-aks
```

### C.4 Cloud cluster par Dapr install karein

```bash
dapr init -k
kubectl get pods -n dapr-system
```

Dapr components apply karein (Redpanda Cloud ke liye Pub/Sub, agar use ho to Secret store).

### C.5 Images registry par push karein

Backend aur frontend build karke aisi registry par push karein jahan se cluster pull kar sake (Docker Hub, GCR, ACR, DO Container Registry). Example (Docker Hub):

```bash
docker build -t YOUR_USERNAME/todo-backend:latest phase-2/backend
docker push YOUR_USERNAME/todo-backend:latest
docker build --build-arg BACKEND_URL=http://todo-backend:8001 -t YOUR_USERNAME/todo-frontend:latest phase-2/frontend
docker push YOUR_USERNAME/todo-frontend:latest
```

### C.6 Helm se deploy karein

`backend.image.repository` aur `frontend.image.repository` apne registry path par set karein. Example:

```bash
helm install todo ./helm/todo-chatbot \
  --set backend.image.repository=YOUR_USERNAME/todo-backend \
  --set frontend.image.repository=YOUR_USERNAME/todo-frontend \
  --set secret.databaseUrl="postgresql+asyncpg://..." \
  --set secret.betterAuthSecret="..." \
  --set secret.openrouterApiKey="sk-or-..." \
  --set backend.service.nodePort=30081 \
  --set frontend.service.nodePort=30080
```

Production ke liye NodePort ki jagah Load Balancer ya Ingress use karein aur `backend.image.pullPolicy=Always` set karein.

### C.7 CI/CD (GitHub Actions)

Example workflow: `main` par push par backend aur frontend images build karein, registry par push karein, phir `helm upgrade --install` (ya `kubectl apply`) chalaein. Cluster kubeconfig ya provider-specific auth (maslan OIDC, service account key) GitHub Secrets mein rakhein. Example step:

```yaml
- name: Deploy with Helm
  run: |
    helm upgrade --install todo ./helm/todo-chatbot \
      --set backend.image.repository=$REGISTRY/todo-backend \
      --set frontend.image.repository=$REGISTRY/todo-frontend \
      --set secret.databaseUrl="${{ secrets.DATABASE_URL }}" \
      ...
```

### C.8 Monitoring aur logging

- **Metrics:** Cloud provider ke metrics use karein (DO Monitoring, GCP Monitoring, Azure Monitor) ya cluster mein Prometheus install karein.  
- **Logs:** App logs stdout par aayein; provider ki log aggregation use karein (DO Logs, Cloud Logging, Log Analytics) ya log collector (maslan Fluent Bit).  
- Optional: alerts define karein (maslan pod not ready, zyada errors).

---

## Verification Checklist (Verify karne ka checklist)

- [ ] Part B (Minikube): `kubectl get pods` se backend aur frontend Running; Dapr sidecars maujood; task create karne par error na aaye; events Dapr/Redpanda mein dikhein.  
- [ ] Part C (Cloud): Same; app LB/Ingress se reachable; Redpanda Cloud ko events mil rahe hon; CI/CD pipeline chal kar deployment update kare.  
- [ ] Recurring task: Ek recurring task complete karein; next occurrence aaye (Recurring Task Service ya existing logic se).  
- [ ] Chat: Login karke chat use karein; OpenRouter (ya configured LLM) jawab de.

---

## Troubleshooting (Masail ka hal)

| Masla | Kya check karein |
|-------|-------------------|
| Pods start nahi ho rahe | `kubectl describe pod <name>`; image pull, env, aur Dapr component names. |
| “Backend unreachable” | Backend port (8001), service name, aur frontend ka `BACKEND_URL` (Next.js ke liye build-time). |
| Kafka mein events nahi | Dapr component ka `brokers` aur (Redpanda Cloud ke liye) SASL secret; backend env `USE_DAPR_PUBSUB` aur `DAPR_HTTP_PORT`. |
| LLM se 401 | Helm secret aur backend env mein `OPENROUTER_API_KEY` (ya equivalent). |
| Dapr sidecar inject nahi ho raha | Deployment par annotations: `dapr.io/enabled`, `dapr.io/app-id`, `dapr.io/app-port`. |

---

## Reference

- **Phase IV (base deploy):** `PHASE4-MINIKUBE-DEPLOY.md`  
- **Phase V spec / plan / tasks:** `specs/phase5-advanced-cloud/`  
- **Phase V roadmap:** `PHASE5-ROADMAP.md`  
- **Redpanda local:** `deploy/redpanda/docker-compose.redpanda.yml`  
- **Dapr Pub/Sub (local):** `deploy/dapr/components/pubsub-kafka.yaml`
