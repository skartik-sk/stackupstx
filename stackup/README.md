# StackUp — Decentralized Marketplace for Bounties, Grants & Projects

A unified, on-chain hub for the Stacks ecosystem where creators post bounties and grants, builders discover work, and payments are secured by Clarity smart contracts.

---

## Table of contents

- Executive Summary
- Problem
- Solution
- Key Features
- Technology & Architecture
- Smart Contracts
- AI Engine
- Monetization
- Roadmap
- Quick start (local)
- Contributing
- License & Contact

---

## Executive Summary

StackUp ("Stack Up") is a decentralized marketplace focused on the Stacks blockchain. It consolidates bounties, grants, and project listings into a single, discoverable platform. Creators post opportunities with on-chain, milestone-based escrow. Builders build, earn, and grow verifiable reputation on-chain.

## Problem

- Fragmented discovery: opportunities are scattered across Discord, social media, and ad-hoc pages.
- Trust & transparency gaps: off-chain agreements add counterparty risk and opacity.
- Inefficient funding: grant workflows and milestone payments are manual and slow.
- No persistent home for project-based collaboration (the "Hacker House" problem).

## Solution

A single, transparent, and decentralized marketplace that:

- Lets creators post bounties, grants, and milestone projects.
- Holds funds in audited Clarity escrow contracts until milestones are approved on-chain.
- Provides builders a place to build verifiable on-chain reputation (a "Stacker Score").
- Uses an AI idea engine to analyze and rank ideas to reduce duplication and surface high-quality opportunities.

## Key Features

- Creator command center: multi-step project & bounty creation, milestone scheduling, escrow management, winner selection UI that triggers on-chain transfers.
- Builder launchpad: verifiable profiles, application tracker, Stackers Score, limited free applications to reduce spam.
- Admin oversight: moderation feed, analytics (MAU, TVL), user management tools.
- On-chain transparency: escrow smart contracts for bounties, projects, and grants.
- AI idea engine: idea de-duplication, difficulty ranking, and suggestion system.

## Technology & Architecture

- Frontend: Next.js (React) — fast, responsive UI and SSR capabilities.
- Backend: Node.js + Express — API endpoints and microservices.
- Database: MongoDB — off-chain storage (profiles, applications, metadata).
- Blockchain: Stacks + Clarity smart contracts for escrow & payments.
- Wallet/Auth: Stacks.js / @stacks/connect for authentication & signing.
- Smart contract queries: Hiro Stacks API (or compatible indexer).
- AI services: Python microservice(s) for NLP and idea analysis.
- Styling: Tailwind CSS, Framer Motion for animations.

## Smart Contracts

Planned escrow contracts (Clarity):

- `bounty-escrow.clar` — one-time payment escrow
- `project-milestone-escrow.clar` — milestone-driven escrow and partial releases
- `grant-escrow.clar` — flexible grant approval & disbursement

Contracts are security-first and audited before production deployment.

## AI Engine

- NLP-powered microservice to analyze submitted ideas.
- Checks for similarity to existing ideas and returns a difficulty/uniqueness score.
- Priority: prevent duplicates and help match tasks to developer skill levels.

## Monetization & Business Model

- Tiered application model: 3–4 free submissions per user per month, optional small STX fee for extra submissions.
- Optional transaction fees on successful payouts (configurable).
- Sponsored/featured listings for projects, DAOs, and protocols.

## Roadmap (high-level)

- Phase 1 — The Foundation (Q4 2025)
  - Launch core platform (bounties & projects)
  - Deploy escrow smart contracts
  - Wallet connection, user profiles, application tracking
  - Release AI-powered ideas page

- Phase 2 — The Social Layer (Q1 2026)
  - Public Stacker Scores & reviews
  - Discussion forums & collaboration features
  - Decentralized grant voting

- Phase 3 — The AI Supercharge (Q2 2026)
  - Personalized recommendations
  - AI assistance for creators (writing scopes)

- Phase 4 — Network Effect (H2 2026)
  - Public impact reports, TVL dashboards
  - Public API for dApps to integrate StackUp data

## Quick start (local development)

Prerequisites: Node 18+, npm (or pnpm/yarn), MongoDB (or MongoDB Atlas), and `.env` with the values below.

1. Install dependencies

```bash
npm install
```

2. Copy environment variables (example)

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_STACKS_NETWORK=mainnet or testnet
```

3. Start the dev server

```bash
npm run dev
```

4. Open the app

- Default: http://localhost:3000

Notes:
- Wallet connect is powered by `@stacks/connect`. Configure `NEXT_PUBLIC_STACKS_NETWORK` to `testnet` during development unless you intend to use mainnet.
- The project already includes a `WalletContextNew` provider wired into the app layout.

## Environment variables (recommended)

- `NEXT_PUBLIC_STACKS_NETWORK` — `testnet` or `mainnet`
- `MONGODB_URI` — connection string for MongoDB
- Any other keys for 3rd-party services (Hiro API keys, AI microservice URL, etc.)

## Contributing

Contributions are welcome. Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Run & test locally
4. Open a pull request with a clear description and context

Include tests for new business logic and keep changes focused.

## License

This repository is provided under the MIT License. Update as needed for your organization.

## Contact

- Project: StackUp
- Author / Maintainer: see repository owners
- For product or partnership inquiries, open an issue or contact the maintainers directly.

---

> Note: This README was generated from `idea.txt` in the repository root. Use it as the canonical public-facing summary and roadmap for the StackUp project.
