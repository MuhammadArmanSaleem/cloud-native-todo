# Specification: Task Commenting UI

## Feature Description

Implement task commenting functionality that allows users to add and view comments on tasks. Users can post comments with text content, and each comment displays the commenter's name, comment text, and timestamp. Comments are displayed in chronological order and can be added through a validated form. The commenting feature is integrated into the task detail page, with dynamic updates when new comments are added. All comment data uses mock data for now, with no real API integration.

## User Scenarios & Testing

### Scenario 1: Viewing Task Comments
**As a user**, I can see all comments for a task.

**Given** I am viewing a task detail page
**When** I scroll to the comments section
**Then** I see a list of all comments for that task
**And** each comment displays the user name who posted it
**And** each comment displays the comment text
**And** each comment displays a timestamp (e.g., "2 minutes ago" or "2026-01-08 at 3:00 PM")
**And** comments are displayed in chronological order

### Scenario 2: Viewing Task with No Comments
**As a user**, I see a helpful message when a task has no comments.

**Given** I am viewing a task detail page
**When** the task has no comments
**Then** I see an empty state message indicating no comments yet
**And** the message is clear and helpful
**And** I understand how to add the first comment

### Scenario 3: Adding a Comment
**As a user**, I can add a comment to a task.

**Given** I am viewing a task detail page
**When** I enter comment text in the comment form
**And** I click the submit button
**Then** my comment is added to the comment list
**And** my comment appears immediately without page reload
**And** I see a confirmation message that the comment was posted
**And** the comment form is cleared after submission

### Scenario 4: Adding a Valid Comment
**As a user**, I can submit a comment that meets validation requirements.

**Given** I am viewing a task detail page
**When** I enter comment text that is at least 1 character
**And** the comment text is no more than 1000 characters
**And** I click the submit button
**Then** my comment is successfully posted
**And** I see a success confirmation message

### Scenario 5: Comment Validation - Too Short
**As a user**, I receive feedback when my comment is too short.

**Given** I am viewing a task detail page
**When** I try to submit an empty comment
**Then** I see a validation error message
**And** the comment is not posted
**And** the error message is clear and helpful

### Scenario 6: Comment Validation - Too Long
**As a user**, I receive feedback when my comment exceeds the character limit.

**Given** I am viewing a task detail page
**When** I enter comment text that exceeds 1000 characters
**And** I try to submit the comment
**Then** I see a validation error message
**And** the comment is not posted
**And** the error message indicates the character limit

### Scenario 7: Comment Timestamp Display
**As a user**, I can see when each comment was posted.

**Given** I am viewing comments on a task
**When** I look at each comment
**Then** I see a timestamp for each comment
**And** the timestamp is displayed in a readable format (e.g., "2 minutes ago" or "2026-01-08 at 3:00 PM")
**And** the timestamp is clearly associated with its comment

### Scenario 8: Comment Ordering
**As a user**, I can see comments in a logical order.

**Given** I am viewing comments on a task
**When** there are multiple comments
**Then** comments are displayed in chronological order
**And** I can easily follow the conversation flow
**And** the order is consistent and predictable

### Scenario 9: Dynamic Comment Updates
**As a user**, I see new comments appear immediately after posting.

**Given** I am viewing a task detail page
**When** I submit a new comment
**Then** the comment appears in the comment list immediately
**And** no page reload is required
**And** the comment list updates smoothly
**And** I can continue viewing and adding comments

### Scenario 10: Comment Form Accessibility
**As a user**, I can use the comment form with keyboard navigation.

**Given** I am viewing a task detail page
**When** I navigate to the comment form using keyboard
**Then** I can focus on the text area
**And** I can focus on the submit button
**And** I can submit the form using keyboard
**And** focus states are clearly visible

## Functional Requirements

### Comment Section Component
- Component displays a list of comments for a task
- Each comment displays user name (from mock data)
- Each comment displays comment text
- Each comment displays timestamp in readable format
- Comments are displayed in chronological order (oldest first or newest first)
- Component handles empty state (no comments)
- Component follows techy minimalist theme design
- Component is accessible (keyboard navigation, screen readers)

### Add Comment Form Component
- Form includes a text area for entering comment text
- Form includes a submit button to post the comment
- Form uses Formik for state management
- Form validates comment text (minimum 1 character, maximum 1000 characters)
- Form displays validation error messages
- Form clears after successful submission
- Form is accessible (focus states, keyboard navigation)
- Form follows techy minimalist theme design

### Comment Validation
- Comment text must be at least 1 character (not empty)
- Comment text must be no more than 1000 characters
- Validation errors are displayed clearly
- Validation occurs before submission
- Validation prevents invalid comments from being posted

### Task Detail Page Integration
- Comment section is displayed on the task detail page
- Add comment form is displayed on the task detail page
- Comments are displayed below task details
- Comment section and form are clearly separated from task details
- Layout is responsive and works on mobile and desktop

### Comment Submission
- When form is submitted, comment is added to mock data
- Comment is added to the comment list immediately (no page reload)
- Comment list updates dynamically
- Success confirmation is displayed (toast notification)
- Form is cleared after successful submission
- Comment includes user name (from mock data)
- Comment includes timestamp (current time)

### User Feedback
- Success message when comment is posted (toast notification)
- Validation error messages when comment is invalid
- Loading state during submission if needed
- Clear visual feedback for form interactions
- Uses shadcn/ui Toast component for success messages

### Mock Data Structure
- Comments are stored in mock data structure
- Each comment includes: user name, comment text, timestamp
- Comments are associated with specific tasks
- Mock data supports multiple comments per task
- Mock data supports multiple users (for commenter names)

## Success Criteria

- Users can view all comments for a task on the task detail page
- Users can see comment text, user name, and timestamp for each comment
- Comments are displayed in chronological order
- Users can add new comments through a validated form
- Comment validation prevents empty comments and comments exceeding 1000 characters
- New comments appear in the comment list immediately after posting
- Success confirmation is displayed when a comment is posted
- Comment form is cleared after successful submission
- Comment section handles empty state (no comments) gracefully
- All form interactions are accessible via keyboard
- Comment section and form follow the techy minimalist theme design
- Comment list updates dynamically without page reload

## Key Entities

### Comment Data Structure
- Comment ID: unique identifier for each comment
- Task ID: identifier for the task the comment belongs to
- User Name: name of the user who posted the comment (from mock data)
- Comment Text: the actual comment content (1-1000 characters)
- Timestamp: when the comment was posted (formatted for display)

### Comment Form State
- Comment text: current value in the text area
- Validation errors: any validation error messages
- Submission state: whether the form is being submitted
- Success state: whether the comment was successfully posted

### Comment List State
- Comments array: list of all comments for the task
- Loading state: whether comments are being loaded
- Empty state: whether there are no comments

## Edge Cases

- Task with no comments: Show empty state message
- Comment text exactly 1 character: Valid, should be accepted
- Comment text exactly 1000 characters: Valid, should be accepted
- Comment text 1001 characters: Invalid, should show validation error
- Empty comment submission: Show validation error, prevent submission
- Whitespace-only comment: Handle appropriately (trim or validate)
- Very long comment text in display: Handle text wrapping appropriately
- Multiple comments from same user: Display all comments correctly
- Comments with special characters: Display correctly, handle sanitization
- Rapid comment submissions: Handle state updates correctly
- Comment form submission failure: Show error message, allow retry
- Network delay during submission: Show loading state, handle gracefully
- Comment timestamp formatting: Handle various time formats correctly
- Comment ordering with same timestamp: Handle tie-breaking appropriately
- Comment section on very long task detail page: Ensure scrollable and accessible

## Assumptions

- Task detail page already exists
- Formik library is available for form handling
- Yup or Zod validation library is available
- shadcn/ui Toast component is available for feedback
- Mock comment data structure can be created or extended
- Mock user data is available for commenter names
- Timestamp formatting utility is available or can be created
- Comment section is displayed below task details on task detail page
- Comments are per-task (not global)
- No comment editing or deletion functionality needed (add only)
- No comment replies or threading needed (flat comment list)
- No comment moderation needed
- No real API integration needed (mock data only)

## Out of Scope

- Comment editing functionality
- Comment deletion functionality
- Comment replies or threading
- Comment moderation or approval
- Comment reactions or likes
- Comment mentions or @-tagging
- Comment search or filtering
- Comment pagination (all comments displayed)
- Comment sorting options (chronological only)
- Real API integration
- Backend changes
- Database work
- User authentication for comments (mock user data only)
- Comment notifications
- Comment history or versioning
- Rich text formatting in comments (plain text only)
- File attachments in comments
- Comment export functionality


