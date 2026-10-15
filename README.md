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

# Public
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME="Himanshu Raj Sharma"
NEXT_PUBLIC_GA_ID=
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
└── resume.pdf           # TODO — drop the real PDF here
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
- Honeypot field (`website`) — bots fill it, real users don't
- Per-IP rate limit (Upstash in prod, in-memory fallback locally) — 5 req / min
- `next.config.ts` ships CSP, X-Frame-Options DENY, Referrer-Policy,
  Permissions-Policy, HSTS, X-Content-Type-Options nosniff
- No secrets in client bundles; `metadataBase` resolves OG images safely

---

## Deployment (Vercel)

1. Push the repo to GitHub.
2. Create a new Vercel project pointing at the repo.
3. Vercel auto-detects Next.js. The framework preset is correct out of the box.
4. Add the env vars from `.env.example` under **Settings → Environment Variables**.
   Recommended scope: Production for email + Upstash keys.
5. **NOT** a fork step: enable "Override" on `NEXT_PUBLIC_SITE_URL` and set it
   to your production domain (e.g. `https://himanshusharma.dev`).
6. Deploy. After the first deploy, submit your sitemap in Google Search
   Console (`/sitemap.xml`) and verify the OG image in the Twitter Card
   validator.

Optional: run `pnpm dlx next-sitemap` post-build if you want the precomputed
`public/sitemap.xml` + `public/robots.txt`. The App Router versions in
`src/app/sitemap.ts` and `src/app/robots.ts` are already wired and will be
served automatically.

---

## Decisions made

These decisions were made during the build so the single-pass run didn't
block on questions:

- **Fonts**: `--font-display` falls back to **Clash Display / Satoshi /
  General Sans** (Fontshare). The face isn't on Google Fonts; install via
  Fontshare if you want the exact file, otherwise the system serif fallback
  reads well. The CSS variable is the integration point.
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

1. **Email + social handles** — `src/content/site.ts`
   - `email`, `phone?`, `social.github`, `social.linkedin`, `social.twitter?`,
     `social.instagram?`
2. **Resume PDF** — drop `public/resume.pdf` (currently empty)
3. **Headshot** — `src/components/sections/About.tsx` has a portrait
   placeholder; replace with `<Image src="/portrait.webp" ... />`
4. **Project details** — `src/content/projects.ts`
   - `problem`, `architecture`, `challenges`, `outcome` for each project
   - Optional `cover` and `screenshots[]` URLs
5. **Internship details** — `src/content/experience.ts` (Doon Animal Welfare
   Foundation): dates and bullets
6. **Diploma institution + dates** — `src/content/education.ts`
7. **Graduation year / expected date** — `src/content/education.ts`
8. **Optional: Cal.com embed** — `src/components/sections/ContactForm.tsx`
   has a placeholder; swap in an `<iframe>` or inline embed when ready
9. **Display font** — install Clash Display from Fontshare, drop the WOFF2
   into `public/fonts/`, and add the `@font-face` block to globals.css
10. **OG image font rendering** — the `opengraph-image.tsx` route uses
    sans-serif; for branded OG art, embed the display font as a TTF and
    pass it via `ImageResponse({ ..., fonts: [{ name, data, weight, style }] })`
11. **Verify with Lighthouse** on a deployed preview URL — adjust
    `backdrop-blur`, font loading strategy, or image sizes if needed
12. **Verify with axe / pa11y** once content is final

---

## License

Personal portfolio code — not for redistribution without permission.