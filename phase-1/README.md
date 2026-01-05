# Hackathon II: The Evolution of Todo - Phase I

## Overview
This is Phase I of "The Evolution of Todo" hackathon project - an in-memory Python console Todo application implementing Basic Level features using spec-driven development with Claude Code and Spec-Kit Plus.

**Phase I Submission Tag**: This repository corresponds to the Phase I submission for the hackathon.

## Features
- **Add Task**: Create new todo items with title and optional description
- **Delete Task**: Remove tasks from the list
- **Update Task**: Modify existing task details
- **View Task List**: Display all tasks with status indicators
- **Mark as Complete**: Toggle task completion status

## Technology Stack
- Python 3.13+
- UV (package manager)
- Claude Code
- Spec-Kit Plus

## Prerequisites
- Python 3.13 or higher
- UV package manager (recommended) or pip

## Setup Instructions

### Step 1: Install UV (if not already installed)

**Windows (PowerShell):**
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**macOS/Linux:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Note:** After installation, restart your terminal or add UV to your PATH:
- Windows: `C:\Users\<YourUsername>\.local\bin`
- macOS/Linux: `~/.local/bin`

### Step 2: Clone the repository (if needed)
```bash
git clone <your-repo-url>
cd hack-2
```

### Step 3: Create virtual environment and install dependencies

**Using UV (Recommended):**
```powershell
# Windows PowerShell
uv venv
.venv\Scripts\activate
uv sync
```

```bash
# macOS/Linux
uv venv
source .venv/bin/activate
uv sync
```

**Alternative: Using pip**
```powershell
# Windows PowerShell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

```bash
# macOS/Linux
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Usage

### Interactive Mode (Default)
The application runs in interactive mode with a menu-driven interface:

```powershell
# Windows
python src/todo_app.py
```

```bash
# macOS/Linux
python src/todo_app.py
```

**Navigation:**
- Use **↑/↓ arrow keys** to navigate menu options
- Press **Enter** to select
- Follow on-screen prompts to add, view, update, delete, or toggle tasks

**Main Menu Options:**
1. **View All Tasks** - Display all tasks with their status
2. **Add New Task** - Create a new todo item
3. **Update Task** - Modify an existing task
4. **Delete Task** - Remove a task from the list
5. **Toggle Task Completion** - Mark task as complete/incomplete
6. **Exit** - Quit the application

## Data Model
Each task contains:
- `id`: Unique identifier (integer, auto-generated)
- `title`: Required string (1-200 characters)
- `description`: Optional string (max 1000 characters)
- `completed`: Boolean flag (default: False)
- `created_at`: Timestamp (ISO format)
- `updated_at`: Timestamp (ISO format, updated on modification)

## Architecture
- **CLI Interface**: Command parsing and user interaction
- **Service Layer**: Business logic and validation
- **Repository Layer**: In-memory data storage and retrieval
- **Domain Model**: Task data structure and validation

## Spec-Driven Development
This project follows spec-driven development methodology:
- Specifications are located in the `/specs` directory
- Implementation is generated using Claude Code based on specifications
- No manual coding was performed - all code generated via Claude Code

## Repository Structure
```
├── .specify/           # Spec-Kit configuration and memory
├── specs/             # Specification files
│   └── features/      # Feature specifications
│       └── task-crud.md
├── src/               # Python source code
│   └── todo_app.py
├── history/           # Prompt history records
├── README.md          # This file
└── CLAUDE.md          # Claude Code instructions
```

## Phase I Requirements Met
✅ All 5 Basic Level features implemented (Add, Delete, Update, View, Mark Complete)
✅ In-memory storage only (no persistence)
✅ Spec-driven development with Claude Code
✅ Clean code principles and proper Python project structure
✅ Working console application demonstrating all required functionality

## Next Phases
This implementation serves as the foundation for:
- Phase II: Full-Stack Web Application
- Phase III: AI-Powered Todo Chatbot
- Phase IV: Local Kubernetes Deployment
- Phase V: Advanced Cloud Deployment