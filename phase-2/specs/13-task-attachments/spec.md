# Specification: Task Attachment UI

## Feature Description

Implement task attachment functionality that allows users to upload and view files attached to tasks. Users can attach files such as images, documents, and text files to tasks, view file previews or icons, and download attached files. Attachments are displayed with file names, file type indicators, timestamps, and download options. File uploads are validated for file type and size, with support for multiple file selection. All attachment functionality uses mock data for now, with no real file upload or API integration.

## User Scenarios & Testing

### Scenario 1: Viewing Task Attachments
**As a user**, I can see all attachments for a task.

**Given** I am viewing a task detail page
**When** I scroll to the attachments section
**Then** I see a list of all attachments for that task
**And** each attachment displays the file name
**And** each attachment displays a file type indicator or preview (e.g., image thumbnail, PDF icon)
**And** each attachment displays a timestamp (e.g., "Uploaded on 2026-01-08")
**And** each attachment has a download button
**And** attachments are displayed in chronological order

### Scenario 2: Viewing Task with No Attachments
**As a user**, I see a helpful message when a task has no attachments.

**Given** I am viewing a task detail page
**When** the task has no attachments
**Then** I see an empty state message indicating no attachments yet
**And** the message is clear and helpful
**And** I understand how to add the first attachment

### Scenario 3: Uploading a Single File
**As a user**, I can upload a single file to a task.

**Given** I am viewing a task detail page
**When** I select a file using the file input
**And** I click the submit button
**Then** the file is added to the attachment list
**And** the file appears immediately without page reload
**And** I see a confirmation message that the file was uploaded
**And** the file input is cleared after submission

### Scenario 4: Uploading Multiple Files
**As a user**, I can upload multiple files to a task at once.

**Given** I am viewing a task detail page
**When** I select multiple files using the file input
**And** I click the submit button
**Then** all selected files are added to the attachment list
**And** all files appear immediately without page reload
**And** I see a confirmation message that the files were uploaded
**And** the file input is cleared after submission

### Scenario 5: Uploading Valid File Types
**As a user**, I can upload files of allowed types (images, PDFs, text files).

**Given** I am viewing a task detail page
**When** I select a file that is an image, PDF, or text file
**And** the file size is within the limit (e.g., 10 MB)
**And** I click the submit button
**Then** the file is successfully uploaded
**And** I see a success confirmation message

### Scenario 6: File Type Validation - Invalid Type
**As a user**, I receive feedback when I try to upload an invalid file type.

**Given** I am viewing a task detail page
**When** I select a file that is not an image, PDF, or text file
**And** I try to submit the file
**Then** I see a validation error message
**And** the file is not uploaded
**And** the error message indicates which file types are allowed

### Scenario 7: File Size Validation - Too Large
**As a user**, I receive feedback when I try to upload a file that exceeds the size limit.

**Given** I am viewing a task detail page
**When** I select a file that exceeds the size limit (e.g., 10 MB)
**And** I try to submit the file
**Then** I see a validation error message
**And** the file is not uploaded
**And** the error message indicates the maximum file size allowed

### Scenario 8: Viewing Image Previews
**As a user**, I can see thumbnail previews for image attachments.

**Given** I am viewing attachments on a task
**When** an attachment is an image file
**Then** I see a thumbnail preview of the image
**And** the thumbnail is clearly visible and appropriately sized
**And** I can still download the full image file

### Scenario 9: Viewing File Type Icons
**As a user**, I can see file type icons for non-image attachments.

**Given** I am viewing attachments on a task
**When** an attachment is a PDF or text file
**Then** I see an appropriate file type icon (e.g., PDF icon, text file icon)
**And** the icon clearly indicates the file type
**And** I can still download the file

### Scenario 10: Downloading an Attachment
**As a user**, I can download any attached file.

**Given** I am viewing attachments on a task
**When** I click the download button for an attachment
**Then** the file download is initiated
**And** I can access the downloaded file
**And** the download works for all file types (images, PDFs, text files)

### Scenario 11: Attachment Timestamp Display
**As a user**, I can see when each attachment was uploaded.

**Given** I am viewing attachments on a task
**When** I look at each attachment
**Then** I see a timestamp for each attachment
**And** the timestamp is displayed in a readable format (e.g., "Uploaded on 2026-01-08")
**And** the timestamp is clearly associated with its attachment

### Scenario 12: Attachment Ordering
**As a user**, I can see attachments in a logical order.

**Given** I am viewing attachments on a task
**When** there are multiple attachments
**Then** attachments are displayed in chronological order
**And** I can easily identify the order of uploads
**And** the order is consistent and predictable

### Scenario 13: Dynamic Attachment Updates
**As a user**, I see new attachments appear immediately after uploading.

**Given** I am viewing a task detail page
**When** I submit a new attachment
**Then** the attachment appears in the attachment list immediately
**And** no page reload is required
**And** the attachment list updates smoothly
**And** I can continue viewing and uploading attachments

### Scenario 14: Attachment Form Accessibility
**As a user**, I can use the attachment form with keyboard navigation.

**Given** I am viewing a task detail page
**When** I navigate to the attachment form using keyboard
**Then** I can focus on the file input
**And** I can focus on the submit button
**And** I can submit the form using keyboard
**And** focus states are clearly visible

## Functional Requirements

### Attachment Section Component
- Component displays a list of attachments for a task
- Each attachment displays file name
- Each attachment displays file type indicator or preview (image thumbnail, PDF icon, text file icon)
- Each attachment displays timestamp in readable format
- Each attachment has a download button
- Attachments are displayed in chronological order (oldest first or newest first)
- Component handles empty state (no attachments)
- Component follows techy minimalist theme design
- Component is accessible (keyboard navigation, screen readers)

### Add Attachment Form Component
- Form includes a file input for selecting files
- File input supports multiple file selection
- Form includes a submit button to upload files
- Form uses Formik for state management
- Form validates file types (only images, PDFs, and text files allowed)
- Form validates file size (maximum 10 MB per file)
- Form displays validation error messages
- Form clears after successful submission
- Form is accessible (focus states, keyboard navigation)
- Form follows techy minimalist theme design

### File Type Validation
- Only image files are allowed (e.g., JPEG, PNG, GIF, WebP)
- Only PDF files are allowed
- Only text files are allowed (e.g., TXT, MD)
- Other file types are rejected with clear error message
- Validation occurs before submission
- Validation prevents invalid files from being uploaded

### File Size Validation
- Maximum file size is 10 MB per file
- Files exceeding 10 MB are rejected with clear error message
- Validation occurs before submission
- Validation prevents oversized files from being uploaded
- Size validation applies to each file individually when multiple files are selected

### Task Detail Page Integration
- Attachment section is displayed on the task detail page
- Add attachment form is displayed on the task detail page
- Attachments are displayed below task details
- Attachment section and form are clearly separated from task details
- Layout is responsive and works on mobile and desktop

### File Upload Submission
- When form is submitted, files are added to mock data
- Files are added to the attachment list immediately (no page reload)
- Attachment list updates dynamically
- Success confirmation is displayed (toast notification)
- Form is cleared after successful submission
- Each file includes file name, file type, timestamp (current time)
- Multiple files can be uploaded in a single submission

### File Previews and Icons
- Image files display thumbnail previews
- Thumbnails are appropriately sized and clearly visible
- PDF files display PDF icon
- Text files display text file icon
- Icons are clearly visible and indicate file type
- Previews and icons do not interfere with download functionality

### File Download
- Users can download any attached file by clicking download button
- Download works for all file types (images, PDFs, text files)
- Download is initiated when download button is clicked
- Download functionality works with mock data (file URLs or blob data)
- Download button is clearly visible and accessible

### User Feedback
- Success message when files are uploaded (toast notification)
- Validation error messages when files are invalid (type or size)
- Loading state during upload if needed
- Clear visual feedback for form interactions
- Uses shadcn/ui Toast component for success and error messages

### Mock Data Structure
- Attachments are stored in mock data structure
- Each attachment includes: file name, file type, file size, timestamp, file URL or blob data
- Attachments are associated with specific tasks
- Mock data supports multiple attachments per task
- Mock data supports various file types (images, PDFs, text files)

## Success Criteria

- Users can view all attachments for a task on the task detail page
- Users can see file name, file type indicator/preview, timestamp, and download button for each attachment
- Attachments are displayed in chronological order
- Users can upload single or multiple files through a validated form
- File type validation prevents invalid file types from being uploaded
- File size validation prevents files exceeding 10 MB from being uploaded
- New attachments appear in the attachment list immediately after uploading
- Success confirmation is displayed when files are uploaded
- Attachment form is cleared after successful submission
- Image attachments display thumbnail previews
- Non-image attachments display appropriate file type icons
- Users can download any attached file by clicking the download button
- Attachment section handles empty state (no attachments) gracefully
- All form interactions are accessible via keyboard
- Attachment section and form follow the techy minimalist theme design
- Attachment list updates dynamically without page reload

## Key Entities

### Attachment Data Structure
- Attachment ID: unique identifier for each attachment
- Task ID: identifier for the task the attachment belongs to
- File Name: name of the uploaded file
- File Type: type of file (image, PDF, text)
- File Size: size of the file in bytes
- Timestamp: when the attachment was uploaded (formatted for display)
- File URL or Blob Data: mock file data for download functionality

### Attachment Form State
- Selected files: array of files selected in the file input
- Validation errors: any validation error messages (file type, file size)
- Submission state: whether the form is being submitted
- Success state: whether the files were successfully uploaded

### Attachment List State
- Attachments array: list of all attachments for the task
- Loading state: whether attachments are being loaded
- Empty state: whether there are no attachments

## Edge Cases

- Task with no attachments: Show empty state message
- File exactly at size limit (10 MB): Valid, should be accepted
- File slightly over size limit (10.1 MB): Invalid, should show validation error
- Multiple files with one invalid: Handle partial validation, show error for invalid file
- Very long file names: Handle text truncation or wrapping appropriately
- Special characters in file names: Display correctly, handle sanitization
- Rapid file uploads: Handle state updates correctly
- File upload submission failure: Show error message, allow retry
- Network delay during upload: Show loading state, handle gracefully
- Image preview for very large images: Handle thumbnail generation appropriately
- Image preview for very small images: Handle thumbnail display appropriately
- Unsupported image formats: Reject with clear error message
- Multiple files with same name: Handle name conflicts appropriately
- File upload with no file selected: Show validation error, prevent submission
- Download button for missing file: Handle gracefully, show error message
- Attachment timestamp formatting: Handle various time formats correctly
- Attachment ordering with same timestamp: Handle tie-breaking appropriately
- Attachment section on very long task detail page: Ensure scrollable and accessible
- File input with many files selected: Handle display and validation appropriately

## Assumptions

- Task detail page already exists
- Formik library is available for form handling
- File input HTML element supports multiple file selection
- shadcn/ui Toast component is available for feedback
- Mock attachment data structure can be created or extended
- File type detection utility is available or can be created
- Timestamp formatting utility is available or can be created
- Image thumbnail generation utility is available or can be created (for previews)
- File icon library is available or can be created (for PDF/text file icons)
- Attachment section is displayed below task details on task detail page
- Attachments are per-task (not global)
- No file editing or deletion functionality needed (upload only)
- No file versioning needed
- No real file upload or storage needed (mock data only)
- File download uses mock file URLs or blob data

## Out of Scope

- File editing functionality
- File deletion functionality
- File versioning or history
- File renaming functionality
- File sharing or permissions
- File search or filtering
- File pagination (all attachments displayed)
- File sorting options (chronological only)
- Real file upload to server
- Real file storage (cloud storage, local storage)
- Real API integration
- Backend changes
- Database work
- File compression or optimization
- Advanced image editing or manipulation
- File preview for all file types (only images have previews, others have icons)
- Inline file viewing (download only)
- File drag-and-drop upload (file input only)
- File paste from clipboard
- File scanning or virus checking
- File metadata editing
- File comments or annotations on files
- File access control or permissions


