# Hakai Kousen — Developer Onboarding

A **Next.js** (JavaScript) project using **Prisma** (ORM) with a **PostgreSQL** database.

Icon library: **lucide-react**.

---

## ✅ Requirements

- **Node.js 18+** (18 LTS or 20 LTS recommended)
- **npm** (or **pnpm** / **yarn**)
- **Git**
- **PostgreSQL 14+**

---

## ⚡ Quick Start

```bash
# 1) Clone the repo
git clone <REPO_URL>
cd HakaiKousen   # or your actual folder name

# 2) Install dependencies
npm install      # or pnpm install / yarn

# 3) Copy environment file
cp .env.example .env

# 4) Create the PostgreSQL database/user (see below)
#    then update DATABASE_URL in .env

# 5) Generate Prisma client & run migrations
npx prisma generate
npx prisma migrate dev -n "init"

# (optional) Open Prisma Studio
npx prisma studio

# 6) Start the dev server
npm run dev
```

App runs at **[http://localhost:3000](http://localhost:3000)**.

---

## 🗄️ Database (local PostgreSQL)

Project use NeonDB database for production and tests. For dev, ask maintainer access or create your database locally.
No data import is available at the moment.

## 🔐 Environment Variables

Create `.env` at the project root (copied from `.env.example`):

```ini
# Database
DATABASE_URL="postgresql://hakai:hakai@localhost:5432/hakai_db?schema=public"
```

> Keep **.env.example** up to date for new contributors.
>
> **Never** commit `.env`.

---

## 🧱 Prisma

- Schema: `prisma/schema.prisma`
- After any schema change:

```bash
npx prisma generate
npx prisma migrate dev -n "describe_the_change"
```

## 🧭 Project Structure (indicative)

```
/src/app
  /components
  /api
  /public
  /styles
/lib
/prisma
  schema.prisma
  migrations/

```

---

## 🖼️ Icons (lucide-react)

Install (if not already present):

```bash
npm i lucide-react
```

Usage example:

```jsx
import { Camera } from 'lucide-react';

export default function IconDemo() {
  return <Camera size={24} />;
}
```

---

## 🗂️ NPM Scripts

`package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "db:reset": "prisma migrate reset --force",
    "prisma:deploy": "prisma migrate deploy",
    "postinstall": "prisma generate"
  }
}
```

Common commands:

```bash
npm run dev
npm run build && npm start
npm run prisma:studio
npm run db:reset    # ⚠️ drops & recreates the DB (use with caution)
```

---

## 🌳 Branching & Release Strategy

- **`main`** — Production branch

  - Protected. Only maintainers merge into `main`.
  - Release tags (e.g., `v1.2.0`) are created here.
  - Migrations applied with `npm run prisma:deploy` on deployment.

- **`preProd`** — User testing (UAT) branch

  - Staging-like environment for stakeholders and user tests.
  - Merges from `dev` after review/QA.
  - Hotfixes may be merged here first if needed, then forward-merged to `main`.

- **`dev`** — Integration branch (default target for PRs)

  - Create feature branches from `dev`:

    - `feature/<short-name>` — new features
    - `fix/<short-name>` — bug fixes
    - `chore/<short-name>` — maintenance & tooling

  - Open **Pull Requests into `dev`**.
  - Require code review before merging.

### Standard flow

1. Branch off `dev` → implement changes → open PR to `dev`.
2. After enough features/fixes, merge `dev` → **`preProd`** for UAT.
3. If validated, merge `preProd` → **`main`** and tag a release.
4. Run DB migrations in production: `npm run prisma:deploy`.

> Keep your branch up to date by rebasing on `dev` (preferred) or merging `dev` regularly.

### Commit & PR hygiene (lightweight)

- Small, focused PRs with a clear description.
- Mention DB changes in the PR description (migrations).
- Update **.env.example** and this **README** when adding/removing env vars.

---

## ☁️ Deployment (notes)

- Configure `DATABASE_URL` in your hosting provider’s environment settings.
- On deploy (production or staging), run:

```bash
npm run prisma:deploy
```

- Ensure the app has network access to the PostgreSQL instance.

---

## 🛠️ Troubleshooting

- **Cannot connect to PostgreSQL**

  - Ensure the service is running and listening on the expected port.
  - Check your `DATABASE_URL` and credentials.

- **`prisma migrate dev` fails**

  - Verify DB permissions.
  - Try `npm run db:reset` (⚠️ destructive) in local dev.

---

## 🤝 Contributing

- Target **`dev`** with your PRs.
- Keep PRs atomic and well-described.
- Document any migration or environment change.

---

## 📄 License

Add your license information here (e.g., MIT).
