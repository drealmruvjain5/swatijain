# Project Specification: Personal Literary Website

## Objective
Build a production-ready, database-driven literary website for one older author who must independently log in, create/edit writing, save, preview, and publish.

## Target Audience
- **Public:** Readers of the author's work (poems, blogs, essays, stories, reflections).
- **Author:** An older, non-technical user requiring a minimal, accessible, distraction-free publishing experience.

## Technology Stack & Architecture
- **Framework:** Next.js (App Router)
  - Uses React Server Components (RSC) for public read-only pages to ensure optimal SEO, performance, and caching.
  - Uses Client Components for interactive elements like the text editor and dashboard toggles.
- **Language:** TypeScript for end-to-end type safety.
- **Styling:** Tailwind CSS, utilizing a custom configuration to enforce the "calm literary journal" aesthetic.
- **Database & Backend:** Supabase (PostgreSQL).
- **Authentication:** Supabase Auth (Email/Password) integrated via `@supabase/ssr` for secure cookie-based session management.
- **Hosting:** Vercel (or Vercel-compatible serverless environment).

## Route Map

### Public Routes
- `/` - **Home:** Hero section, short bio, curated featured writings, and a feed of recent writings.
- `/writings` - **All Writings:** Chronological feed of all published works, with category filters and search.
- `/writings/[slug]` - **Single Writing:** Distraction-free reading view for a specific piece.
- `/about` - **About:** Extended author biography and photo.
- `/login` - **Authentication:** The entry point for the author to log into the dashboard.

### Private Routes (Dashboard)
*All routes under `/dashboard` require an active, authorized session.*
- `/dashboard` - **Overview:** High-level metrics, quick link to "Continue Draft", and "Create New".
- `/dashboard/drafts` - **Drafts List:** Table/list of unpublished works.
- `/dashboard/published` - **Published List:** Table/list of published works with quick actions.
- `/dashboard/editor` - **Create/Edit (New):** Blank distraction-free editor for a new piece.
- `/dashboard/editor/[id]` - **Create/Edit (Existing):** Distraction-free editor loaded with an existing piece.

## Content Lifecycle
1. **Creation:** The author clicks "Create New Writing". A new record is initialized.
2. **Drafting (Autosave):** As the author types, the content autosaves to the database with `status = 'draft'`. It is completely hidden from the public.
3. **Previewing:** The author can toggle a "Preview" mode within the editor to see how the text will render.
4. **Publishing:** The author explicitly clicks "Publish". The `status` changes to `'published'`, and `published_at` is set. The piece immediately becomes visible on public routes.
5. **Updating (Published):** If the author edits a published piece, changes autosave. The piece remains published, and `updated_at` is updated. (Note: No separate draft state for published pieces to keep it simple for the non-technical author).
6. **Unpublishing:** The author clicks "Unpublish". The `status` reverts to `'draft'`, hiding it from the public.
7. **Deletion:** The author clicks "Delete", is prompted with a strict confirmation, and the record is permanently removed from the database.

## UX / UI Guidelines
- **Typography:**
  - Headings/Titles (Literary): Lora
  - Body Text/Navigation/UI: Inter
  - Hindi Literary Content: Noto Serif Devanagari
  - Hindi UI/Fallback: Noto Sans Devanagari
- **Aesthetic:** Calm literary journal (ivory, parchment, forest green, charcoal). Avoid clutter and distracting animations.
- **Accessibility:** Large readable fonts, high contrast, generous spacing, clear text labels, large buttons.
- **Responsiveness:** Flawless layout across mobile, tablet, and desktop devices.
- **Content:** Strict preservation of original words, punctuation, line breaks, paragraphs, and multilingual text (Hindi/English). No auto-rewriting.

## Editor Architecture
- **Version 1:** A plain-text-first editor built around a standard HTML `<textarea>`.
- **Requirements:** 
  - Strict preservation of original text, poetry line breaks, and paragraph spacing (using `white-space: pre-wrap`).
  - Support for Hindi and English Unicode.
  - Support pasting from Word and Google Docs as plain text.
  - Core features: Title, category, content fields, autosave, manual Save Draft, Preview, and Publish.
  - UI Feedback: Clear saving/saved/error states, warnings for unsaved changes on navigation.
  - Resilience: Drafts must survive page refreshes and new login sessions.
- **Exclusions:** No rich-text editors (like Tiptap) in Version 1. No automatic rewriting, normalizing, or publishing.
