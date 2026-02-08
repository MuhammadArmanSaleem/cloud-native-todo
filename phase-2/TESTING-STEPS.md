# Kya kiya gaya hai – aur UI mein kahan check karein

## Pehle: Backend + Frontend chalao

1. **Backend** (ek terminal):
   ```powershell
   cd phase-2\backend
   .venv\Scripts\activate
   uv run uvicorn main:app --reload --port 8001 --host 0.0.0.0
   ```
2. **Frontend** (dusra terminal):
   ```powershell
   cd phase-2\frontend
   npm run dev
   ```
3. Browser mein jao: **http://localhost:3000**

---

## UI steps – kya test karein

### Step 1: Home / redirect
- **Kahan:** `http://localhost:3000/`
- **Kya dekho:** Pehle "Loading...", phir:
  - Agar login nahi hai → **/login** pe redirect
  - Agar login hai → **/tasks** pe redirect

### Step 2: Sign up (naya user)
- **Kahan:** `http://localhost:3000/signup` (ya Login page se "Sign up" link)
- **Kya karo:** Email, password daalo → Sign up
- **Kya check karo:** Redirect to **/tasks** (ya login page pe success ke baad login karo)

### Step 3: Login
- **Kahan:** `http://localhost:3000/login`
- **Kya karo:** Wahi email/password se login
- **Kya check karo:** Login ke baad **/tasks** pe jana chahiye

### Step 4: Tasks list (Phase II + III)
- **Kahan:** `http://localhost:3000/tasks`
- **Kya dekho:**
  - Task list (empty ya jo tasks hain)
  - Naya task add karne ka form/button
  - Filters, sort, language switcher (agar hai)
- **Test:** Ek naya task add karo (title, optional priority/due date) → list mein dikhna chahiye

### Step 5: Task detail (edit, delete, comments, attachments)
- **Kahan:** Tasks list se kisi task pe click → **/tasks/[id]**
- **Kya check karo:**
  - Task title, description, due date, priority
  - Edit, Delete
  - Comments add/dekhna
  - Attachments upload/dekhna (agar implemented)

### Step 6: Chat (Phase III – AI Todo Chatbot)
- **Kahan:** Sidebar/header se **Chat** link → `http://localhost:3000/chat`
- **Kya karo:**
  - "Show my tasks" likho → apne tasks list aani chahiye
  - "Add a task: Buy milk" likho → naya task ban ke list mein aana chahiye
- **Kya check karo:** Response sahi aaye, koi 401/500 na aaye (agar aaye to backend logs + OPENROUTER_API_KEY check karo)

### Step 7: Profile
- **Kahan:** `http://localhost:3000/profile`
- **Kya dekho:** Profile form (name, email, etc.) – edit karke save check karo

### Step 8: Roles (agar enabled ho)
- **Kahan:** `http://localhost:3000/roles`
- **Kya dekho:** Role badges / selector (admin, user, etc.)

---

## Phase IV (Docker + Minikube) – alag se check

Ye UI nahi, deployment check hai:

1. **Docker images**
   - Backend: `docker build -t todo-backend:latest phase-2/backend`
   - Frontend: `docker build --build-arg BACKEND_URL=http://todo-backend:8001 -t todo-frontend:latest phase-2/frontend`
2. **Minikube + Helm**
   - `PHASE4-MINIKUBE-DEPLOY.md` follow karo
   - Deploy ke baad: `minikube service todo-frontend` se browser khulega → wahi UI steps (login → tasks → chat) wahan bhi test kar sakte ho

---

## Short checklist

| # | Kahan (URL)        | Kya test karna hai                    |
|---|--------------------|----------------------------------------|
| 1 | `/`                | Redirect to login ya /tasks            |
| 2 | `/signup`          | Naya user banao                       |
| 3 | `/login`           | Login → /tasks                         |
| 4 | `/tasks`           | List, add task, filters               |
| 5 | `/tasks/[id]`      | Detail, edit, delete, comments, files |
| 6 | `/chat`            | "Show my tasks", "Add task: ..."       |
| 7 | `/profile`         | Profile edit/save                     |
| 8 | `/roles`           | Roles page (agar use ho)               |

Sab theek hai to backend + frontend dono theek chal rahe hain; agar koi step fail ho to usi URL + action ka error message ya screenshot batao.
