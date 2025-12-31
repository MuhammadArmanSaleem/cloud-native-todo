# Quick Start Guide - Todo App

## Quick Setup (Windows PowerShell)

### 1. Install UV (if needed)
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 2. Create virtual environment
```powershell
uv venv
```

### 3. Activate virtual environment
```powershell
.venv\Scripts\activate
```

### 4. Install dependencies
```powershell
uv sync
```

### 5. Run the app
```powershell
python src/todo_app.py
```

## Quick Setup (macOS/Linux)

### 1. Install UV (if needed)
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Create virtual environment
```bash
uv venv
```

### 3. Activate virtual environment
```bash
source .venv/bin/activate
```

### 4. Install dependencies
```bash
uv sync
```

### 5. Run the app
```bash
python src/todo_app.py
```

## Using the App

Once running, you'll see an interactive menu:
- Use **↑/↓ arrow keys** to navigate
- Press **Enter** to select
- Follow prompts to manage your tasks

## Troubleshooting

**ModuleNotFoundError: No module named 'inquirer'**
- Make sure you've activated the virtual environment: `.venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (macOS/Linux)
- Run `uv sync` to install dependencies

**'uv' is not recognized**
- Install UV using the commands above
- Restart your terminal after installation
- Or manually add UV to your PATH

