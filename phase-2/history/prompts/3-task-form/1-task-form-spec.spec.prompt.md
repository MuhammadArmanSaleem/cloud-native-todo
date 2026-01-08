---
id: 1
title: Task Create/Edit Form (Formik) Specification
stage: spec
date: 2025-01-27
surface: agent
model: claude-sonnet-4.5
feature: 3-task-form
branch: main
user: Arman Saleem
command: "/sp.specify Implement Task Create/Edit Form (Formik)"
labels: ["frontend", "task-form", "formik", "validation", "speckit-plus", "specification"]
links:
  spec: "specs/3-task-form/spec.md"
  plan: null
  tasks: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - phase-2/specs/3-task-form/spec.md
  - phase-2/specs/3-task-form/checklists/requirements.md
tests_yaml: []
---

# Prompt History Record

## PROMPT_TEXT

```
/sp.specify Implement Task Create/Edit Form (Formik)

Context:

You have implemented the Task List and Task Card components.

This task focuses on building the **Task Create/Edit Form** using Formik for data handling and validation.

Scope of this task:

- Implement a **Task Create Form** (for new tasks).

- Implement **Task Edit Form** (for modifying tasks).

- Form should be validated using Formik and Yup/Zod.

- Task form must accept title, description, priority, tags, and due date.

Step 1 — Task Create Form

- Create `/components/task/TaskForm.tsx` for creating new tasks.

- The form should accept the following fields:

  - **Title** (required, 1-200 characters)

  - **Description** (optional, max 1000 characters)

  - **Priority** (optional: low, medium, high)

  - **Tags** (optional: work, personal, etc.)

  - **Due Date** (optional: date picker)

- Use Formik for state management and form validation (via Yup or Zod).

- Show error messages for validation failures.

- Add a submit button with `Create Task` text.

Step 2 — Task Edit Form

- Create `/components/task/TaskEditForm.tsx` for editing existing tasks.

- Pre-populate form with existing task data when editing.

- Include the same fields as the Create Form.

- Include a `Save Changes` button.

Step 3 — Validation Schema

- Define a Yup or Zod schema for form validation:

  - Title is required.

  - Description is optional but limited to 1000 characters.

  - Priority is optional but must be one of low, medium, high.

  - Due Date is optional, but should be a valid date if present.

- Display validation errors below each field.

Step 4 — Wiring up forms

- Pass form data as props from the parent container or mock data.

- For now, you can mock task data for editing, e.g., in /content/mockTasks.ts.

Constraints:

- Use Formik with Yup/Zod for validation.

- No direct API calls from the form (mock only).

- Use Tailwind classes for styling.

Output requirements:

- List of files created/modified: `/components/task/TaskForm.tsx`, `/components/task/TaskEditForm.tsx`.

- Code snippets for Formik forms and validation schema.

- Forms should display error messages correctly.

Acceptance criteria:

- Form renders correctly with validation.

- Form validation works for required fields and formats.

- Form data should be passed correctly and editable for both create and edit cases.
```

## RESPONSE_TEXT

Created specification for Task Create/Edit Form (Formik) feature following SpecKit Plus workflow. The spec includes:

1. **Feature Description**: Implement task creation and editing forms using Formik for state management and validation
2. **User Scenarios**: 7 scenarios covering creating tasks, validation errors, editing tasks, field validation, optional fields, form reset/cancellation, and accessibility
3. **Functional Requirements**: Detailed requirements for Task Create Form, Task Edit Form, validation schema, error display, form data handling, and component architecture
4. **Success Criteria**: Measurable, technology-agnostic outcomes focused on user-visible results
5. **Key Entities**: Task form data structure, validation rules, form modes (create/edit)
6. **Edge Cases**: Empty title, field length limits, invalid values, special characters, rapid changes
7. **Assumptions**: Formik/Yup/Zod availability, shadcn/ui components, mock data, parent component handling
8. **Out of Scope**: API integration, deletion, persistence, file uploads, rich text, tag autocomplete, advanced date features

Specification is complete with no [NEEDS CLARIFICATION] markers. All requirements are testable and technology-agnostic. Success criteria focus on user-visible outcomes. Ready for `/sp.plan` phase.

## OUTCOME

✅ Specification created at `specs/3-task-form/spec.md`
✅ Quality checklist created at `specs/3-task-form/checklists/requirements.md`
✅ All checklist items pass validation
✅ No clarification markers needed
✅ Ready for planning phase (`/sp.plan`)

## EVALUATION

The specification successfully captures the task create/edit form requirements in a technology-agnostic, testable format. All functional requirements have clear acceptance criteria. User scenarios cover all primary flows (creating, editing, validation, accessibility). Success criteria are measurable and focus on user-visible outcomes. Edge cases are identified (field limits, invalid values, special characters). Scope is clearly bounded with out-of-scope items explicitly listed (API, deletion, advanced features). The spec is ready for the planning phase.

