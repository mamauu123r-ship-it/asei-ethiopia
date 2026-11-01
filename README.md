# ASEI Website

Official website and management platform for **Africa Solar Energy Initiative (ASEI)**.
*Powering Africa. Empowering Generations.*

**Start here: [SETUP-GUIDE.md](SETUP-GUIDE.md)** walks you step by step from this folder to a live website.

## What is included

- **Public website:** homepage, About, Vision and Mission, Programs (with a page per program),
  Projects, Research, Publications, News, Partners, Get Involved, Contact, Search,
  Privacy Policy, Terms, sitemap and SEO titles. Works on phones, tablets and computers.
- **Working forms:** contact, partnership application, volunteer application, newsletter
  (with consent record and unsubscribe). Each has browser and server validation, spam protection
  (hidden honeypot field, speed check, 5 per hour limit) and database storage. Optional email alerts.
- **Admin dashboard** at `/admin`: totals, charts and recent activity; manage programs, projects,
  news, publications and partners (draft or publish, photos, PDFs); inquiries with status, category,
  internal notes and CSV export; volunteer applications; newsletter subscribers with export;
  media library; users and roles; website settings and impact figures.
- **Security:** Supabase Row Level Security on every table, three staff roles, no public sign-up,
  protected admin routes, secret keys only on the server, file type, size and content checks on uploads.

## Technology

Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide icons, Supabase (PostgreSQL, Auth, Storage),
Vercel hosting, Resend for optional email.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Installs everything the project needs |
| `npm run dev` | Runs the site at http://localhost:3000 while you work |
| `npm run build` | Checks the site builds for production |
| `npm run typecheck` | Checks the code for type errors |

## Folder map

```
supabase/                 SQL files to run in Supabase, in number order
src/app/(site)/           Public pages (one folder per page)
src/app/admin/            Admin area: login and the protected (panel) pages
src/app/actions/          Server code for forms (forms.ts) and admin actions (admin.ts)
src/components/           Header, footer, cards, forms and admin components
src/lib/content.ts        Reads published content from the database
src/lib/admin/entities.ts Defines the fields for programs, projects, news, publications, partners
src/lib/validation.ts     Rules for the public forms
src/lib/supabase/         Database connections (public, logged-in staff, and server-only secret)
src/middleware.ts         Sends visitors who are not logged in away from /admin
```

## Editing content

Long text fields in the admin use simple formatting (Markdown):
`## Heading`, `**bold**`, `- list item`, `[link text](https://example.org)`.
Leave a blank line between paragraphs.

## Planned next

- Amharic language version (the language button is already in the header)
- Real hero photograph
