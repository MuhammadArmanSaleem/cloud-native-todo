# Specification: Task Sharing UI

## Feature Description

Implement task sharing functionality that allows users to share tasks with others via email or a generated link. Users can access sharing options through a share button on task cards and task detail pages, which opens a modal dialog with email and link sharing options. Sharing functionality is mocked for now, with no real email sending or link generation, but provides a foundation for future backend integration. The sharing feature includes user feedback through toast notifications and follows the existing techy minimalist theme design.

## User Scenarios & Testing

### Scenario 1: Accessing Share Options from Task Card
**As a user**, I can access sharing options from a task card.

**Given** I am viewing a task card in the task list
**When** I click the share button on the task card
**Then** a modal dialog opens with sharing options
**And** I can see email sharing and link sharing options
**And** the modal is clearly visible and accessible

### Scenario 2: Accessing Share Options from Task Detail Page
**As a user**, I can access sharing options from the task detail page.

**Given** I am viewing a task detail page
**When** I click the share button on the task detail page
**Then** a modal dialog opens with sharing options
**And** I can see email sharing and link sharing options
**And** the modal is clearly visible and accessible

### Scenario 3: Sharing Task via Email
**As a user**, I can share a task via email.

**Given** I have opened the share modal for a task
**When** I select the email sharing option
**And** I enter an email address (or use mock email)
**And** I confirm the email share action
**Then** the sharing action is processed (mocked)
**And** I see a confirmation message that the task was shared via email
**And** the modal closes or shows success state

### Scenario 4: Sharing Task via Link
**As a user**, I can share a task via a generated link.

**Given** I have opened the share modal for a task
**When** I select the link sharing option
**And** I click to generate or copy the link
**Then** a task link is generated (mocked)
**And** the link is displayed in the modal
**And** I can copy the link to clipboard
**And** I see a confirmation message that the link was copied

### Scenario 5: Copying Share Link to Clipboard
**As a user**, I can copy the generated share link to my clipboard.

**Given** I have generated a share link for a task
**When** I click the copy button next to the link
**Then** the link is copied to my clipboard
**And** I see a confirmation message that the link was copied
**And** I can paste the link elsewhere

### Scenario 6: Closing Share Modal
**As a user**, I can close the share modal without sharing.

**Given** I have opened the share modal for a task
**When** I click the close button or click outside the modal
**Then** the modal closes
**And** no sharing action is performed
**And** I return to the previous view

### Scenario 7: Share Modal Accessibility
**As a user**, I can use the share modal with keyboard navigation.

**Given** I have opened the share modal for a task
**When** I navigate using keyboard
**Then** I can focus on all interactive elements
**And** I can select sharing options using keyboard
**And** I can close the modal using keyboard (Escape key)
**And** focus states are clearly visible

### Scenario 8: Share Button Visibility
**As a user**, I can see the share button on task cards and task detail pages.

**Given** I am viewing a task card or task detail page
**When** I look for the share button
**Then** the share button is visible and clearly labeled
**And** the button follows the techy minimalist theme design
**And** the button is accessible via keyboard navigation

## Functional Requirements

### Share Button Component
- Share button is displayed on task cards
- Share button is displayed on task detail pages
- Share button is clearly visible and labeled
- Share button follows techy minimalist theme design
- Share button is accessible (keyboard navigation, screen readers)
- Clicking share button opens the share modal

### Share Modal Component
- Modal displays when share button is clicked
- Modal includes email sharing option
- Modal includes link sharing option
- Modal can be closed via close button
- Modal can be closed by clicking outside the modal
- Modal can be closed via Escape key
- Modal follows techy minimalist theme design
- Modal is accessible (keyboard navigation, focus management, screen readers)

### Email Sharing Option
- Email sharing option is displayed in the modal
- Email sharing option is clearly labeled
- When selected, email sharing form or action is shown
- Email address input or mock email is used
- Email sharing action can be confirmed
- Email sharing is mocked (e.g., console log, toast confirmation)
- Success confirmation is displayed after email sharing

### Link Sharing Option
- Link sharing option is displayed in the modal
- Link sharing option is clearly labeled
- When selected, link generation is triggered
- Generated link is displayed in the modal
- Link can be copied to clipboard
- Link generation is mocked (e.g., generate mock URL)
- Copy to clipboard functionality works
- Success confirmation is displayed after copying link

### Share Link Generation
- Share link is generated when link sharing is selected
- Generated link is a mock URL (e.g., `/tasks/{taskId}/shared/{shareToken}`)
- Link is unique for each task
- Link is displayed in a readable format
- Link can be copied to clipboard
- Link generation is mocked (no real backend integration)

### Copy to Clipboard Functionality
- Copy button is displayed next to the generated link
- Clicking copy button copies link to clipboard
- Success confirmation is displayed after copying
- Copy functionality works with browser clipboard API
- Error handling if clipboard access is denied

### User Feedback
- Success message when task is shared via email (toast notification)
- Success message when link is copied to clipboard (toast notification)
- Clear visual feedback for all sharing actions
- Uses shadcn/ui Toast component for feedback messages
- Error messages if sharing fails (handled gracefully)

### Mock Sharing Functionality
- Email sharing logs to console or shows toast (no real email sent)
- Link generation creates mock URL (no real link generation)
- All sharing actions are mocked for now
- Mock functionality provides foundation for future backend integration
- Mock data structure supports sharing information

## Success Criteria

- Users can access sharing options from task cards and task detail pages
- Share modal displays email and link sharing options clearly
- Users can share tasks via email (mocked functionality)
- Users can generate and copy share links (mocked functionality)
- Share link is copied to clipboard successfully
- Success confirmation is displayed after sharing actions
- Share modal can be closed via multiple methods (close button, outside click, Escape key)
- Share button and modal are accessible via keyboard navigation
- Share button and modal follow the techy minimalist theme design
- All sharing functionality is mocked correctly (console log or toast confirmation)
- Share modal handles errors gracefully

## Key Entities

### Share Modal State
- Modal visibility: whether the share modal is open or closed
- Selected sharing method: email or link
- Generated link: the mock share link for the task
- Email address: the email address for email sharing (mock or input)
- Sharing state: whether sharing action is in progress
- Success state: whether sharing was successful

### Share Link Data Structure
- Task ID: identifier for the task being shared
- Share Token: mock token for the share link (e.g., random string)
- Share URL: the complete mock URL for sharing (e.g., `/tasks/{taskId}/shared/{shareToken}`)
- Generated timestamp: when the link was generated

### Email Share Data Structure
- Task ID: identifier for the task being shared
- Recipient email: email address to share with (mock or input)
- Share timestamp: when the task was shared via email

## Edge Cases

- Share button clicked multiple times rapidly: Handle modal state correctly
- Modal opened while another modal is open: Handle modal stacking or prevent multiple modals
- Clipboard access denied: Show error message, handle gracefully
- Very long share link: Handle text display appropriately (truncate or wrap)
- Share modal on small screens: Ensure responsive design, modal fits screen
- Keyboard navigation when modal is open: Trap focus within modal
- Escape key when modal is not focused: Still closes modal
- Email sharing with invalid email format: Validate email format, show error
- Link generation failure: Show error message, allow retry
- Network delay during sharing (future): Show loading state, handle gracefully
- Share button on unauthenticated pages: Hide or show appropriate state
- Task with no share permissions: Handle gracefully (future consideration)
- Share modal with very long task title: Handle text display appropriately

## Assumptions

- Task card component already exists
- Task detail page already exists
- shadcn/ui Dialog or Modal component is available
- shadcn/ui Toast component is available for feedback
- Browser clipboard API is available
- Mock share link generation utility can be created
- Email validation utility is available or can be created
- Share modal is displayed as a dialog overlay
- Sharing functionality is mocked (no real backend integration)
- Share links are mock URLs (no real link generation)
- Email sharing is mocked (no real email sending)
- No share link expiration or access control needed (mock only)
- No share link analytics or tracking needed (mock only)

## Out of Scope

- Real email sending functionality
- Real share link generation with backend
- Share link expiration or access control
- Share link analytics or tracking
- Share permissions or access control
- Share link preview or metadata
- Social media sharing (Facebook, Twitter, etc.)
- Share link QR code generation
- Share link customization or branding
- Share history or tracking
- Share link revocation
- Share link password protection
- Share link expiration dates
- Real API integration
- Backend changes
- Database work
- Email service integration (SendGrid, Mailgun, etc.)
- Share link shortener integration
- Share link preview cards
- Share link analytics dashboard
- Share link access logging
- Share link permissions management

