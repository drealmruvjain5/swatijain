# Database Design

## Schema Overview
We use a single `writings` table in PostgreSQL (managed via Supabase) to store all content.

## Table: `writings`

| Column | Type | Constraints / Defaults | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, `uuid_generate_v4()` | Unique identifier for each record. |
| `title` | `text` | Not Null | The title of the piece. |
| `slug` | `text` | Unique, Not Null | URL-friendly version of the title for routing (e.g., `my-poem-title`). |
| `content` | `text` | | The actual content/body. Stored as plain text with line breaks preserved, or minimal markdown. |
| `category` | `text` | | Classification (e.g., 'poem', 'blog', 'essay', 'story'). Used for filtering. |
| `status` | `text` | Not Null, Default: `'draft'`| Lifecycle state. Must be exactly `'draft'` or `'published'`. |
| `cover_image` | `text` | | Optional URL to an image stored in Supabase Storage. |
| `created_at` | `timestamptz` | Not Null, Default: `now()` | Automatically set upon creation. |
| `updated_at` | `timestamptz` | Not Null, Default: `now()` | Automatically updated via PostgreSQL trigger on any row modification. |
| `published_at`| `timestamptz` | | Timestamp explicitly set when `status` changes from `'draft'` to `'published'`. Used for chronological sorting of public feed. |

## Required Database Features
- **Triggers:** A `moddatetime` trigger or custom plpgsql function must be attached to the `writings` table to ensure `updated_at` is always accurate.
- **Indexes:** 
  - Index on `status` (for quickly filtering published works).
  - Index on `slug` (for fast lookup on the individual writing page).
  - Index on `published_at` (for chronological sorting).
