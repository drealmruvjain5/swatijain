# Implementation Plan & Phased Checklist

Based on the detailed project brief, here is the phased plan for building the personal literary website and single-author publishing dashboard. 

## The Phased Checklist & Acceptance Criteria

### Phase 1: Project Initialization & Setup
- [ ] Initialize Next.js project with App Router, TypeScript, and Tailwind CSS.
- [ ] Create documentation files in the workspace.
- [ ] Install Supabase client libraries (`@supabase/supabase-js`, `@supabase/ssr`).
- [ ] Configure environment variables (`.env.local` and `.env.example`).
- [ ] Set up basic folder structure (`components`, `lib`, `app/dashboard`, etc.).
- **Acceptance Criteria:** `npm run dev` starts without errors. Project structure is established. Documentation files exist.
- **Manual Setup:** User must create a Vercel/GitHub repository (optional but recommended at this stage).

### Phase 2: Database & Security Configuration (Supabase)
- [ ] Define the `writings` table schema in `DATABASE_DESIGN.md`.
- [ ] Write SQL migrations for creating the table and setting up updated_at triggers.
- [ ] Define Row Level Security (RLS) policies in `SECURITY_PLAN.md`.
- **Acceptance Criteria:** `writings` table exists in Supabase. RLS policies restrict anonymous users to read-only published items, and allow full CRUD for the authorized author.
- **Manual Setup:** 
  1. User must create a Supabase project.
  2. User must provide `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  3. User must execute the provided SQL script in the Supabase SQL Editor.

### Phase 3: Authentication System
- [ ] Create Supabase server/client utility files (`lib/supabase/server.ts`, `lib/supabase/client.ts`).
- [ ] Build the Login page (`/login`) with email/password form.
- [ ] Implement secure session handling using cookies.
- [ ] Create middleware to protect `/dashboard` routes and redirect unauthenticated users.
- **Acceptance Criteria:** User can log in. Invalid credentials show an error. Unauthenticated attempts to access `/dashboard` redirect to `/login`. Authenticated users can view `/dashboard` and log out.
- **Manual Setup:** User must create the single author user account manually via the Supabase Dashboard (Authentication -> Users -> Add User). User must also disable public sign-ups in Supabase Auth providers.

### Phase 4: Public Site UI/UX Foundation
- [ ] Configure Tailwind theme (ivory, parchment, forest green, charcoal colors, elegant serif fonts).
- [ ] Create base public layout (Navbar, Footer, Container).
- [ ] Build the Home page (`/`) structure (Hero, featured section).
- [ ] Build the About page (`/about`).
- **Acceptance Criteria:** UI matches the "calm literary journal" aesthetic. Fonts are large and readable. Navigation works. Layout is responsive on mobile and desktop. 

### Phase 5: Public Data Integration
- [ ] Create data fetching functions for public pages.
- [ ] Implement All Writings page (`/writings`) with chronological list and category filtering.
- [ ] Implement individual writing page (`/writings/[slug]`) preserving line breaks and Hindi text.
- **Acceptance Criteria:** Public pages successfully fetch and display ONLY `status = 'published'` writings from the database. Text formatting (line breaks, Hindi characters) renders exactly as intended.

### Phase 6: Dashboard Core & Editor
- [ ] Create Dashboard Layout with minimal navigation (Overview, Drafts, Published).
- [ ] Build the Dashboard Overview page.
- [ ] Implement the text Editor page (`/dashboard/editor`) with title, slug generation, category selection, and large distraction-free content area.
- [ ] Implement client-side autosave logic (save as draft).
- **Acceptance Criteria:** Author can navigate dashboard. The editor correctly handles typing, preserves line breaks, and autosaves to the database as a draft. Empty states are handled gracefully.

### Phase 7: Publishing Workflow
- [ ] Implement drafts list view and published list view in the dashboard.
- [ ] Add publish/unpublish toggle functionality in the editor/list.
- [ ] Add delete functionality with explicit confirmation modal.
- **Acceptance Criteria:** Author can move items between draft and published states. UI reflects these changes instantly. Deleting prompts a confirmation and successfully removes the record. Public site reflects published changes immediately.

### Phase 8: Final Review & Polish
- [ ] End-to-end testing of workflows.
- [ ] Complete `AUTHOR_GUIDE.md`.
- [ ] Provide Vercel deployment instructions.
- **Acceptance Criteria:** All workflows operate flawlessly. Guide is clear for an older, non-technical user.
- **Manual Setup:** User follows deployment instructions to link GitHub repo to Vercel and add environment variables.

## Finalized Decisions
1. **Typography:** Lora (headings), Inter (body/UI), Noto Serif Devanagari (Hindi literary), Noto Sans Devanagari (Hindi UI fallback).
2. **Editor Type:** Version 1 will strictly use a plain-text-first editor built around a standard HTML `<textarea>` with `white-space: pre-wrap` to preserve formatting without auto-rewriting.
