## BSU Information Science Research Platform

Arabic-first (RTL) research metadata library for the Information Science Department, Faculty of Arts, Beni-Suef University.

### Features
- **Homepage**: modern hero, university blue/gold theme, RTL-first.
- **Research library**: cards, pagination, loading skeletons, error states.
- **Smart search (AI-ready)**: semantic search via embeddings (OpenAI) with safe keyword fallback.
- **Admin panel**: add/edit/delete research, admin-only authentication.
- **Dark/Light mode**: toggle + system preference support.

### Project structure
- `frontend/`: React + Tailwind UI (Vite-based structure).
- `backend/`: Node.js + Express REST API + MongoDB.

### Prerequisites
- **Node.js 20+** (recommended) + npm
- **MongoDB** (local or Atlas)

### Setup (local)
1. Install Node.js from the official site, then verify:

```bash
node -v
npm -v
```

2. Create environment files:
- `backend/.env` (copy from `backend/.env.example`)
- `frontend/.env` (copy from `frontend/.env.example`)

3. Install dependencies:

```bash
cd backend && npm install
cd ..\frontend && npm install
```

4. Run dev servers (two terminals):

```bash
cd backend && npm run dev
```

```bash
cd frontend && npm run dev
```

### Logo
Put the official Beni-Suef University logo file at:
- `frontend/src/assets/bsu-logo.png`

If you already have it in another format, update the import in `frontend/src/components/Logo.tsx`.

