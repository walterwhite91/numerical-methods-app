# Numerical Methods Learner

An interactive companion for **MCSC-202 (Numerical Methods)** — learn the theory,
review algorithm steps, verify solutions step-by-step, and browse past exam
questions. Built by **Mimansh Pokhrel**.

**Live:** https://numerical-methods-app.pages.dev

---

## Features

- **Method Explorer** — theory, mathematical formula, algorithm steps, a
  self-contained Python implementation, and a **graphical interpretation** for
  each method (root-finding, interpolation, ODE, integration, curve fitting).
- **Problem Solver** — enter your own inputs and get the final answer, a
  step-by-step iteration table, calculation steps, and a **graph** of the method
  in action.
  - Root finding: Bisection, Secant, False Position, Newton-Raphson, Generalized Newton
  - ODE (IVP): Euler, Modified Euler, RK4
  - Integration: Trapezoidal, Simpson's 1/3, Simpson's 3/8
  - Interpolation: Newton's Forward / Backward Difference — with a **staggered
    diagonal difference table** (each Δᵏy centred between the two entries it came from)
  - Error: Absolute & Relative Error
- **Past Q&As** — exam questions organised by chapter with answers and guided
  explanations.

## Architecture

| Part | Stack | Deploy target |
| --- | --- | --- |
| `frontend/` | Next.js (static export), React, KaTeX | Cloudflare Pages (`numerical-methods-app`) |
| `worker/` | Hono on Cloudflare Workers, TypeScript | Cloudflare Workers (`numerical-methods-api`) |

The worker exposes the computation API and, for the solver, attaches sampled
plot data to each response; the frontend draws it with a dependency-free inline
SVG component (`MethodGraph`). Theory-page graphs are generated entirely
client-side.

## Local development

```bash
# API (Cloudflare Worker)
cd worker
npm install
npm run dev          # wrangler dev

# Frontend (Next.js)
cd frontend
npm install
npm run dev          # http://localhost:3000
```

The frontend reads the API base URL from `NEXT_PUBLIC_API_URL`
(`frontend/.env.production` points at the deployed worker).

## Build & deploy

```bash
# Worker
cd worker && npm run deploy

# Frontend (static export → Pages)
cd frontend && npm run build && npm run deploy
```

Deploying requires a logged-in Cloudflare account (`npx wrangler login`).

## Project layout

```
frontend/   Next.js app (Method Explorer, Solver, Past Q&As)
  src/app/          routes
  src/components/   MethodGraph, CodePreview, MathDisplay, …
  src/lib/          method data, theory graphs, generated code
worker/     Hono API on Cloudflare Workers
  src/methods/      numerical method implementations
  src/lib/          expression evaluator, graph data builders
scripts/    build helpers (generates method code snippets)
```

---

Built by **Mimansh Pokhrel** — MCSC-202, Kathmandu University.
