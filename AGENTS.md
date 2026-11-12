# AGENTS.md — working agreement for AI agents on this repo

## Git: never push without explicit approval

**Do not run `git push` (or any command that publishes to a remote) unless the
user has explicitly asked for it in that same conversation.**

Allowed without asking:
- `git status`, `git diff`, `git log`, `git show`, `git branch` — all read-only
- `git add`, `git commit` — local only, fully reversible with `git reset`
- `git fetch`, `git pull` — read-only against the remote

Requires an explicit "yes" / "push it" / "go ahead" from the user:
- `git push` (any branch, any refspec)
- `git push origin --delete ...`
- `git push --force` / `--force-with-lease`
- Creating a GitHub PR, closing a PR, or editing GitHub settings via the API

If work is finished and looks ready to ship, **stop and say so**. Suggest the
exact command (`git push origin main`) and let the user run it.

Reason: a push to `main` triggers a production deploy on Vercel. It is not a
local, reversible action.

## Local server

`pnpm start` / `pnpm dev` bind port 3000. The user has asked for localhost to be
stopped when a task finishes — always kill the process before handing back.

## Deploy-related checks

The Vercel build runs `pnpm install --frozen-lockfile` with pnpm's **default
isolated** linker. A local `.npmrc` must never set `node-linker=hoisted`:
hoisting makes transitive dependencies importable and hides missing direct
dependencies until the production build fails with *"Cannot find module …"*.

Every package imported directly in `src/` must be listed in `package.json`
(`dependencies` for runtime, `devDependencies` for build-time only).

## Before saying "done"

Run and report: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`.
E2E (`pnpm test:e2e`) needs the Chromium download; on this machine the
installed Edge can be used via a temporary Playwright config with
`channel: 'msedge'`.
