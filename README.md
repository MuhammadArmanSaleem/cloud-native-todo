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
- UV package manager

## Setup Instructions

1. Clone the repository:
```bash
git clone <your-repo-url>
cd hack-2
```

2. Install dependencies using UV:
```bash
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install .
```

Alternatively, if you don't have UV, you can use pip:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Usage

### Command Line Interface
The application provides a command-line interface with the following commands:

#### Add a Task
```bash
python src/todo_app.py add "Task Title" --desc "Task Description"
```

#### List All Tasks
```bash
python src/todo_app.py list
```

#### Update a Task
```bash
python src/todo_app.py update 1 --title "New Title" --desc "New Description"
```

#### Delete a Task
```bash
python src/todo_app.py delete 1
```

#### Toggle Task Completion
```bash
python src/todo_app.py toggle 1
```

### Examples
```bash
# Add a task
python src/todo_app.py add "Buy groceries" --desc "Milk, eggs, bread"

# List all tasks
python src/todo_app.py list

# Update a task
python src/todo_app.py update 1 --title "Buy weekly groceries"

# Mark task as complete
python src/todo_app.py toggle 1

# Delete a task
python src/todo_app.py delete 1
```

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