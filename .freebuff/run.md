# EduFlow Preview — Run Doc

## How to reproduce the artifacts

The preview is a standalone HTML file at `.freebuff/preview.html`. It requires no build, no dependencies, and no server process — the platform's built-in HTML preview serves it directly.

**Files involved:**
- `.freebuff/preview.html` — the interactive dashboard mockup

**No build artifacts needed.** The HTML file is self-contained with inline CSS and JavaScript.

## How to run the server

**No server needed.** The preview is registered via `register_preview` with `htmlPath`, which the platform serves as a static file at `http://127.0.0.1:61000/preview.html`.

The preview auto-reloads when the source file changes.

## Architecture note

The actual EduFlow backend (NestJS + Prisma) lives in `backend/` and requires PostgreSQL to run. The preview shows a faithful UI mockup of what the admin dashboard will look like once the Next.js frontend is built.
