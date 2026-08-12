# MATRIXZ

Full-stack website and admin platform for the MATRIXZ technical club — a public site (Home, About, Teams,
Achievements, Events, Gallery, Contact) plus a secure admin portal for managing all of it.

Event registration is handled entirely through **Google Forms**. There is no membership/join system and no
custom registration database — the admin attaches a Google Form URL to an event, and the public "Register Now"
button opens that form in a new tab.

## 1. Features

**Public site**
- Home, About, Teams, Achievements, Events (upcoming/past), Event details, Gallery, Contact
- All content (teams, members, achievements, events, gallery) is loaded live from the API — nothing is hardcoded
- Event registration via an admin-configured Google Form link (opens in a new tab); the button is hidden
  automatically once the deadline passes, registration is disabled, or the event isn't open yet
- Responsive, accessible (keyboard navigation, focus states, `prefers-reduced-motion` support), animated with
  Framer Motion

**Admin portal** (`/admin/login` → `/admin/dashboard`)
- JWT-authenticated, bcrypt-hashed passwords, protected routes
- Dashboard with live stats and quick actions
- Full CRUD: Events (with banner upload + Google Form URL + duplicate), Teams & Team Members (with profile
  photos), Achievements, Gallery (bulk upload with categories), Contact Messages (read/unread, delete)
- Cloudinary-backed image storage — no images are stored in MongoDB or on local disk

## 2. Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router, React Hook Form + Zod,
Axios, Lucide React

**Backend:** Node.js, Express, TypeScript, MongoDB + Mongoose, JWT, bcryptjs, Multer (streamed to Cloudinary),
Cloudinary, Zod, Helmet, CORS, express-rate-limit

## 3. Folder Structure

```
MATRIXZ/
├── frontend/    React + Vite + TypeScript public site & admin UI
└── backend/     Express + TypeScript REST API
```

See `frontend/` and `backend/` for their internal structure (components/pages/services on the frontend;
models/controllers/routes on the backend).

## 4. Prerequisites

- Node.js 18+
- A MongoDB database (local or Atlas)
- A free [Cloudinary](https://cloudinary.com) account (for image uploads)

## 5. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MongoDB URI, JWT secret, and Cloudinary credentials
npm run dev
```

The API runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

**Create your first admin account:**

```bash
npx ts-node scripts/seedAdmin.ts admin@matrixz.club "Admin Name" "StrongPassword123"
```

This creates a `superadmin` account (or updates the password if the email already exists). Admin accounts are
intentionally managed from this script rather than a public signup form.

## 6. Frontend Setup

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev
```

The site runs on `http://localhost:5173`. Log in to the admin portal at `/admin/login` with the account you
seeded above.

## 7. Environment Variables

**backend/.env**

| Variable | Description |
|---|---|
| `PORT` | API port (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend origin, used for CORS |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random secret for signing admin JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `AUTH_RATE_LIMIT_MAX` | Max login attempts per 15 min window |
| `FORM_RATE_LIMIT_MAX` | Max contact-form submissions per 15 min window |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials |

**frontend/.env**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

Never commit either `.env` file — both are already covered by `.gitignore`.

## 8. API Overview

```
POST   /api/auth/login
GET    /api/auth/me

GET    /api/events?type=upcoming|past
GET    /api/events/:id            (id or slug)
GET    /api/events/admin/all
POST   /api/events                (admin, multipart: banner)
PUT    /api/events/:id            (admin, multipart: banner)
POST   /api/events/:id/duplicate  (admin)
DELETE /api/events/:id            (admin)

GET    /api/teams
GET    /api/teams/admin/all
POST   /api/teams | PUT /api/teams/:id | DELETE /api/teams/:id

GET    /api/team-members?team=<id>
GET    /api/team-members/admin/all
POST   /api/team-members          (admin, multipart: profileImage)
PUT    /api/team-members/:id      (admin, multipart: profileImage)
DELETE /api/team-members/:id

GET    /api/achievements?category=<c>
GET    /api/achievements/admin/all
POST   /api/achievements | PUT /api/achievements/:id | DELETE /api/achievements/:id

GET    /api/gallery?category=<c>
GET    /api/gallery/admin/all
POST   /api/gallery               (admin, multipart: images[])
PUT    /api/gallery/reorder | PUT /api/gallery/:id | DELETE /api/gallery/:id

POST   /api/contact                (public, rate-limited)
GET    /api/contact | PUT /api/contact/:id/read | DELETE /api/contact/:id

GET    /api/admin/dashboard
```

Every mutating route other than `POST /api/contact` and `POST /api/auth/login` requires a
`Authorization: Bearer <token>` header from a logged-in admin.

## 9. Event Registration Flow

1. **Admin:** create/edit an event → paste the event's Google Form URL into "Google Form Registration URL" →
   check "Show Register Now button" → save.
2. **Student:** Events page → open an event → click **Register Now** → the Google Form opens in a new tab and
   handles the actual registration, duplicate prevention, and response collection.

There is no `EventRegistration` model or registration API in this project — the Google Form is the system of
record for registrations.

## 10. Building for Production

```bash
# backend
cd backend && npm run build && npm start

# frontend
cd frontend && npm run build   # outputs to frontend/dist, deploy as a static site
```

Set `VITE_API_URL` to your deployed API URL before building the frontend, and `CLIENT_URL` on the backend to
your deployed frontend origin (for CORS).

## 11. Deployment Notes

- Backend: any Node host (Render, Railway, a VPS). Point `MONGODB_URI` at Atlas or your own instance.
- Frontend: any static host (Vercel, Netlify, Cloudflare Pages) serving `frontend/dist`.
- Images: served directly from Cloudinary's CDN — no server-side static file serving is required.
