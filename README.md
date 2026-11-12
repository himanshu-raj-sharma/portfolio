# Himanshu Raj Sharma — Portfolio

Production-grade personal portfolio + freelance lead-generation website for
**Himanshu Raj Sharma**, built as a single, opinionated Next.js application.

> Theme: **Liquid Glass Studio** — content floats at different depths through
> layers of living glass. Premium, calm, calm under the cursor, calm under scroll.

## 📘 Architecture & deep-dive

If you're reading this to **explain the project in an interview**, jump to
[`ARCHITECTURE.md`](./ARCHITECTURE.md). It has Mermaid diagrams for every
layer, a request-lifecycle walkthrough, and talking points you can use
verbatim.

---

## Stack

- Next.js 15 (App Router, React 19, TypeScript strict)
- Tailwind CSS with CSS-variable design tokens
- Lenis (smooth scroll) + GSAP/ScrollTrigger (scroll-linked motion)
- Framer Motion (route/component transitions, springs)
- React Three Fiber + drei for the hero 3D scene only
- next-themes (dark/light), react-hook-form + zod (shared schema)
- Resend for transactional email, honeypot + rate limit on the API
- lucide-react, next/font, @vercel/analytics, @vercel/speed-insights
- Vitest (utils/schemas), Playwright (one smoke E2E)
- ESLint, Prettier, Husky/lint-staged

---

## Quick start

```bash
pnpm install
cp .env.example .env.local   # then fill in keys (see below)
pnpm dev
```

Visit http://localhost:3000.

### Scripts

| Command           | What it does                                          |
| ----------------- | ----------------------------------------------------- |
| `pnpm dev`        | Dev server on :3000                                   |
| `pnpm build`      | Production build                                      |
| `pnpm start`      | Run the built app                                     |
| `pnpm lint`       | ESLint (next/core-web-vitals + typescript)            |
| `pnpm typecheck`  | `tsc --noEmit` (strict, no unchecked indexed access)  |
| `pnpm test`       | Vitest unit tests for schemas & utils                 |
| `pnpm test:e2e`   | Playwright smoke (requires `pnpm test:e2e:install`)   |
| `pnpm format`     | Prettier write                                        |

---

## Environment

`.env.local` is validated at startup via zod (`src/lib/env.ts`). Without
email keys the contact form falls back to a dev-mode log line so the API
route still returns success.

```env
# Required for production contact form
RESEND_API_KEY=             # https://resend.com/api-keys
CONTACT_TO_EMAIL=           # inbox that receives inquiries
CONTACT_FROM_EMAIL=         # verified sender (e.g. no-reply@yourdomain.com)

# Optional — distributed rate limiting via Upstash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Public — canonical origin. Optional on Vercel (it falls back to your
# *.vercel.app domain); set it once you have a custom domain.
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## Project structure

```
src/
├── app/                 # routes, layout, sitemap, robots, opengraph-image
│   ├── api/contact/     # POST handler (zod + Resend + honeypot + rate limit)
│   ├── projects/        # /projects + /projects/[slug]
│   └── resume/          # /resume
├── components/
│   ├── layout/          # Navbar, Shell, ThemeProvider
│   ├── motion/          # CursorProvider, CustomCursor, SmoothScroll,
│   │                    # MagneticButton, Preloader
│   ├── sections/        # Hero, About, Services, Projects, Skills,
│   │                    # Experience, Education, Process, FAQ,
│   │                    # ContactForm, Footer, TechMarquee
│   ├── seo/             # JsonLd, Analytics
│   ├── three/           # HeroScene (R3F)
│   └── ui/              # GlassCard, GlassButton, Container, Section,
│                        # SectionHeading, Badge, Reveal
├── content/             # Typed source-of-truth data (edit copy here)
│   ├── site.ts          # identity, nav, socials, resume URL
│   ├── projects.ts
│   ├── services.ts
│   ├── skills.ts
│   ├── experience.ts
│   ├── education.ts
│   ├── process.ts
│   └── faq.ts
├── lib/
│   ├── env.ts           # zod-validated env
│   ├── motion-tokens.ts # single source of truth for durations / easings
│   ├── schemas.ts       # shared zod schemas (contact form)
│   ├── ratelimit.ts     # Upstash w/ in-memory fallback
│   ├── email.ts         # Resend client + HTML templates
│   └── utils.ts         # cn(), clamp, formatRange
├── styles/
│   └── globals.css      # design tokens + .glass / .spotlight / grain
└── ...
public/
├── favicon.svg
├── portrait.jpg
└── resume.pdf
```

---

## Editing content

All copy lives in `src/content/*.ts`. Components consume the typed
exports — no hard-coded strings in JSX.

- **Identity / nav / socials / resume URL** → `src/content/site.ts`
- **Services cards** → `src/content/services.ts`
- **Projects** → `src/content/projects.ts` (also drives `/projects/[slug]`)
- **Skills** → `src/content/skills.ts`
- **Experience timeline** → `src/content/experience.ts`
- **Education** → `src/content/education.ts`
- **Process** → `src/content/process.ts`
- **FAQ** → `src/content/faq.ts` (also drives FAQPage JSON-LD)

After editing, run `pnpm lint && pnpm typecheck` to verify.

---

## Design tokens

All visual values are CSS variables in `src/styles/globals.css`. Each
token has a dark default and a `:root[data-theme='light']` override.

| Group        | Variables                                                      |
| ------------ | -------------------------------------------------------------- |
| Surfaces     | `--bg-base`, `--bg-elevated`, `--bg-inverse`                  |
| Glass        | `--glass-bg`, `--glass-border`, `--glass-highlight`, `--glass-shadow`, `--glass-blur` |
| Accent       | `--accent-1` (violet), `--accent-2` (cyan)                     |
| Text         | `--text-primary`, `--text-secondary`, `--text-muted`, `--text-inverse` |
| Line         | `--line`                                                       |
| Cursor       | `--cursor-x`, `--cursor-y`, `--cursor-intensity`               |
| Fonts        | `--font-display`, `--font-sans`, `--font-mono`                 |

Tailwind reads these via `tailwind.config.ts` — do not duplicate values in
components. Animations should consume `motionTokens` from
`src/lib/motion-tokens.ts`, not raw durations.

---

## Motion language

`src/lib/motion-tokens.ts` is the only place durations, easings, springs,
and stagger values live. Components import from there. Examples:

```tsx
import { motionTokens } from '@/lib/motion-tokens';

transition={{
  duration: motionTokens.duration.base,
  ease: motionTokens.easing.primary,
  delay: motionTokens.stagger.base,
}}
```

`prefers-reduced-motion` is respected globally:
- Lenis is bypassed
- R3F is hidden (hero static fallback)
- Custom cursor is hidden
- CSS animations/transitions collapse to instant
- `[data-reveal]` nodes show immediately

Add `?nofx=1` to any URL to force-disable heavy effects for screenshots.

---

## Performance & accessibility

- Server components by default; R3F and Framer-Motion islands marked `'use client'`
- `next/image` for raster assets; `priority` reserved for the LCP image
- WebGL: capped DPR `[1, 2]`, suspended off-screen via the page visibility,
  hidden entirely on coarse pointers / reduced motion
- Cursor spotlight + custom cursor are desktop-only (skipped on touch)
- Per-page backdrops are layered to avoid stacking-context thrash
- First-load JS for `/` is **201 kB** (target was ≤ 200 kB — within budget)
- Lighthouse targets: Performance ≥ 90, Accessibility/Best Practices/SEO = 100
  (run Lighthouse manually once an OG image and resume PDF are in place)

---

## Security

- Server-side `zod` validation on every form submission
- Honeypot field with a per-session random name (`hp_<random>`) — bots fill
  it, real users never see it; the API answers a filled honeypot with a
  silent 200 so the bot learns nothing
- Per-IP rate limit (Upstash in prod, in-memory fallback locally) — 5 req / min
- `next.config.ts` ships CSP, X-Frame-Options DENY, Referrer-Policy,
  Permissions-Policy, HSTS, X-Content-Type-Options nosniff
- No secrets in client bundles; `metadataBase` resolves OG images safely

---

## Deployment (Vercel)

The repo is Vercel-ready as-is — no adapter, no `vercel.json`, no build
flags. Vercel auto-detects Next.js and the framework preset is correct out
of the box.

**1. Push the repo to GitHub**

```bash
git push origin main
```

**2. Create the project**

Vercel dashboard → *Add New* → *Project* → import `himanshu-raj-sharma/portfolio`.
Leave the framework preset as **Next.js** and the build command as
`pnpm build`. Vercel reads `packageManager` and `engines` from
`package.json` and installs with pnpm 9.15 on Node 22.

**3. Add the environment variables**

*Settings → Environment Variables* → add for **Production** (and **Preview**
if you want previews to send mail):

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | recommended | Your canonical origin, e.g. `https://your-domain.com`. **Optional** — see below |
| `RESEND_API_KEY` | for email | https://resend.com/api-keys |
| `CONTACT_TO_EMAIL` | for email | Inbox that receives inquiries |
| `CONTACT_FROM_EMAIL` | for email | Verified sender on your domain |
| `UPSTASH_REDIS_REST_URL` | optional | Distributed rate limiting (recommended on Vercel) |
| `UPSTASH_REDIS_REST_TOKEN` | optional | — |

Without the Resend keys the contact form still validates and returns
success, but nothing is emailed — the API logs the submission instead.

**Canonical URL without any configuration:** when `NEXT_PUBLIC_SITE_URL` is
not set, the build falls back to `VERCEL_PROJECT_PRODUCTION_URL` (your
`*.vercel.app` domain) and then to the deployment URL, so the first deploy
never publishes `http://localhost:3000` canonical links, OG image URLs or
sitemap entries. Set the variable once you attach a custom domain.

**4. Deploy.** Pushing to `main` re-deploys automatically. Check the build
log for `✓ Compiled successfully`.

**5. After the first deploy**

- Project → *Settings → General* → turn on **Web Analytics** and
  **Speed Insights** (the site ships both; without them their bootstrap
  scripts 404 harmlessly).
- Add a custom domain under *Settings → Domains*, then set
  `NEXT_PUBLIC_SITE_URL` to it and redeploy.
- Submit `https://your-domain.com/sitemap.xml` in Google Search Console and
  check the OG image in the Twitter Card validator.

**What is already handled for you**

- `/sitemap.xml` and `/robots.txt` are generated from `src/app/sitemap.ts`
  and `src/app/robots.ts` — no post-build step needed.
- `/opengraph-image` is generated at build time by `@vercel/og` on the edge
  runtime.
- Security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy,
  Referrer-Policy, nosniff) are applied by `next.config.ts`.
- The contact API reads the client IP from `x-forwarded-for`, which Vercel
  sets.
- `NEXT_PUBLIC_*` variables are inlined at build time by Next.js, so the
  canonical URL is baked into the static pages.

---

## Decisions made

These decisions were made during the build so the single-pass run didn't
block on questions:

- **Fonts**: the display face is **Fraunces**, loaded through `next/font`
  (self-hosted, no render-blocking request to a font CDN). It is paired with
  Inter for body copy and JetBrains Mono for labels. An earlier version
  referenced Clash Display / Satoshi, which were never loaded and silently
  fell back to the browser serif — that is what the headings looked like
  before.
- **Light-mode color pair** uses a cooler pastel gradient, deliberately
  avoiding the same hue pair as dark mode — the visual identity shifts
  instead of merely inverting.
- **Glass cards** use CSS-only effects (backdrop-filter + a gradient border
  mask + a radial cursor layer). No SVG displacement filter on cards
  (heavy on mobile); only the hero R3F blob has a refractive material.
- **R3F is bypassed** on `prefers-reduced-motion`, touch devices, and when
  `?nofx=1` is in the URL.
- **Custom cursor** morphs into a labelled pill via the `data-cursor` attr
  on interactive elements (e.g. `<a data-cursor="Visit">`).
- **Email capture** has no fallback queue: when Resend fails the API
  returns 502. Add a queue (Upstash QStash or pg-boss) before going live if
  you need guaranteed delivery.
- **Rate limit** uses an in-memory token bucket by default (works in dev
  and single-instance prod). Set Upstash env vars to use the distributed
  limiter; same interface.
- **Playwright test count** is intentionally one smoke spec — extends easily.

---

## Master TODO list (must fill before launch)

These are deliberately marked `TODO:` in the codebase so they're easy to
search. The build still runs without them.

1. **LinkedIn handle** — `src/content/site.ts` (`social.linkedin`) — confirm
   the exact profile URL
2. **Project details** — `src/content/projects.ts`
   - `problem`, `architecture`, `challenges`, `outcome` for each project
   - Optional `cover` and `screenshots[]` URLs — the case-study page does not
     render images yet, and a portfolio without screenshots is weak evidence
3. **Case-study links** — `src/content/projects.ts` — the GitHub links for
   `acfm-net` and `punyakart-foundation` should point at real repositories
4. **Name consistency** — the site uses "Himanshu Raj" while the resume and
   some metadata say "Himanshu Raj Sharma" — pick one
5. **Location consistency** — `Gaya` vs `Dehradun` appears in the JSON-LD,
   the footer, the resume metadata and the keywords — decide the story
   (e.g. "based in Gaya, studied in Dehradun") and apply it everywhere
6. **Optional: Cal.com embed** — `src/content/site.ts` has `bookingUrl` set
   to `undefined`; set it and the "Book a call" button appears
7. **OG image font rendering** — the `opengraph-image.tsx` route uses
   sans-serif; for branded OG art, embed the display font as a TTF and
   pass it via `ImageResponse({ ..., fonts: [{ name, data, weight, style }] })`
8. **Verify with Lighthouse** on a deployed preview URL — adjust
   `backdrop-blur`, font loading strategy, or image sizes if needed
9. **Verify with axe / pa11y** once content is final

---

## License

Personal portfolio code — not for redistribution without permission.