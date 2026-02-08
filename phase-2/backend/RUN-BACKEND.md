# Run backend (PowerShell)

Path mein space hai ("Arman Saleem") isliye path **quotes** mein likho.

**Pehle dependencies (Gemini ke liye):** `uv sync` ya `pip install -r requirements.txt`

**Terminal 1 – Backend (port 8001):**

```powershell
cd "C:\Users\Arman Saleem\Desktop\Codes\cloud-native-todo\phase-3\phase-2\backend"
uv run uvicorn main:app --reload --port 8001 --host 0.0.0.0
```

Port 8000 agar "forbidden" aaye to 8001 use karo (frontend already 8001 use karta hai).
