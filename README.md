# Notepad Max

A modern glassmorphic note-taking app built with React, Vite, Tailwind CSS, Zustand, React Router, and Supabase.

## Features

- Email/password auth with Supabase Auth
- Supabase Auth and PostgreSQL storage for hosted production
- Development-only local demo mode when Supabase env vars are not configured
- Notes CRUD with optimistic updates
- Groups/folders with create, rename, delete, and filtering
- Instant search across title and rich content
- Pin notes and show pinned notes first
- Autosave after 1 second of inactivity
- Lightweight rich editor: bold, italic, headings, bullet lists
- Dark/light theme toggle persisted locally
- Responsive three-panel desktop layout with collapsible mobile sidebar

## Local Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase.schema.sql` in the Supabase SQL editor.
3. Add these env vars in Vercel Project Settings -> Environment Variables:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

For local development, you can also add them to a local `.env` file. Without env vars, only `npm run dev` uses browser storage as a temporary development demo. Production builds on Vercel require Supabase env vars.

## Deployment

Use Vercel with the default Vite settings:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
