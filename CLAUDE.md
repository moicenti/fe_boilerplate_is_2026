# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

"Habita" — a condominium management frontend (Spanish UI, `lang="es"`) built with Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript. It is a thin BFF in front of a separate REST backend; there is no database here. Features are developed per user story on `feature/H<n>-<descripcion>` branches and merged into `develop`, then `main`.

## Commands

- `npm run dev` — dev server on http://localhost:3000 (also regenerates `AGENTS.md`)
- `npm run build` — production build (also the main type check)
- `npm run lint` — ESLint (flat config, `eslint-config-next`)
- `npx next typegen && npx tsc --noEmit` — type check without building. `PageProps`/`LayoutProps` are global types generated into `.next/types`, so plain `tsc` fails until `typegen` (or `dev`/`build`) has run.
- No test framework is configured.

Copy `.env.example` to `.env.local`. `API_URL` is the backend base **including** the version prefix (e.g. `http://localhost:8000/api/v1`); `lib/api.ts` throws at import time if it is missing.

## Architecture

**Auth/session.** `app/actions/auth.ts` (`login`) POSTs to `${API_URL}/auth/login` and stores the returned bearer token in an httpOnly cookie named `session` (`lib/session.ts`). `proxy.ts` (Next 16's replacement for `middleware.ts`) only checks that cookie exists and redirects to `/login` otherwise; real validation happens when the backend returns 401, at which point server actions call `expireSession()` to clear the cookie and redirect. The current user (`id`, `email`, `unit`, `role`: `RESIDENTE | ADMINISTRADOR | SEGURIDAD`) comes from `GET /auth/me` via `lib/current-user.ts`.

**Backend access — server only.** All backend calls go through `apiFetch` in `lib/api.ts`, which resolves paths against `API_URL`, attaches `Authorization: Bearer <session>`, disables caching, sets `Content-Type: application/json` only for string bodies (so `FormData` uploads stay multipart), and throws `ApiError(status, message, codigo?)` on non-2xx — it understands both backend error shapes, `{ codigo, mensaje }` and `{ message: string | string[] }`. Use `getCurrentUser()` from `lib/current-user.ts` rather than calling `/auth/me` ad hoc. The token never reaches the browser. Two patterns sit on top of it:

1. **Server Components + Server Actions** (used by `app/(panel)/areas`): pages call typed wrappers in `lib/*-api.ts` directly; mutations live in `app/actions/*.ts` as `useActionState`-style actions returning `{ error, fieldErrors, values }`, then `revalidatePath` + `redirect` with an `?ok=` query param for success banners. Backend error `codigo`s are mapped to Spanish messages in the action.
2. **Client Components + Route Handler proxy** (used by `incidencias`, `paquetes`): `"use client"` components `fetch('/api/...')`; the handlers in `app/api/**/route.ts` just forward to the backend with `forward(() => apiFetch(...))` and `jsonBody()` from `lib/api-route.ts`, which converts `ApiError` into a JSON `{ message }` response with the same status.

**Route groups / layouts.** Two parallel UI shells exist, from different feature branches:
- `app/(panel)/` — uses `components/` (root: `sidebar.tsx`, `topbar.tsx`, `icons.tsx` with inline SVG icons) and semantic theme tokens.
- `app/(dashboard)/` — uses `app/components/layout/*` (Sidebar, Header), `lucide-react` icons, and some hardcoded colors. Feature components live in `app/components/<feature>/`.
When editing a feature, follow the conventions of the shell it already lives in.

**Domain modules in `lib/`.** Types, constants and formatters per domain (`areas.ts`, `bloqueos.ts`, `paquetes.ts`), separated from the fetch wrappers (`areas-api.ts`). Dates for the condo are handled in `America/El_Salvador` time via `lib/condominio.ts` (`hoyEnCondominio`, `aIsoCondominio`); `CONDOMINIO` also holds placeholder name/role data pending API support.

**Validation.** Mix of hand-written validation in server actions (areas) and Zod schemas + `react-hook-form` (`lib/validation.ts`, incidencias form).

**Styling.** Tailwind v4 configured CSS-first in `app/globals.css` via `@theme` (no `tailwind.config`). Prefer semantic tokens (`bg-background`, `text-foreground`, `bg-primary`, `text-muted`, `border-border`, `bg-surface`, `text-danger`) over raw palette colors (`forest`, `moss`, `sage`, `cream`, `sand`); use opacity modifiers for intermediate shades. Fonts: Inter (`font-sans`) and Source Serif 4 (`font-serif`).

**Path alias:** `@/*` → repo root.
