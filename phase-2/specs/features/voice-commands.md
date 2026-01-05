# Feature: Voice Commands (Bonus +100)

## Objective

Add voice input for todo commands.

## Requirements

- Voice input for creating tasks
- Voice commands for task operations
- Speech-to-text conversion
- Voice feedback (optional)

## User Stories

- As a user, I can create a task by speaking
- As a user, I can use voice commands to mark tasks complete
- As a user, I can use voice commands to delete tasks
- As a user, I can search tasks by voice

## Acceptance Criteria

### Voice Input
- Speech-to-text for task creation
- Voice command recognition
- Browser Speech Recognition API
- Fallback for unsupported browsers

### Voice Commands
- "Create task [title]"
- "Mark task [number] complete"
- "Delete task [number]"
- "Search [keyword]"

### UI/UX
- Voice input button
- Visual feedback during recording
- Show recognized text
- Error handling for recognition failures

## Technical Implementation

- Web Speech API (SpeechRecognition)
- Command parsing logic
- Integration with existing API
- Error handling and fallbacks

## Browser Support

- Chrome/Edge: Full support
- Firefox: Limited support
- Safari: Limited support
- Fallback: Manual input always available

