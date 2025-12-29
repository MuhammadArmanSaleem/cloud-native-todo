#!/usr/bin/env python3
"""
Interactive Todo Console Application - Phase I Implementation
Basic Level Features: Add, Delete, Update, View, Mark Complete (Toggle)
Interactive CLI with arrow key navigation
"""

import json
import sys
from datetime import datetime
from typing import Dict, List, Optional
import inquirer


class Task:
    """Represents a single todo task with validation."""

    def __init__(self, task_id: int, title: str, description: str = "", completed: bool = False):
        self.id = task_id
        self.title = self._validate_title(title)
        self.description = self._validate_description(description)
        self.completed = completed
        self.created_at = datetime.now().isoformat()
        self.updated_at = datetime.now().isoformat()

    def _validate_title(self, title: str) -> str:
        """Validate title length (1-200 characters)."""
        if not title or len(title.strip()) == 0:
            raise ValueError("Title is required (1-200 characters)")
        if len(title) > 200:
            raise ValueError("Title must be 1-200 characters")
        return title.strip()

    def _validate_description(self, description: str) -> str:
        """Validate description length (0-1000 characters)."""
        if len(description) > 1000:
            raise ValueError("Description must be 0-1000 characters")
        return description

    def update(self, title: Optional[str] = None, description: Optional[str] = None):
        """Update task fields and update timestamp."""
        if title is not None:
            self.title = self._validate_title(title)
        if description is not None:
            self.description = self._validate_description(description)
        self.updated_at = datetime.now().isoformat()

    def toggle_completion(self):
        """Toggle completion status and update timestamp."""
        self.completed = not self.completed
        self.updated_at = datetime.now().isoformat()

    def to_dict(self) -> Dict:
        """Convert task to dictionary for serialization."""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "completed": self.completed,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    def __str__(self):
        """String representation for display."""
        status = "✓" if self.completed else "○"
        return f"[{status}] {self.id}: {self.title}"


class InMemoryRepository:
    """In-memory storage for tasks."""

    def __init__(self):
        self._tasks: Dict[int, Task] = {}
        self._next_id = 1

    def add_task(self, title: str, description: str = "") -> Task:
        """Add a new task and return it."""
        task = Task(self._next_id, title, description)
        self._tasks[self._next_id] = task
        self._next_id += 1
        return task

    def get_task(self, task_id: int) -> Optional[Task]:
        """Get a task by ID."""
        return self._tasks.get(task_id)

    def get_all_tasks(self) -> List[Task]:
        """Get all tasks."""
        return list(self._tasks.values())

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> Optional[Task]:
        """Update a task by ID."""
        task = self.get_task(task_id)
        if task:
            task.update(title, description)
            return task
        return None

    def delete_task(self, task_id: int) -> bool:
        """Delete a task by ID."""
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False

    def toggle_task_completion(self, task_id: int) -> Optional[Task]:
        """Toggle completion status of a task by ID."""
        task = self.get_task(task_id)
        if task:
            task.toggle_completion()
            return task
        return None


class TodoService:
    """Business logic layer for todo operations."""

    def __init__(self, repository: InMemoryRepository):
        self.repo = repository

    def add_task(self, title: str, description: str = "") -> Dict:
        """Add a new task."""
        try:
            task = self.repo.add_task(title, description)
            return {
                "success": True,
                "task": task.to_dict(),
                "message": f"Task '{task.title}' added successfully with ID {task.id}"
            }
        except ValueError as e:
            return {
                "success": False,
                "error": str(e)
            }

    def list_tasks(self) -> Dict:
        """List all tasks."""
        tasks = self.repo.get_all_tasks()
        return {
            "success": True,
            "tasks": [task.to_dict() for task in tasks]
        }

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> Dict:
        """Update a task."""
        try:
            task = self.repo.update_task(task_id, title, description)
            if task:
                return {
                    "success": True,
                    "task": task.to_dict(),
                    "message": f"Task {task_id} updated successfully"
                }
            else:
                return {
                    "success": False,
                    "error": f"Task ID {task_id} not found"
                }
        except ValueError as e:
            return {
                "success": False,
                "error": str(e)
            }

    def delete_task(self, task_id: int) -> Dict:
        """Delete a task."""
        success = self.repo.delete_task(task_id)
        if success:
            return {
                "success": True,
                "message": f"Task {task_id} deleted successfully"
            }
        else:
            return {
                "success": False,
                "error": f"Task ID {task_id} not found"
            }

    def toggle_task(self, task_id: int) -> Dict:
        """Toggle task completion status."""
        task = self.repo.toggle_task_completion(task_id)
        if task:
            status = "completed" if task.completed else "pending"
            return {
                "success": True,
                "task": task.to_dict(),
                "message": f"Task {task_id} marked as {status}"
            }
        else:
            return {
                "success": False,
                "error": f"Task ID {task_id} not found"
            }


class InteractiveTodoCLI:
    """Interactive command-line interface for the todo application."""

    def __init__(self):
        self.repo = InMemoryRepository()
        self.service = TodoService(self.repo)

    def display_tasks(self):
        """Display all tasks in a formatted way."""
        tasks = self.repo.get_all_tasks()
        if not tasks:
            print("\nNo tasks found.")
            return

        print("\n" + "="*60)
        print("YOUR TODO LIST")
        print("="*60)
        for task in tasks:
            status = "✓" if task.completed else "○"
            print(f"[{status}] ID: {task.id}")
            print(f"    Title: {task.title}")
            if task.description:
                print(f"    Desc:  {task.description}")
            print(f"    Created: {task.created_at[:19]}")
            print(f"    Updated: {task.updated_at[:19]}")
            print("-" * 40)
        print("="*60)

    def add_task_interactive(self):
        """Interactive task addition."""
        print("\n--- ADD NEW TASK ---")
        title = input("Enter task title (1-200 characters): ").strip()
        if not title:
            print("Error: Title is required")
            return

        description = input("Enter task description (optional, max 1000 characters): ").strip()

        result = self.service.add_task(title, description)
        if result['success']:
            print(f"✓ {result['message']}")
        else:
            print(f"✗ Error: {result['error']}")

    def select_task(self, action: str) -> Optional[Task]:
        """Interactive task selection using inquirer."""
        tasks = self.repo.get_all_tasks()
        if not tasks:
            print("\nNo tasks available.")
            return None

        task_choices = [f"{task.id}: {task.title} [{'✓' if task.completed else '○'}]" for task in tasks]
        task_choices.append("Cancel")

        questions = [
            inquirer.List('task',
                         message=f"Select task to {action}",
                         choices=task_choices,
                         carousel=True)
        ]

        answers = inquirer.prompt(questions)
        if not answers or answers['task'] == "Cancel":
            return None

        # Extract task ID from the selection
        selected_id = int(answers['task'].split(':')[0])
        return self.repo.get_task(selected_id)

    def update_task_interactive(self):
        """Interactive task update."""
        print("\n--- UPDATE TASK ---")
        task = self.select_task("update")
        if not task:
            return

        print(f"Current task: {task.title}")
        if task.description:
            print(f"Current description: {task.description}")

        new_title = input(f"Enter new title (or press Enter to keep '{task.title}'): ").strip()
        new_title = new_title if new_title else None

        new_desc = input(f"Enter new description (or press Enter to keep current): ").strip()
        new_desc = new_desc if new_desc else None

        result = self.service.update_task(task.id, new_title, new_desc)
        if result['success']:
            print(f"✓ {result['message']}")
        else:
            print(f"✗ Error: {result['error']}")

    def delete_task_interactive(self):
        """Interactive task deletion."""
        print("\n--- DELETE TASK ---")
        task = self.select_task("delete")
        if not task:
            return

        confirm = input(f"Are you sure you want to delete task '{task.title}'? (y/N): ").lower()
        if confirm == 'y':
            result = self.service.delete_task(task.id)
            if result['success']:
                print(f"✓ {result['message']}")
            else:
                print(f"✗ Error: {result['error']}")
        else:
            print("Deletion cancelled.")

    def toggle_task_interactive(self):
        """Interactive task completion toggle."""
        print("\n--- TOGGLE TASK COMPLETION ---")
        task = self.select_task("toggle")
        if not task:
            return

        result = self.service.toggle_task(task.id)
        if result['success']:
            status = "completed" if result['task']['completed'] else "pending"
            print(f"✓ Task {task.id} marked as {status}")
        else:
            print(f"✗ Error: {result['error']}")

    def run(self):
        """Run the interactive CLI application."""
        print("Welcome to the Interactive Todo App!")
        print("Use arrow keys to navigate menus.")

        while True:
            print("\n" + "="*50)
            print("TODO APP - MAIN MENU")
            print("="*50)

            choices = [
                "View All Tasks",
                "Add New Task",
                "Update Task",
                "Delete Task",
                "Toggle Task Completion",
                "Exit"
            ]

            questions = [
                inquirer.List('action',
                             message="Select an action",
                             choices=choices,
                             carousel=True)
            ]

            answers = inquirer.prompt(questions)

            if not answers:
                break

            action = answers['action']

            if action == "View All Tasks":
                self.display_tasks()
            elif action == "Add New Task":
                self.add_task_interactive()
            elif action == "Update Task":
                self.update_task_interactive()
            elif action == "Delete Task":
                self.delete_task_interactive()
            elif action == "Toggle Task Completion":
                self.toggle_task_interactive()
            elif action == "Exit":
                print("Thank you for using the Todo App!")
                break

            # Wait for user to see the result before showing menu again
            input("\nPress Enter to continue...")


def main():
    """Main entry point."""
    cli = InteractiveTodoCLI()
    cli.run()


if __name__ == "__main__":
    main()