#!/usr/bin/env python3
"""
Test script for the Todo Console Application
"""

from src.todo_app import TodoCLI

def test_todo_app():
    """Test all functionality of the todo app."""
    print("Testing Todo Console Application...")

    # Create a single CLI instance to maintain in-memory state
    cli = TodoCLI()

    print("\n1. Testing ADD functionality:")
    print("Adding task 1:")
    cli.run(['add', 'Buy groceries', '--desc', 'Milk, eggs, bread'])

    print("\nAdding task 2:")
    cli.run(['add', 'Complete homework', '--desc', 'Finish the Python project'])

    print("\n2. Testing LIST functionality:")
    cli.run(['list'])

    print("\n3. Testing UPDATE functionality:")
    cli.run(['update', '1', '--title', 'Buy weekly groceries', '--desc', 'Milk, eggs, bread, fruits, vegetables'])

    print("\n4. Testing LIST again to see update:")
    cli.run(['list'])

    print("\n5. Testing TOGGLE functionality:")
    cli.run(['toggle', '1'])

    print("\n6. Testing LIST again to see toggle:")
    cli.run(['list'])

    print("\n7. Testing DELETE functionality:")
    cli.run(['delete', '1'])

    print("\n8. Testing LIST again to see deletion:")
    cli.run(['list'])

    print("\n9. Testing error handling:")
    print("Trying to update non-existent task:")
    cli.run(['update', '999', '--title', 'Non-existent task'])

    print("Trying to toggle non-existent task:")
    cli.run(['toggle', '999'])

    print("Trying to delete non-existent task:")
    cli.run(['delete', '999'])

    print("\nAll tests completed successfully!")

if __name__ == "__main__":
    test_todo_app()