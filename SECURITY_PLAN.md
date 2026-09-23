# Security Plan

## Security Boundaries

### 1. Database (Row Level Security - RLS)
Supabase provides PostgreSQL RLS. We will enforce security at the database level to ensure that even if a client-side vulnerability exists, data remains protected.

**Policy: Public Read Access**
- **Action:** `SELECT`
- **Role:** `anon` (anonymous users) and `authenticated`
- **Condition:** `status = 'published'`
- **Effect:** Anyone can read published works. No one can read drafts unless they are the authorized author.

**Policy: Author Full Access**
- **Action:** `ALL` (`SELECT`, `INSERT`, `UPDATE`, `DELETE`)
- **Role:** `authenticated`
- **Condition:** `auth.uid() = [AUTHOR_UUID]` OR we simply allow any `authenticated` user since public signups will be strictly disabled. Because there is only one user, allowing all `authenticated` actions is safe provided registration is locked down.
- **Effect:** The logged-in author can manage all records, regardless of status.

### 2. Application Layer (Next.js Middleware & RSC)
- **Protected Routes:** All routes starting with `/dashboard` will be protected by Next.js Middleware. If `supabase.auth.getUser()` fails or returns no session, the user is immediately redirected to `/login`.
- **Server Components:** Data fetching for the dashboard will occur in Server Components ensuring database queries are protected and session cookies are validated securely on the server.

### 3. Authentication (Supabase Auth)
- **Provider:** Email & Password only.
- **Restriction:** "Enable Email Signup" MUST be disabled in the Supabase Dashboard -> Authentication -> Providers settings. This ensures no random public users can create an account and access the dashboard.
- **Session:** Secure HttpOnly cookies managed via `@supabase/ssr`.

### 4. Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Exposed to client. Safe.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Exposed to client. Safe (restricted by RLS).
- `SUPABASE_SERVICE_ROLE_KEY`: **CRITICAL DANGER**. This bypasses RLS. It must NEVER be prefixed with `NEXT_PUBLIC_` and must NEVER be used in the Next.js application. We do not need it for this project; the `anon` key + user session is sufficient.
