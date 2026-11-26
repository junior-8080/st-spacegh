# ST-SPACE Facilities Management Services

Public website and private admin dashboard for **ST-SPACE Facilities Management Services** (Accra & Kumasi, Ghana).

Two independent Next.js 16 apps (App Router, TypeScript, Tailwind CSS v4) in one folder. There are no shared packages and no monorepo tooling.

| App | Path | Port | Purpose |
|---|---|---|---|
| Website | `website/` | 3000 | Public marketing site: services, facilities, careers, blog, contact |
| Admin | `admin/` | 3001 | Admin dashboard **and** the API; the only app that talks to MongoDB and Cloudflare R2 |

## Architecture

```
                      ┌──────────────────────────────┐
  Visitors ──────────▶│  website/  (Next.js, :3000)  │
                      │  server components fetch the │
                      │  public API, cached 60 s     │
                      └──────────────┬───────────────┘
                                     │ HTTP  GET /api/public/*   (+ POST /api/public/contact from the browser, CORS)
                                     ▼
  Admin user ────────▶┌──────────────────────────────┐        ┌──────────────────┐
  (login, JWT cookie) │  admin/  (Next.js, :3001)    │───────▶│  MongoDB         │
                      │  dashboard UI + API routes   │        │  posts, jobs,    │
                      │  /api/admin/* (protected)    │        │  facilities,     │
                      │  /api/public/* (CORS)        │        │  messages        │
                      └──────────────┬───────────────┘        └──────────────────┘
                                     │ S3 API (uploads/deletes)
                                     ▼
                      ┌──────────────────────────────┐
                      │  Cloudflare R2 bucket        │◀── website loads facility photos
                      │  facility photos (public)    │    from R2_PUBLIC_URL
                      └──────────────────────────────┘

  admin ──POST /api/revalidate (shared secret)──▶ website   (instant refresh after any change)
```

- Content changes in the admin show on the website **immediately** through on-demand revalidation. If that call fails, they show within **60 seconds** through time-based revalidation.
- If the admin API is down, the website keeps working: lists are empty and their sections are hidden.

## Prerequisites

- **Node.js 20+** (tested with Node 24) and npm
- **MongoDB**: local (`docker run -d --name st-space-mongo -p 27017:27017 mongo:7`) or MongoDB Atlas
- **Cloudflare R2** bucket for facility images (see [Cloudflare R2 setup](#cloudflare-r2-setup))

## Setup

### 1. Admin (API + dashboard)

```bash
cd admin
cp .env.example .env.local
npm install

# Create the admin password hash, then paste the printed ADMIN_PASSWORD_HASH=... line into .env.local
node scripts/hash-password.mjs "your-strong-password"

# Generate secrets for JWT_SECRET and REVALIDATE_SECRET
openssl rand -base64 48
openssl rand -hex 24
```

Fill in `admin/.env.local`:

| Variable | Description |
|---|---|
| `MONGODB_URI` | e.g. `mongodb://localhost:27017/st-space` or your Atlas connection string |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD_HASH` | Output of `hash-password.mjs`. **Every `$` must be escaped as `\$`** because Next.js expands `$` in env files. The script prints the escaped line for you. |
| `JWT_SECRET` | Long random string |
| `WEBSITE_ORIGIN` | Allowed CORS origin(s) for the public API, comma-separated |
| `NEXT_PUBLIC_WEBSITE_URL` | Website URL for "View Website" / "View on site" links |
| `WEBSITE_URL` | Website URL the admin calls to trigger revalidation |
| `REVALIDATE_SECRET` | Same value as in `website/.env.local` |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` | Cloudflare R2 credentials and public bucket URL |

Seed sample content (optional):

```bash
npm run seed
```

> ⚠️ The seed script **deletes all posts, jobs and facilities** in the target database, then inserts 3 published posts, 1 draft post, 3 open jobs, 1 closed job and 3 clearly labelled *sample* facilities. Only run it on a fresh or development database. Messages are not touched.

### 2. Website

```bash
cd website
cp .env.example .env.local
npm install
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_ADMIN_API_URL` | Admin app URL, e.g. `http://localhost:3001` |
| `NEXT_PUBLIC_SITE_URL` | Website URL (metadata, sitemap, share links) |
| `REVALIDATE_SECRET` | Same value as in `admin/.env.local` |

## Running locally

Use two terminals:

```bash
# Terminal 1
cd admin && npm run dev      # http://localhost:3001  → log in at /login

# Terminal 2
cd website && npm run dev    # http://localhost:3000
```

Production build: `npm run build && npm start` in each app. The admin always uses port 3001.

> Note: in production mode the session cookie is `Secure`, so `npm start` on plain `http://localhost` works in Chrome and Firefox, but Safari may refuse the cookie. Use `npm run dev` or HTTPS in that case.

## Cloudflare R2 setup

1. In the Cloudflare dashboard, go to **R2 → Create bucket** (e.g. `st-space-images`).
2. Under the bucket's **Settings → Public access**, either enable the `r2.dev` subdomain or connect a custom domain (recommended for production, e.g. `images.st-space.com`). Use that URL as `R2_PUBLIC_URL`.
3. Go to **R2 → Manage API tokens → Create API token** with **Object Read & Write** on that bucket. Copy the Access Key ID and Secret Access Key, and your Account ID.

How images work:
- The admin uploads each photo to `facilities/<random-uuid>.<ext>`.
- Files are checked by their actual file signature: JPEG, PNG, WebP or AVIF only, max 4 MB each, up to 12 per facility.
- Removing a photo and saving, or deleting a facility, also deletes the photo from R2.
- Photos removed before a facility is first saved are deleted straight away.

## Features

**Website:** home, about, services (+ 4 detail pages), **facilities** (list with type filter + detail page with photo gallery and price), careers (filters, job detail, apply by email/WhatsApp, closed-job banner), blog (categories, pagination, article with share buttons), contact (validated form with honeypot, Google Maps embeds), sitemap, robots, JSON-LD (`LocalBusiness`, `JobPosting`, `Article`), floating WhatsApp button.

**Admin:** sign-in (bcrypt + JWT cookie, login rate limiting) and an overview with stats. Then:
- **Blog posts:** markdown editor with toolbar and preview, publish/unpublish.
- **Job vacancies:** list editors for responsibilities, requirements and benefits; publish, close.
- **Facilities:** photos, price in GHS with a billing period, features, featured flag.
- **Messages:** unread badge, reply by email or WhatsApp.
- Unsaved-changes warnings and toast notifications throughout.

## API summary

| Route | Auth | Notes |
|---|---|---|
| `POST /api/auth/login`, `POST /api/auth/logout` | – | 5 attempts / 15 min / IP |
| `/api/admin/posts`, `/api/admin/posts/[id]` | session | GET (paginated, `status`, `search`), POST, PATCH, DELETE |
| `/api/admin/jobs`, `/api/admin/jobs/[id]` | session | same |
| `/api/admin/facilities`, `/api/admin/facilities/[id]` | session | same |
| `POST /api/admin/uploads`, `DELETE /api/admin/uploads?url=` | session | R2 image upload / delete unused image |
| `/api/admin/messages`, `/api/admin/messages/[id]` | session | GET, PATCH `{ read }`, DELETE |
| `GET /api/admin/stats` | session | counts |
| `GET /api/public/posts`, `/api/public/posts/[slug]` | CORS | published only |
| `GET /api/public/jobs`, `/api/public/jobs/[slug]` | CORS | list: open and not expired; detail: open or closed |
| `GET /api/public/facilities`, `/api/public/facilities/[slug]` | CORS | published only, featured first |
| `POST /api/public/contact` | CORS | validated, honeypot, 5 / hour / IP |

Responses use `{ data }` on success and `{ error, details? }` on failure.

## Implementation notes (Next.js 16)

- Route protection lives in `admin/src/proxy.ts`. Next.js 16 renamed the `middleware.ts` convention to `proxy.ts`; the behaviour is the same.
- `cacheComponents` is turned off in both apps. The website uses `fetch(..., { next: { revalidate: 60, tags } })` with `revalidateTag(tag, { expire: 0 })`.
- `brand-gold-ink` (`#8A6400`) is an extra colour token for gold text on light backgrounds, because the bright golds don't meet WCAG AA contrast on white.

## Deployment

1. Create a **MongoDB Atlas** cluster and an **R2 bucket** (with a custom domain for images).
2. Deploy `admin/` and `website/` as **two separate Vercel projects** (or any Node host), each with its own root directory.
3. Use separate domains, e.g. `st-space.com` (website) and `admin.st-space.com` (admin).
4. Set the environment variables in each project:
   - **admin:** `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET`, `WEBSITE_ORIGIN=https://st-space.com`, `NEXT_PUBLIC_WEBSITE_URL=https://st-space.com`, `WEBSITE_URL=https://st-space.com`, `REVALIDATE_SECRET`, all `R2_*` variables
   - **website:** `NEXT_PUBLIC_ADMIN_API_URL=https://admin.st-space.com`, `NEXT_PUBLIC_SITE_URL=https://st-space.com`, `REVALIDATE_SECRET`
5. In Atlas, allow connections from your host (on Vercel: `0.0.0.0/0` or the Vercel integration).

Image uploads go through the admin server and are limited to 4 MB each, which stays under Vercel's 4.5 MB request limit.

## Client TODOs

- [ ] Official vector logo files (replace `public/images/logo-mark.svg`, `app/icon.svg` and the `Logo` component in both apps)
- [ ] Real photography for the website (staff at work, HVAC, cleaning, electrical, landscaping, fumigation). Pass `src` to `PhotoFrame` (marked `TODO: replace with client photo`)
- [ ] Replace the sample facilities with real ones and upload photos
- [ ] Exact Google Maps pins for the Accra and Kumasi offices (`website/src/app/contact/page.tsx`)
- [ ] Social media links (none added yet)
- [ ] Approved testimonials or client logos, if desired (placeholder comment on the About page)
