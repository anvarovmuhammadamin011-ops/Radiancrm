# AGENTS.md — Project Learnings

## Project Identity

- **Branding:** Project was rebranded from "EduFlow" to **"Radian O'quv Markazi"** (KELAJAK BIZ BILAN). README still says EduFlow — the preview is authoritative for current branding.
- **Design system:** Navy `#202B4D`, Green `#62D17B`, Gold `#F3C94B`, Background `#F7F8FA`, Cards `#FFFFFF`. Light theme. Minimal + premium aesthetic.
- **Roles for Radian:** Only **6 roles** active: Super Admin, Admin, Accountant, Teacher, Student, Parent. Manager/Receptionist/HR were removed from the preview per user request. README still lists 9 roles.

## Architecture

- **`backend/`** contains NestJS + Prisma schema with 9 Role enum values (including REMOVED ones: MANAGER, RECEPTIONIST, HR). The schema was not cleaned up after role removal.
- **`.freebuff/preview.html`** is a standalone single-file HTML demo (no build step, no dependencies). All 6 role dashboards, sidebar navigation, and page rendering live in one file (~705 lines). This is a static prototype, not the production app.
- **Logo:** `.freebuff/radian-logo.png` must exist for sidebar/dashboard logo rendering. Current 404 is expected if file is missing.

## Debugging Pitfalls

- **Uzbek apostrophes break JS single-quoted strings.** Uzbek text like `Qo'shilgan` ("added") contains `'` that terminates single-quoted JS strings. Backtick template literals are safe. The error message is misleading: `SyntaxError: Unexpected identifier 'shilgan'` — it points to the text *after* the apostrophe, not the string boundary. Fix: use double quotes or remove the apostrophe.
- **Sidebar `i===0` active state is per-section, not global.** When iterating nested nav sections with `items.forEach((item,i) => ...)` and checking `i===0`, the first item of *every* section gets the active class. Fix: use a global counter (`navIdx++===0`) to mark only the very first item.
- **`renderStudents()` returns HTML but doesn't update DOM.** Filter functions that call render functions and discard the return value produce a no-op. The fix is to call `renderPageContent()` (which sets innerHTML) instead of the raw render function.
- **State variables must be explicitly reset in `logout()`.** Filter states (`studFilter`, `studGroup`, `currentPage`) persist across login/logout cycles if not reset. Always check that `logout()` clears every mutable global.

## Preview System

- **Run doc:** `.freebuff/run.md` documents how to start the dev server for this worktree.
- **Detach on Windows:** Must use PowerShell `Start-Process` with `npm.cmd` (not `npm`), stdout and stderr go to different files.
- **Preview register:** `register_preview` with `htmlPath` for static files, `url` + `pid` for dev servers. Don't mix the two modes.
