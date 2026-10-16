# Sopheaktra Chin — Portfolio Website

A full-stack, database-driven personal portfolio website built with React, TypeScript, and Supabase, showcasing projects, skills, and experience with a secure admin panel for content management.

**Live Site:** [https://d2oyyrwdn0o71o.cloudfront.net](https://d2oyyrwdn0o71o.cloudfront.net)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend / Database | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| Contact Form | Web3Forms API |
| Hosting | AWS S3 (static hosting) + AWS CloudFront (CDN) |

> **Note:** The original assignment spec called for a Node/Express/MongoDB stack. During development, MongoDB caused repeated data/file integrity issues locally, so the backend was migrated to Supabase (managed PostgreSQL with REST API, Auth, and Realtime) to ensure a stable, working submission. The overall architecture — a REST-style API layer between the frontend and a hosted database with full CRUD support — is preserved.

> **A note to Ms. Cindy:** I'm sorry that I wasn't able to switch the backend back to MongoDB as required. By the time I identified the issues I was running into, I didn't yet have enough hands-on experience with MongoDB to confidently fix them without risking breaking the working parts of the project close to the deadline. I chose to keep the site stable and fully functional on Supabase rather than risk submitting something broken. I understand if this affects my grade, and I'm happy to explain the technical decisions in more detail or revisit the MongoDB implementation as a follow-up if that's helpful.

---

## Features

- **Dynamic Hero stats** — Projects Completed and Technologies counts are computed live from the database and update instantly (no refresh) via Supabase Realtime subscriptions.
- **Full CRUD admin panel** — add, edit, and delete Projects (with multi-image upload and a lightbox gallery) and Skills.
- **Secure authentication** — Supabase Auth gates all write access; Row Level Security (RLS) policies restrict writes to authenticated admins while keeping read access public.
- **Contact form** — submissions are saved to the database and emailed via Web3Forms.
- **Fully responsive** — works across desktop, tablet, and mobile.

---

## Project Structure

```
portfolio_project/
├── src/
│   ├── components/
│   │   ├── sections/       # Hero, About, Skills, Projects, Experience, Contact
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── AdminLoginModal.tsx
│   ├── contexts/            # AdminContext (auth state)
│   ├── hooks/                # useData.ts (Supabase data hooks)
│   ├── lib/                  # supabase.ts (client + API helpers)
│   ├── App.tsx
│   └── main.tsx
├── public/                   # static assets (resume, images)
├── supabase/
│   └── migrations/           # SQL schema migrations
├── index.html
├── package.json
└── vite.config.ts
```

---

## Getting Started Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- A Supabase project (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/PHeaktraaa/sopheaktrachin_portfolio.git
cd sopheaktrachin_portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the project root with:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```
> These values come from your own Supabase project settings and Web3Forms dashboard. Never commit this file — it's already listed in `.gitignore`.

### 4. Set up the database
Run the SQL migration in `supabase/migrations/` against your Supabase project (via the Supabase SQL Editor) to create the required tables (`projects`, `skills`, `experience`, `contact_messages`) and RLS policies.

### 5. Run the dev server
```bash
npm run dev
```
Visit `http://localhost:5173`.

### 6. Build for production
```bash
npm run build
```
Output is generated in the `dist/` folder, ready to deploy to static hosting (e.g. AWS S3 + CloudFront).

---

## Deployment

The production build is hosted on **AWS S3** (static file storage) and served through **AWS CloudFront** as a CDN, with:
- Default root object set to `index.html`
- Origin path pointed at the `dist` build output folder
- Custom error responses (403/404 → `index.html`, 200) to support single-page app routing

---

## Security

- No API keys, passwords, or credentials are committed to this repository — all secrets are loaded via environment variables (`.env`, gitignored, template provided in `.env.example`).
- Row Level Security (RLS) policies on all Supabase tables ensure strict separation of permissions:
  - **Portfolio Content (`projects`, `skills`, `experience`)**: Public read access (`SELECT`) for all visitors; write operations (`INSERT`, `UPDATE`, `DELETE`) are strictly restricted `TO authenticated` admin users.
  - **Contact Messages (`contact_messages`)**: Public visitors (`anon, authenticated`) can submit messages via `INSERT`, while reading (`SELECT`), modifying read status (`UPDATE`), and deleting (`DELETE`) are strictly restricted `TO authenticated` users.
  - **Storage (`project-images` bucket)**: Public read access for displaying uploaded images; uploads, modifications, and deletions are strictly restricted `TO authenticated` users.

---

## Author

**Sopheaktra Chin**
Student ID: sc6025010073
Web Development Final Assessment