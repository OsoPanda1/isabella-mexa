# ADR-0001: Use npm as Sole Package Manager

## Status: Accepted

## Date: 20 August 2026

## Context

The Isabella Villaseñor AI project initially had both `package-lock.json` (npm) and `bun.lock` (Bun) present in the repository root. This dual-lockfile state caused dependency resolution drift: CI, local development, and Vercel builds could each resolve different versions of the same transitive dependency. Bun offers speed advantages but introduces a runtime-adjacent dependency that is not Vercel's native build toolchain. The project targets Vercel for deployment (Node.js runtime), uses Next.js 16 App Router, React 19, TypeScript 5.8, Vitest, and better-sqlite3 — all of which are well-tested under npm.

## Decision

Use **npm** (with `package-lock.json`) as the sole package manager for the project. Remove `bun.lock` and any Bun-specific configuration. All CI pipelines, local scripts, and Vercel build commands use `npm install` / `npm run`.

## Consequences

- **Positive**: Deterministic, single-source dependency resolution across all environments. Native Vercel integration with zero configuration. Broad ecosystem support and documentation coverage.
- **Negative**: Loss of Bun's install speed (~30% faster cold installs). Developers who prefer Bun must switch contexts.
- **Neutral**: Lockfile conflicts between npm and Bun are eliminated. CI build times may be slightly longer but remain within acceptable thresholds.

## Alternatives Considered

| Alternative | Rejected Because |
|---|---|
| **Bun as sole manager** | Not Vercel-native; better-sqlite3 native compilation under Bun requires additional CI complexity; runtime divergence risk with Node.js target. |
| **pnpm** | Introduces symlink-based `node_modules` structure that can break native modules (better-sqlite3); requires `.npmrc` configuration on Vercel; team already uses npm. |
| **Yarn Classic** | Deprecated in favor of Yarn Berry (PnP); Yarn PnP breaks many toolchains including Vitest config resolution. |
| **Dual lockfiles (status quo)** | The source of the drift this ADR resolves. |
