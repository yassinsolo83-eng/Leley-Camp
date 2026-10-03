# Leley Camp — Next.js + Sanity

Bilingual site (`/en`, `/ar`) with the Sanity Studio at `/studio`.
All texts, photos, prices and links are edited in the Studio. Booking requests from the form appear in the Studio under **Booking requests**.

## Environment variables (Vercel → Settings → Environment Variables)

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Project ID from sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_WRITE_TOKEN` | Token with **Editor** permission |
| `SEED_SECRET` | Any long random text (used once for `/api/seed`) |
| `NEXT_PUBLIC_SITE_URL` | Live domain, e.g. `https://leleycamp.com` |
| `SANITY_REVALIDATE_SECRET` | Optional, for instant updates (see below) |

## First-time setup

1. Create a Sanity project at sanity.io/manage (dataset: `production`).
2. In the project → **API → CORS origins**, add the Vercel URL (and later the custom domain) with **Allow credentials** checked.
3. In **API → Tokens**, create a token with **Editor** permission.
4. Import the repo in Vercel, add the environment variables above, deploy.
5. Open `https://YOUR-SITE/api/seed`, enter `SEED_SECRET`, choose `leley-starter-content.json`, press **Import**.
6. Open `/studio` and log in with your Sanity account.

## Instant updates (optional)

Without this, changes appear within about a minute.
Sanity → API → Webhooks → Create: URL `https://YOUR-SITE/api/revalidate`, trigger on Create/Update/Delete, set a Secret and put the same value in `SANITY_REVALIDATE_SECRET`.

## Structure

- `app/[lang]/` — the website (one page per language)
- `app/studio/page.tsx` — Sanity Studio (deeper Studio URLs are rewritten to it in `next.config.ts`)
- `app/api/inquiry` — saves booking requests
- `app/api/seed` — one-time content import
- `components/` — page sections
- `sanity/schemaTypes/` — what can be edited in the Studio
- `lib/i18n.ts` — English defaults for buttons and labels
