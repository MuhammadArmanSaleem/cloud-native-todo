#!/usr/bin/env python3
"""
Todo Console Application - Phase I Implementation
Basic Level Features: Add, Delete, Update, View, Mark Complete (Toggle)
In-Memory Storage Only
"""

import argparse
import json
import sys
from datetime import datetime
from typing import Dict, List, Optional


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


class TodoCLI:
    """Command-line interface for the todo application."""

    def __init__(self):
        self.repo = InMemoryRepository()
        self.service = TodoService(self.repo)
        self.parser = self._create_parser()

    def _create_parser(self) -> argparse.ArgumentParser:
        """Create the argument parser with all commands."""
        parser = argparse.ArgumentParser(
            description="Todo Console Application - Phase I",
            formatter_class=argparse.RawDescriptionHelpFormatter,
            epilog="""
Examples:
  add "Buy groceries" --desc "Milk, eggs, bread"
  list
  update 1 --title "Buy weekly groceries" --desc "Milk, eggs, bread, fruits"
  delete 1
  toggle 1
            """
        )

        subparsers = parser.add_subparsers(dest='command', help='Available commands')

        # Add command
        add_parser = subparsers.add_parser('add', help='Add a new task')
        add_parser.add_argument('title', help='Task title (1-200 characters)')
        add_parser.add_argument('--desc', '--description', dest='description', default='',
                               help='Task description (optional, max 1000 characters)')

        # List command
        list_parser = subparsers.add_parser('list', help='List all tasks')

        # Update command
        update_parser = subparsers.add_parser('update', help='Update a task')
        update_parser.add_argument('id', type=int, help='Task ID to update')
        update_parser.add_argument('--title', help='New title (1-200 characters)')
        update_parser.add_argument('--desc', '--description', dest='description',
                                   help='New description (max 1000 characters)')

        # Delete command
        delete_parser = subparsers.add_parser('delete', help='Delete a task')
        delete_parser.add_argument('id', type=int, help='Task ID to delete')

        # Toggle command
        toggle_parser = subparsers.add_parser('toggle', help='Toggle task completion status')
        toggle_parser.add_argument('id', type=int, help='Task ID to toggle')

        return parser

    def run(self, args=None):
        """Run the CLI application."""
        if args is None:
            args = sys.argv[1:]

        if not args:
            self.parser.print_help()
            return 0

        parsed_args = self.parser.parse_args(args)

        if parsed_args.command == 'add':
            result = self.service.add_task(parsed_args.title, parsed_args.description)
        elif parsed_args.command == 'list':
            result = self.service.list_tasks()
        elif parsed_args.command == 'update':
            result = self.service.update_task(
                parsed_args.id,
                parsed_args.title,
                parsed_args.description
            )
        elif parsed_args.command == 'delete':
            result = self.service.delete_task(parsed_args.id)
        elif parsed_args.command == 'toggle':
            result = self.service.toggle_task(parsed_args.id)
        else:
            self.parser.print_help()
            return 0

        if result['success']:
            if 'task' in result:
                self._print_task(result['task'])
            elif 'tasks' in result:
                self._print_tasks(result['tasks'])
            elif 'message' in result:
                print(result['message'])
            return 0
        else:
            print(f"Error: {result['error']}", file=sys.stderr)
            return 1

    def _print_task(self, task: Dict):
        """Print a single task in a formatted way."""
        status = "X" if task['completed'] else "O"
        print(f"[{status}] ID: {task['id']}")
        print(f"    Title: {task['title']}")
        if task['description']:
            print(f"    Desc:  {task['description']}")
        print(f"    Created: {task['created_at']}")
        print(f"    Updated: {task['updated_at']}")
        print()

    def _print_tasks(self, tasks: List[Dict]):
        """Print all tasks in a formatted list."""
        if not tasks:
            print("No tasks found.")
            return

        # Print header
        print(f"{'ID':<4} {'Status':<8} {'Title':<30} {'Description'}")
        print("-" * 80)

        # Print each task
        for task in tasks:
            status = "X" if task['completed'] else "O"
            title = task['title'][:28] + ".." if len(task['title']) > 30 else task['title']
            desc = task['description'][:30] + ".." if len(task['description']) > 30 else task['description']
            print(f"{task['id']:<4} {status:<8} {title:<30} {desc}")


def main():
    """Main entry point."""
    cli = TodoCLI()
    exit_code = cli.run()
    sys.exit(exit_code)


if __name__ == "__main__":
    main()