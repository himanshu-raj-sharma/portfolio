# Architecture & Tech Deep-Dive — Himanshu Raj Sharma Portfolio

> A guided tour of *how* this portfolio is built and *why* every layer exists.
> Designed so you can explain the project end-to-end in an interview without
> opening the editor.
>
> For setup, deployment and content editing, see [`README.md`](./README.md).

---

## 0. TL;DR — the 30-second pitch

- A **Next.js 15 (App Router) + TypeScript** personal site with a **Liquid
  Glass Studio** visual identity (layered glass, OKLCH-tuned accents,
  cursor-reactive spotlight, optional R3F hero blob, Lenis-smooth scroll).
- **Server Components by default**, client islands only where motion / browser
  APIs are needed. **API route** for the contact form: zod validation +
  honeypot + per-IP rate limit + Resend for email.
- Performance budget: **Lighthouse Perf ≥ 90** (mobile), **first-load JS ≤ 200 kB**
  on the home route (currently 200 kB), **LCP < 2.0s**, **CLS < 0.05**.
- Accessibility: **prefers-reduced-motion** bypasses Lenis, R3F, custom
  cursor and animations; semantic landmarks; full keyboard support; focus
  rings; aria-live form errors.
- Security: **CSP**, **HSTS**, **X-Frame-Options DENY**, **Referrer-Policy**,
  **Permissions-Policy**, server-side zod validation, rate limit, honeypot.
- SEO: per-route **Metadata API**, **sitemap.xml**, **robots.txt**, edge-rendered
  **OpenGraph image**, JSON-LD (Person, WebSite, ProfessionalService, FAQPage,
  BreadcrumbList), canonical URLs.

---

## 1. High-level architecture

```mermaid
graph LR
  subgraph Browser
    UI["React 19 UI<br/>(Server + Client Components)"]
    Cursor["Custom cursor +<br/>CursorHoverBinder"]
    R3F["R3F hero scene<br/>(dynamic, lazy)"]
    Lenis["Lenis<br/>smooth scroll"]
    Form["react-hook-form + zod"]
  end

  subgraph Next["Next.js 15 (Vercel Edge / Node)"]
    Pages["App Router pages<br/>/, /projects, /projects/[slug],<br/>/resume, /404"]
    API["Route Handler<br/>POST /api/contact"]
    OG["opengraph-image.tsx<br/>(edge runtime)"]
    Sitemap["sitemap.ts / robots.ts"]
    Metadata["Metadata API<br/>(per-route)"]
    Headers["next.config headers<br/>(CSP, HSTS, …)"]
  end

  subgraph Services
    Resend["Resend<br/>email API"]
    Upstash["Upstash Redis<br/>(rate limit, optional)"]
    Vercel["Vercel Analytics<br/>+ Speed Insights"]
  end

  UI --> Cursor
  UI --> R3F
  UI --> Lenis
  UI --> Form
  Form -->|POST JSON| API
  API -->|validate| Zod["zod schema<br/>(shared client+server)"]
  API -->|limit| Rate["Rate limit<br/>Upstash w/ in-memory fallback"]
  API -->|send| Resend
  Sitemap --> SearchEngines["Google / Bing"]
  OG --> Social["Twitter / LinkedIn / Slack unfurl"]
  UI --> Vercel
  Pages --> Headers
```

**Why this shape?** Next.js's App Router gives us streaming, Server Components,
and route handlers without a separate API server. Everything important
(validation, rate limit, JSON-LD, metadata) lives *inside the request path*
so there's nothing extra to operate.

---

## 2. Folder structure — "where does what live?"

```mermaid
graph TD
  src["src/"]
  src --> app["app/<br/>routes · layout · sitemap · robots · opengraph-image"]
  src --> comp["components/<br/>ui · sections · layout · motion · three · seo"]
  src --> content["content/<br/>typed site data (projects, skills, FAQ, …)"]
  src --> lib["lib/<br/>env · schemas · ratelimit · email · motion-tokens · utils"]
  src --> hooks["hooks/"]
  src --> styles["styles/<br/>globals.css — design tokens"]
  src --> types["types/"]

  app --> api["api/contact/<br/>POST handler"]
  app --> proj["projects/[slug]/"]
  app --> resume["resume/"]
  app --> notfound["not-found.tsx · error.tsx"]
  app --> layout["layout.tsx · page.tsx"]

  comp --> ui["ui/<br/>GlassCard · GlassButton ·<br/>Container · Section · Badge · Reveal"]
  comp --> sections["sections/<br/>Hero · About · Services ·<br/>Projects · Skills · Experience ·<br/>Education · Process · FAQ · Contact · Footer"]
  comp --> motion["motion/<br/>CursorProvider · CursorHoverBinder ·<br/>CustomCursor · SmoothScroll · MagneticButton · Preloader"]
  comp --> three["three/<br/>HeroScene.tsx (R3F)"]
  comp --> layoutC["layout/<br/>Shell · Navbar · ThemeProvider"]
  comp --> seo["seo/<br/>JsonLd · Analytics"]
```

**Rule of thumb:** *components stay content-free.* All copy lives in
`src/content/*.ts`. Want to retune a section? Edit the data file, not the
component.

---

## 3. The request lifecycle — "what happens when someone hits /?"

```mermaid
sequenceDiagram
  participant U as User
  participant V as Vercel / CDN
  participant N as Next.js (Node runtime)
  participant DB as Content (in-repo TS)

  U->>V: GET /
  V->>N: routed to App Router
  N->>DB: import src/content/site.ts etc.
  DB-->>N: typed data
  N-->>U: HTML (Server Components)
  Note over U,N: HTML includes JsonLd,<br/>metadata, OpenGraph, prefetched chunks
  U->>U: hydrate client islands<br/>(Hero split-text, FAQ accordion,<br/>Projects filter, Form, Cursor)
  U->>N: GET /_next/static/chunks/*.js
  N-->>U: lazy R3F chunk<br/>(only if coarse=false && reduced-motion=false)
```

**Performance lever:** the heaviest visual (R3F + Three.js) is `dynamic(..., { ssr: false })`, loaded only after mount, and **gated by client capability checks** (`prefers-reduced-motion`, `(pointer: coarse)`).

---

## 4. The contact form — "how does data actually move?"

```mermaid
sequenceDiagram
  participant U as User
  participant Form as react-hook-form<br/>+ zodResolver
  participant API as POST /api/contact
  participant Z as contactSchema (server)
  participant RL as Rate limiter
  participant HP as Honeypot check
  participant Mail as Resend client

  U->>Form: fill + submit
  Form->>Form: client-side validate (zodResolver)
  alt invalid
    Form-->>U: inline errors (aria-live)
  end
  Form->>API: POST JSON
  API->>RL: rateLimit(ip)
  alt limited
    API-->>U: 429 + Retry-After
  end
  API->>HP: check `website` honeypot
  alt filled (bot)
    API-->>U: 200 { ok: true } (silent)
  end
  API->>Z: contactSchema.omit({ website }).safeParse
  alt invalid
    API-->>U: 422 + field details
  end
  API->>Mail: send owner + sender emails
  alt delivered
    API-->>U: 200 { ok: true, delivered: true }
  else
    API-->>U: 502 (or 202 in dev with no RESEND_API_KEY)
  end
```

**Security layers, in order:**
1. **Per-IP rate limit** (Upstash in prod, in-memory bucket fallback locally) — 5 req/min.
2. **Honeypot** — a hidden `website` field. Bots fill it; humans don't. Bots that fill it get a silent `200` (no leak).
3. **Server-side zod** — same schema as the client, but the server strips the honeypot first and uses `.omit()` so the schema can't be tricked.
4. **Escape** — every interpolated value in email templates is HTML-escaped (no XSS via the message body).

---

## 5. Design system — "what powers Liquid Glass?"

### 5.1 Design tokens (single source of truth)

All visual values are **CSS variables in `src/styles/globals.css`**, with a
dark default and a `:root[data-theme='light']` override. Tailwind reads them
via `tailwind.config.ts` — components never hard-code colors.

```mermaid
graph LR
  Tokens["CSS variables<br/>(globals.css)"] --> Tw["Tailwind theme.extend.colors"]
  Tw --> U["text-text-primary<br/>bg-glass-bg<br/>text-accent-1<br/>…"]
  Tokens --> Gl["CSS classes<br/>.glass · .glass-elevated · .glass-interactive · .spotlight"]
  Gl --> Cards["GlassCard · GlassButton ·<br/>section panes"]
```

| Group       | Variable                                             | Used for                              |
| ----------- | ---------------------------------------------------- | ------------------------------------- |
| Surfaces    | `--bg-base`, `--bg-elevated`, `--bg-inverse`         | Page background, cards, inverted text |
| Glass       | `--glass-bg`, `--glass-border`, `--glass-highlight`, `--glass-shadow`, `--glass-blur` | Every glass surface |
| Accent      | `--accent-1` (violet), `--accent-2` (cyan)           | CTAs, gradients, spotlight            |
| Text        | `--text-primary`, `--text-secondary`, `--text-muted`, `--text-inverse` | Hierarchy |
| Cursor      | `--cursor-x`, `--cursor-y`, `--cursor-intensity`     | Set globally by CursorProvider        |
| Fonts       | `--font-display`, `--font-sans`, `--font-mono`       | Wired via `next/font` + inline CSS var |

### 5.2 Glass primitive — what makes a card look like glass?

```mermaid
graph TD
  Card[".glass"]
  Card --> A["backdrop-filter: blur(22px) saturate(140%)"]
  Card --> B["translucent bg<br/>--glass-bg"]
  Card --> C["1px border<br/>--glass-border"]
  Card --> D["inner top sheen<br/>inset 0 1px 0 var(--glass-highlight)"]
  Card --> E["soft shadow<br/>var(--glass-shadow)"]
  Card --> F["specular ribbon ::after<br/>(gradient border mask)"]
```

The ribbon is the signature bit: a linear-gradient painted into the
**padding box only** (via `mask-composite: exclude`) so it traces the
border as a highlight without a real second border.

### 5.3 Cursor spotlight — how a single listener lights every card

```mermaid
sequenceDiagram
  participant W as window
  participant P as CursorProvider
  participant C as .spotlight ::before
  participant Card as any glass card

  W->>P: pointermove (rAF-throttled)
  P->>P: set --cursor-x/y/intensity on :root
  Note over Card: CSS reads<br/>--cursor-x/y/intensity<br/>via radial-gradient
  C->>Card: glow follows pointer (no per-card listener)
```

**Why global CSS variables?** No `mousemove` listener per card — that's
O(N) listeners. One global listener, N cards share the state for free.

---

## 6. Motion system — "where do durations and easings come from?"

```mermaid
graph TD
  Tokens["src/lib/motion-tokens.ts<br/>(durations, easings, springs, stagger)"]
  Tokens --> CSS["CSS keyframes<br/>(fade-up, marquee, shimmer, pulse-glow)"]
  Tokens --> FM["Framer Motion<br/>transitions"]
  Tokens --> Lenis["Lenis<br/>(smooth scroll)"]
  Tokens --> GSAP["GSAP ScrollTrigger<br/>(pinned/scrubbed scenes)"]
  R["prefers-reduced-motion"] -.->|bypass| Lenis
  R -.->|bypass| GSAP
  R -.->|bypass| R3F
  R -.->|hide| Cursor
```

**Three rules enforced by the codebase:**
1. **Never animate `layout` properties** — only `transform`, `opacity`, `filter`.
2. **Nothing over 1.2s** — entrances ease-out, exits faster than entrances.
3. **One source of truth** — every component imports from `motionTokens`. There is no inline `duration: 0.7` anywhere.

**Reduced motion:** the global CSS rule in `globals.css` collapses every
animation/transition to `0.001ms` when the user opts out. Lenis and R3F
also gate themselves client-side.

---

## 7. R3F hero — "why only one WebGL scene?"

```mermaid
graph LR
  Hero["Hero.tsx (server-friendly)"]
  Hero --> Check["Capability check<br/>(prefers-reduced-motion,<br/>pointer: coarse, ?nofx)"]
  Check -->|skip| NoOp["return null"]
  Check -->|ok| Dyn["dynamic(() => import HeroScene,<br/>{ ssr: false })"]
  Dyn --> Scene["HeroScene.tsx<br/>(R3F Canvas, DPR ≤ 2)"]
  Scene --> Blob["Refractive MeshDistortMaterial blob"]
  Scene --> Particles["BufferGeometry particle field"]
  Scene --> Lights["2x PointLight<br/>(violet + cyan)"]
```

**Trade-offs taken:**
- **One scene, three.js only loaded on capable clients.** Capacitive touch devices and `prefers-reduced-motion` users get a static gradient instead of a 300 kB WebGL dependency.
- **DPR capped at `[1, 2]`** — sharper on retina without melting mobile GPUs.
- **`Suspense fallback={null}`** — avoids a flash of an empty canvas.

---

## 8. SEO & structured data — "what makes Google happy?"

```mermaid
graph LR
  Routes["/ , /projects, /projects/[slug], /resume"]
  Routes --> Meta["Metadata API<br/>(title, description, OG, Twitter)"]
  Routes --> Canon["alternates.canonical"]
  Routes --> JsonLd["layout.tsx → JsonLd component"]
  JsonLd --> Person["schema.org/Person"]
  JsonLd --> WebSite["schema.org/WebSite"]
  JsonLd --> Service["schema.org/ProfessionalService"]
  JsonLd --> FAQ["schema.org/FAQPage"]

  Slug["/projects/[slug]"] --> Breadcrumb["BreadcrumbList JSON-LD"]
  Slug --> ArticleMeta["og:type = article"]

  Layout["next.config headers"] --> H1["Content-Security-Policy"]
  Layout --> H2["Strict-Transport-Security"]
  Layout --> H3["X-Frame-Options: DENY"]
  Layout --> H4["Referrer-Policy: strict-origin-when-cross-origin"]
  Layout --> H5["Permissions-Policy"]
```

**Sitemap & robots** are *server-rendered* by `src/app/sitemap.ts` and
`src/app/robots.ts` — no separate build step needed.

---

## 9. Performance strategy

```mermaid
graph TD
  Perf["Performance budget"]
  Perf --> A["Server Components by default"]
  Perf --> B["Dynamic import for heavy/below-fold<br/>(R3F, framer-motion islands)"]
  Perf --> C["next/image with sizes<br/>(priority only on LCP image)"]
  Perf --> D["DPR cap [1,2] · WebGL hidden on mobile"]
  Perf --> E["Custom cursor / spotlight<br/>desktop-only (skipped on touch)"]
  Perf --> F["Lenis + GSAP only when<br/>prefers-reduced-motion = false"]
  Perf --> G["First-load JS ≤ 200 kB<br/>(target met: 200 kB on /)"]
```

---

## 10. Testing strategy

```mermaid
graph LR
  subgraph Unit
    Vitest["Vitest (Node)<br/>tests/unit/*.test.ts"]
    Schemas["schemas.test.ts<br/>8 cases"]
    Utils["utils.test.ts<br/>3 cases"]
    RL["ratelimit.test.ts<br/>2 cases"]
  end

  subgraph E2E
    PW["Playwright (chromium)<br/>tests/e2e/smoke.spec.ts"]
    PW --> T1["Home renders H1 + Hire me"]
    PW --> T2["Contact form shows validation error"]
    PW --> T3["Projects index lists work"]
    PW --> T4["404 page returns 404 + 'Wrong door'"]
  end

  subgraph Quality
    Lint["pnpm lint<br/>(next/core-web-vitals)"]
    TC["pnpm typecheck<br/>(tsc --noEmit, strict)"]
    Build["pnpm build<br/>(13 routes)"]
  end
```

| Layer        | Tool        | What it covers                                       |
| ------------ | ----------- | ---------------------------------------------------- |
| Unit         | Vitest      | zod schema, in-memory rate limit, utility helpers     |
| E2E smoke    | Playwright  | Page renders, navigation, 404 path                   |
| Typecheck    | `tsc --noEmit` | Strict TS, `noUncheckedIndexedAccess`, path aliases |
| Lint         | next lint   | next/core-web-vitals + typescript rules              |
| Build        | next build  | Catches RSC errors, route generation, bundle size     |

---

## 11. Accessibility checklist

- **Skip link** — `.skip-link` jumps to `<main id="main">`.
- **Landmarks** — `<header>`, `<main>`, `<footer>`, `<nav aria-label="Primary">`.
- **Reduced motion** — Lenis/R3F/cursor/animation all bypass when the user opts out.
- **Focus rings** — global `:focus-visible` uses accent color.
- **Form errors** — `aria-live="assertive"` + `role="alert"`.
- **Custom cursor** — `pointer: coarse` skips it entirely; never blocks pointer events.
- **Headings** — one `<h1>` on each page; sections use `<h2>` + `<h3>` (FAQ items).
- **Icons** — every icon-only button has `aria-label`.
- **Filters** — `role="group"` + `aria-pressed` on toggle buttons.
- **FAQ** — `aria-expanded`/`aria-controls` on each button, `role="region"` + `aria-labelledby` on the panel.

---

## 12. Security checklist

- **CSP** — no remote scripts; allowed origins limited to Resend + Upstash + Vercel Insights.
- **HSTS** — `max-age=31536000; includeSubDomains`.
- **X-Frame-Options: DENY** + `frame-ancestors 'none'`.
- **Referrer-Policy: strict-origin-when-cross-origin**.
- **Permissions-Policy** — camera, microphone, geolocation, interest-cohort all disabled.
- **Honeypot + rate limit** on the contact API.
- **HTML-escape** in email templates.
- **No secrets in client bundles** — env is split between `NEXT_PUBLIC_*` (intentional) and server-only.
- **`metadataBase` set** in root layout so OG/Twitter URLs resolve.

---

## 13. Tooling & dev experience

```mermaid
graph LR
  Code["TS / TSX"] --> ESLint["ESLint<br/>(next/core-web-vitals + TS)"]
  Code --> Prettier["Prettier +<br/>prettier-plugin-tailwindcss"]
  ESLint --> Hook["Husky pre-commit"]
  Prettier --> Hook
  Hook --> LintStaged["lint-staged<br/>*.{ts,tsx,js,jsx,css,json,md}"]
  Code --> TS["tsc --noEmit (strict)"]
  Code --> Vitest
  Code --> Playwright
  TS --> CI["Local gate<br/>(typecheck, lint, test, build)"]
```

`packageManager: "pnpm@9.15.0"` is set in `package.json` so Corepack pins the
right version. `pnpm` is also wired into `playwright.config.ts` for E2E.

---

## 14. Deployment shape (Vercel)

```mermaid
graph LR
  GH["GitHub repo"] --> V["Vercel"]
  V --> Build["next build<br/>(13 routes)"]
  Build --> Edge["Edge: opengraph-image.tsx"]
  Build --> SSR["Node SSR: /api/contact"]
  Build --> Static["Static: /, /projects, /projects/[slug],<br/>/resume, /sitemap, /robots"]
  V --> Env["Env vars from Vercel UI"]
  Env --> RESEND["RESEND_API_KEY"]
  Env --> TO["CONTACT_TO_EMAIL"]
  Env --> FROM["CONTACT_FROM_EMAIL"]
  Env --> UP["UPSTASH_* (optional)"]
  Env --> URL["NEXT_PUBLIC_SITE_URL"]
```

After first deploy: submit `/sitemap.xml` to Google Search Console, verify
the OG image in Twitter's card validator.

---

## 15. "What would you change if you had more time?"

Be honest in the interview — these are the deliberate trade-offs:

1. **Headless CMS** — right now content lives in TS files. For non-dev edits, a Sanity / Contentful schema would be the next step.
2. **Email queue** — Resend failures return 502. For guaranteed delivery, drop in Upstash QStash or pg-boss before the handler.
3. **OG font** — the opengraph-image route uses system sans. Embed Clash Display as a TTF for branded share cards.
4. **Real headshot + screenshots** — currently placeholder rectangles.
5. **Pinned-cards scroll showcase** — the spec mentioned pinned stacked cards for projects; current grid is filterable but not pinned. Easy to add with `gsap.timeline({ scrollTrigger: { scrub: true, pin: true } })`.
6. **i18n** — Dehradun, India is the primary market. Adding `next-intl` for Hindi is a one-afternoon addition.

---

## 16. One-liner per file (for quick recall)

| File                                | What it does in one line                                   |
| ----------------------------------- | ---------------------------------------------------------- |
| `src/app/layout.tsx`                | Root HTML, fonts, metadata base, mounts `AppShell`.         |
| `src/app/page.tsx`                  | Home page composition — every section in order.            |
| `src/app/sitemap.ts`                | Builds `/sitemap.xml` from `projects[]`.                   |
| `src/app/robots.ts`                 | Allow `/`, disallow `/api/`, point at sitemap.             |
| `src/app/opengraph-image.tsx`       | Edge-rendered 1200×630 OG card.                            |
| `src/app/api/contact/route.ts`      | POST handler: rate-limit → honeypot → zod → Resend.        |
| `src/lib/env.ts`                     | zod-validated env, server vs client split.                 |
| `src/lib/schemas.ts`                | Shared `contactSchema`, enums, labels.                     |
| `src/lib/ratelimit.ts`              | Upstash w/ in-memory fallback token bucket + GC.           |
| `src/lib/email.ts`                  | Resend client + HTML/text templates, escaped interpolation.|
| `src/lib/motion-tokens.ts`          | Durations, easings, springs, staggers — single source.      |
| `src/lib/utils.ts`                  | `cn`, `clamp`, `formatRange`, `makeId`, `sleep`.           |
| `src/components/ui/GlassCard.tsx`   | Layered-glass card primitive (default / elevated / interactive). |
| `src/components/ui/GlassButton.tsx` | Button or link primitive (primary / secondary / ghost).   |
| `src/components/ui/Container.tsx`   | Max-width wrapper with editorial gutters.                  |
| `src/components/ui/Section.tsx`     | `<section>` + `SectionHeading` (number + caption + title). |
| `src/components/ui/Reveal.tsx`      | IntersectionObserver fade/translate primitive.             |
| `src/components/ui/Badge.tsx`       | Pill / status indicator.                                   |
| `src/components/layout/Shell.tsx`   | Providers tree, navbar, footer, skip link, grain.           |
| `src/components/layout/Navbar.tsx`  | Sticky glass nav, mobile menu, theme toggle.               |
| `src/components/motion/CursorProvider.tsx` | Tracks pointer, sets `--cursor-x/y/intensity` globally.|
| `src/components/motion/CursorHoverBinder.tsx` | Document-level listener for `[data-cursor]`.       |
| `src/components/motion/CustomCursor.tsx` | Dot + trailing ring, morphs into labelled pill.      |
| `src/components/motion/MagneticButton.tsx` | Wraps children, springs toward cursor within radius. |
| `src/components/motion/SmoothScroll.tsx`   | Lenis + GSAP ScrollTrigger in lockstep.            |
| `src/components/motion/Preloader.tsx`       | One-per-session monogram + glass wipe.             |
| `src/components/three/HeroScene.tsx`        | R3F refractive blob + particles (desktop only).    |
| `src/components/seo/JsonLd.tsx`             | `@graph` JSON-LD (Person/WebSite/Service/FAQ).     |
| `src/components/seo/Analytics.tsx`          | Vercel Analytics + Speed Insights.                 |
| `src/components/sections/*.tsx`             | One component per home section + Footer.           |

---

## 17. Talking points for the interview

Use these as bullet seeds:

- **"Tell me about a recent project"** — this one. Lead with the *problem* (recruiters drop off in <30s, clients need trust within 2min) and the *constraints* (must rank locally, must load on mid-range phones, must work without JS).
- **"How did you keep it fast?"** — Server Components by default, dynamic import for R3F, custom cursor gated to desktop, one global pointer listener for N cards, no layout-property animations.
- **"How do you handle accessibility?"** — reduced-motion bypasses everything heavy; semantic landmarks; form errors are `aria-live`; FAQ uses proper `aria-expanded`/`aria-controls`; icon buttons have `aria-label`.
- **"What about security?"** — CSP + HSTS + XFO + Permissions-Policy in `next.config.ts`; honeypot + rate limit on the form; server-side zod; HTML-escaped email templates.
- **"Why this stack?"** — Next.js 15 RSC + App Router gives us streaming + per-route metadata + route handlers; GSAP for scrubbed scroll storytelling; R3F only where it's worth the cost; Resend for transactional email without a separate service.
- **"What would you do differently?"** — pin-based showcase for projects (current grid is filterable, not pinned), CMS-backed content for non-dev edits, email queue for retries.

Happy interviewing. 🚀