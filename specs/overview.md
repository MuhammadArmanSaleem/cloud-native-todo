# Todo App Overview - Phase I

## Purpose
This is Phase I of "The Evolution of Todo" hackathon project - an in-memory Python console Todo application implementing Basic Level features using spec-driven development with Claude Code and Spec-Kit Plus.

## Current Phase
Phase I: In-Memory Python Console Application

## Tech Stack
- Python 3.13+
- UV package manager
- Claude Code for implementation
- Spec-Kit Plus for specification management

## Features In Scope
- [x] Task CRUD operations (Create, Read, Update, Delete)
- [x] Mark task complete/incomplete (toggle)
- [x] In-memory storage only
- [x] CLI interface
- [x] Basic validation (title: 1-200 chars, description: 0-1000 chars)

## Features Out of Scope
- Database persistence
- Authentication or user management
- Web UI
- Chatbot integration
- Advanced features (tags, priorities, due dates, recurring tasks)
- Network connectivity or remote storage

## Demo Flow
1. Add a new task: `python src/todo_app.py add "Buy groceries" --desc "Milk, eggs, bread"`
2. List all tasks: `python src/todo_app.py list`
3. Update a task: `python src/todo_app.py update 1 --title "Buy weekly groceries"`
4. Toggle completion: `python src/todo_app.py toggle 1`
5. Delete a task: `python src/todo_app.py delete 1`

## Acceptance Criteria
- All 5 Basic Level features work correctly
- Application runs fully in memory
- CLI outputs are clear and consistent
- Error handling is robust
- No advanced features are implemented
- Demo can be completed in under 90 seconds