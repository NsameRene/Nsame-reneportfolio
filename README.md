# Nsame René Portfolio

| Part | Stack | Hosted on |
|---|---|---|
| `frontend/` | Vite + React 19 + TypeScript + Tailwind 4 | **Vercel** |
| `backend/` | Django 5.2 LTS + Django REST Framework + SimpleJWT | **PythonAnywhere** |
| Database | SQLite (default; works on PythonAnywhere's free plan) · MySQL / PostgreSQL optional on paid plans | PythonAnywhere |

```
 Browser ──► Vercel (React SPA, static)
                │  fetch(VITE_API_URL + "/api/...")   JSON + Bearer JWT
                ▼
            PythonAnywhere (Django + DRF)  ──►  SQLite file (backend/db.sqlite3)
                │  /media/ (uploads)  /static/ (admin assets)
                └► Django Admin at /admin/  (manage all content, read messages)
```

The frontend and backend are fully independent: the only link is the
`VITE_API_URL` build variable (frontend → API) and the `FRONTEND_URL` variable
(API → allowed CORS origin).

The backend replaces the former Express + Drizzle + PostgreSQL (Render) server.
The old code is preserved in git history (`git show pre-django-migration:backend/`).

---

## Repository layout

```
frontend/                 Vite + React app (unchanged design; API config in src/utils/api.ts)
backend/
├── manage.py
├── requirements.txt
├── .env.example          every variable the backend reads
├── pythonanywhere_wsgi.py  template for the PythonAnywhere WSGI file
├── config/
│   ├── settings/         base.py · local.py · production.py · test.py
│   ├── urls.py
│   └── wsgi.py
└── apps/
    ├── core/             permissions, error format, validators, camelCase/media serializers
    ├── accounts/         POST /api/auth/login, /api/auth/check  (JWT)
    ├── content/          Project, Blog, Skill, Experience, Education, Certificate,
    │                     Course, Quote, Testimonial, GalleryItem, WhatIDo, SiteSettings + admin + API
    │                     + commands: import_legacy, seed_demo
    └── contact/          ContactMessage + POST /api/contact + admin inbox
```

### How the Node backend mapped to Django

| Node / Express | Django |
|---|---|
| Drizzle tables (`projects`, `blogs`, `skills`, `experiences`, `education`, `certificates`, `courses`, `quotes`, `gallery`, `what_i_do`, `settings`, `contact_messages`) | Models with the same fields (`content` and `contact` apps), managed by Django migrations |
| `users` table + hard-coded fallback admin | Django `User` (`createsuperuser`), PBKDF2 hashes, staff-only |
| `jsonwebtoken` (1 day, `Bearer`) | SimpleJWT (1 day, `Bearer`) |
| `multer` → `uploads/` | `ImageField` → `MEDIA_ROOT` (`backend/media/`), served at `/media/` |
| `createCrud(...)` routes | DRF `ModelViewSet`s under the *same URLs* (no trailing slash) |
| CORS regex `*.vercel.app` | Explicit allow-list from `FRONTEND_URL` |
| — | Django Admin for all content, read/mark messages, optional email notification |

JSON stays **camelCase** (`imageUrl`, `liveDemoLink`, …), lists stay **plain arrays**
and error bodies stay `{ "error": "..." }`, so the React pages run unchanged.

---

## Local development

Requirements: Python 3.10+ (tested on 3.12) and Node 20+.

```bash
# 1. Backend  (http://127.0.0.1:8000)
cd backend
python -m venv .venv
source .venv/bin/activate            # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                 # local dev works with an empty SECRET_KEY / DATABASE_URL
python manage.py migrate             # creates db.sqlite3
python manage.py seed_demo           # optional: demo content
python manage.py createsuperuser     # your admin login (email is used for the React dashboard)
python manage.py runserver

# 2. Frontend  (http://localhost:5173)
cd frontend
npm install
npm run dev                          # talks to http://127.0.0.1:8000 by default
```

* React admin dashboard: <http://localhost:5173/admin> (log in with the superuser's **email** + password).
* Django Admin: <http://127.0.0.1:8000/admin/> (log in with the superuser's **username** + password).

### Tests

```bash
cd backend
python manage.py test --settings=config.settings.test     # 71 tests
cd ../frontend && npm run build                             # typecheck + production build
```

---

## Migrating your existing data (Render/Postgres → Django)

Row **ids are preserved** (the site links to `/courses/<id>`), and the import is
idempotent (re-running updates rows instead of duplicating them). Users are
*not* imported: their hashes/passwords were weak and you create a fresh admin with
`createsuperuser` instead.

**Option A: straight from the live old API** (needs internet access from where you
run it, e.g. your PC or a paid PythonAnywhere account):

```bash
python manage.py import_legacy --from-api https://nsame-reneportfolio.onrender.com --dry-run   # preview
python manage.py import_legacy --from-api https://nsame-reneportfolio.onrender.com
```

**Option B: JSON files** (works on PythonAnywhere free accounts, which can only reach an
allow-list of sites). On your PC:

```bash
mkdir legacy_export && cd legacy_export
for t in settings projects blogs skills experiences education certificates courses quotes gallery what_i_do; do
  curl -s https://nsame-reneportfolio.onrender.com/api/$t -o $t.json
done
# contact messages are not exposed by the old API; export them from Postgres:
psql "$OLD_DATABASE_URL" -t -A -c "select coalesce(json_agg(t),'[]') from contact_messages t" -o contact_messages.json
```

Upload the folder to PythonAnywhere (Files tab) and run:

```bash
python manage.py import_legacy --from-json ~/legacy_export
```

Caveats printed by the command:

* The old API returned **hard-coded demo projects/blogs when those tables were empty**. If
  your old database really had none, delete the imported demo rows in the admin.
* Images that were uploaded to Render's disk (`/uploads/...`) no longer exist; those
  fields are blanked and reported so you can re-upload them in Django Admin.
* Placeholder links (`#`) are stored as empty strings.

---

## Deploying the backend to PythonAnywhere

Replace `YOUR_USERNAME` everywhere. (EU accounts use `eu.pythonanywhere.com`.)

### 1. Create the web app
Web tab → **Add a new web app** → *your-username.pythonanywhere.com* → **Manual configuration**
(not the Django wizard) → choose the Python version you will use for the virtualenv (3.12 recommended;
3.10+ works).

### 2. Get the code and create a virtualenv
Open a **Bash console**:

```bash
cd ~
git clone https://github.com/NsameRene/Nsame-reneportfolio.git
cd Nsame-reneportfolio && git checkout django-migration    # or main, once merged
mkvirtualenv portfolio-venv --python=/usr/bin/python3.12
pip install -r backend/requirements.txt
```

Web tab → **Virtualenv** → enter `/home/YOUR_USERNAME/.virtualenvs/portfolio-venv`.

### 3. Database
**Nothing to create.** The backend uses SQLite by default: `python manage.py migrate` (step 7) creates
the file `backend/db.sqlite3`. SQLite is the database available on PythonAnywhere's free plan and is plenty for a
one-owner portfolio (reads dominate; the few writes are contact messages and testimonies).
The file is git-ignored, is not under any web-mapped folder, and survives `git pull` and reloads.
**Back it up** (see [Backups](#backups)); it holds all your content and messages.

On a paid plan you can use MySQL/PostgreSQL instead: install the driver (`pip install mysqlclient` or
`pip install "psycopg[binary]"`) and set `DATABASE_URL` in `.env` (examples in `backend/.env.example`).

### 4. Environment variables
```bash
cd ~/Nsame-reneportfolio/backend
cp .env.example .env
python -c "import secrets; print(secrets.token_urlsafe(50))"   # copy the output
nano .env
```

Minimum production `.env`:

```env
DJANGO_SETTINGS_MODULE=config.settings.production
SECRET_KEY=<the generated key>
DEBUG=False
ALLOWED_HOSTS=YOUR_USERNAME.pythonanywhere.com
FRONTEND_URL=https://your-portfolio.vercel.app
```

Production settings **refuse to start** if `SECRET_KEY`, `ALLOWED_HOSTS` or `FRONTEND_URL` is missing.
`DATABASE_URL` is optional (SQLite when absent). The `.env` file is git-ignored; never commit it.

### 5. WSGI file
Web tab → **WSGI configuration file** → replace its contents with
[`backend/pythonanywhere_wsgi.py`](backend/pythonanywhere_wsgi.py) (fix `YOUR_USERNAME`).

### 6. Static and media files
```bash
cd ~/Nsame-reneportfolio/backend
python manage.py collectstatic --noinput      # admin CSS/JS → backend/staticfiles
mkdir -p media
```

Web tab → **Static files**:

| URL | Directory |
|---|---|
| `/static/` | `/home/YOUR_USERNAME/Nsame-reneportfolio/backend/staticfiles` |
| `/media/`  | `/home/YOUR_USERNAME/Nsame-reneportfolio/backend/media` |

(WhiteNoise also serves `/static/` as a fallback, but **`/media/` needs this mapping**.)
Uploads live on PythonAnywhere's disk, not on Vercel; they persist across reloads
and count against your disk quota. Back up `backend/media/` if the images matter.

### 7. Migrate, import data, create the admin
```bash
cd ~/Nsame-reneportfolio/backend
python manage.py migrate
python manage.py import_legacy --from-json ~/legacy_export     # optional, see the data section
# or:  python manage.py seed_demo
python manage.py createsuperuser
```

Because `.env` contains `DJANGO_SETTINGS_MODULE=config.settings.production`, `manage.py` uses
production settings here.

### 8. Force HTTPS and reload
Web tab → **Force HTTPS: Enabled** → green **Reload** button. Then check:

```
https://YOUR_USERNAME.pythonanywhere.com/api/health      → {"status": "ok"}
https://YOUR_USERNAME.pythonanywhere.com/api/projects
https://YOUR_USERNAME.pythonanywhere.com/admin/
```

After every `git pull` or `.env` change: `pip install -r requirements.txt` (if it changed),
`python manage.py migrate`, `python manage.py collectstatic --noinput`, then **Reload**.

Free-plan notes: PythonAnywhere free web apps must be renewed from the Web tab every few
months, and free accounts can only make outbound requests to allow-listed hosts
(relevant for contact-form email; Gmail's SMTP server is normally on the list,
check their current allow-list).

### Troubleshooting

Always read the **error log** first (Web tab → *Error log*).

| Error in the log | Cause and fix |
|---|---|
| `'Settings' object has no attribute 'ROOT_URLCONF'` | The WSGI file points at the wrong settings module (usually `config.settings`, or PythonAnywhere's default `mysite.settings`). It must say `os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings.production"`. Replace the **whole** WSGI file with `backend/pythonanywhere_wsgi.py`, then Reload. |
| `ModuleNotFoundError: No module named 'config'` | `PROJECT_HOME` in the WSGI file is wrong. It must be the folder that contains `manage.py`, e.g. `/home/YOUR_USERNAME/Nsame-reneportfolio/backend`. |
| `ModuleNotFoundError: No module named 'django'` (or `rest_framework`, `dotenv`, …) | The Web tab **Virtualenv** path is not set or points at the wrong folder. It must be the virtualenv you ran `pip install -r requirements.txt` in. |
| `ImproperlyConfigured: SECRET_KEY / ALLOWED_HOSTS / FRONTEND_URL must be set` | `backend/.env` is missing, misspelled, or in the wrong folder. It must be `backend/.env` (next to `manage.py`). |
| `OperationalError: unable to open database file` | The folder holding `db.sqlite3` is not writable, or `DATABASE_URL` points at a wrong path. Remove `DATABASE_URL` from `.env` to use `backend/db.sqlite3`. |
| `OperationalError: database is locked` | Two requests wrote at the same time and one waited more than 20 s. Rare on a portfolio; retry, and check for a long-running console command holding the database. |
| Admin pages have no CSS | Run `python manage.py collectstatic --noinput` and check the `/static/` mapping on the Web tab. |
| Browser console: `blocked by CORS policy` | `FRONTEND_URL` on PythonAnywhere does not exactly match the Vercel URL (scheme included, no trailing slash). Fix it and Reload. |

### Backups

SQLite keeps everything in `backend/db.sqlite3` (content, testimonies, messages, admin users), and uploads live in
`backend/media/`. PythonAnywhere does not back these up for you. Make a copy now and then, and before big changes:

```bash
mkdir -p ~/backups
cd ~/Nsame-reneportfolio/backend
python manage.py dumpdata --natural-foreign -e contenttypes -e auth.permission -e sessions --indent 2 > ~/backups/data-$(date +%F).json
cp db.sqlite3 ~/backups/db-$(date +%F).sqlite3
tar czf ~/backups/media-$(date +%F).tgz media
```

Download the files from the *Files* tab. To restore a JSON dump into a fresh database:
`python manage.py migrate && python manage.py loaddata ~/backups/data-YYYY-MM-DD.json`.
(On Windows run these with `python -X utf8 manage.py …`, otherwise the shell writes the file in the wrong encoding.)
Never run `git clean -x` or delete `db.sqlite3` in the project folder; `git pull` does not touch it.

### 9. Optional: email yourself contact-form messages
Messages are always stored and visible in Django Admin → *Contact messages*. To also get an
email, set `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`
(e.g. a Gmail *app password*), `DEFAULT_FROM_EMAIL` and `CONTACT_NOTIFY_EMAIL`. A mail failure
never loses the message or fails the request.

---

## Deploying the frontend to Vercel

1. Vercel → **Add New… → Project** → import the GitHub repo.
2. **Root Directory:** `frontend` · Framework preset: **Vite** · Build command `npm run build` · Output `dist`
   (`frontend/vercel.json` already rewrites all routes to `index.html` for React Router).
3. **Environment Variables** → `VITE_API_URL` = `https://YOUR_USERNAME.pythonanywhere.com`
   (no trailing slash). Vite bakes this in at build time: **redeploy after changing it**.
4. Deploy, then copy the resulting URL into `FRONTEND_URL` in the PythonAnywhere `.env` and **Reload**
   (otherwise the browser blocks API calls with a CORS error).
   Add a custom domain the same way: `FRONTEND_URL=https://a.vercel.app,https://www.example.com`.
   For Vercel *preview* deployments add
   `CORS_ALLOWED_ORIGIN_REGEXES=^https://your-project-[a-z0-9-]+\.vercel\.app$`.

---

## API reference

Base URL: `VITE_API_URL` (dev: `http://127.0.0.1:8000`). JSON in/out, **no trailing slashes**.
"Auth: Admin" means `Authorization: Bearer <token>` from `/api/auth/login`, belonging to an active
*staff* user; otherwise `401` (missing/invalid token) or `403` (not staff).
Errors: `{ "error": "message" }`, validation errors add `"details": { field: [messages] }`.

### Authentication

| Endpoint | Method | Purpose | Auth | Request body | Response |
|---|---|---|---|---|---|
| `/api/auth/login` | POST | Log in the site owner | – | `{ "email", "password" }` | `200 { "token": "<jwt>", "user": { "email", "role": "admin" } }` · `401 { "error": "Invalid credentials" }` · `429` after 10 attempts/min |
| `/api/auth/check` | POST | Validate a stored token | Admin | – | `200 { "user": { "email", "role" } }` |

### Public content (read)

All of these are `GET`, need no auth, and return a **JSON array** (`/api/settings` returns one object).
Optional `?…` filters do not exist; the frontend filters client-side.

| Endpoint | Item fields |
|---|---|
| `/api/projects` | `id, title, description, technologies, imageUrl, githubLink, liveDemoLink, category, featured, createdAt` |
| `/api/blogs` (newest first) | `id, title, slug, content, coverImage, category, tags, publishedAt, readingTime` |
| `/api/blogs/<slug or id>` | one blog post (new; used by the article page) → `404 { "error": "Not found." }` |
| `/api/skills` | `id, name, category, proficiency` (0–100) |
| `/api/experiences` | `id, company, role, startDate, endDate, description` |
| `/api/education` | `id, institution, degree, startDate, endDate, description` |
| `/api/certificates` | `id, name, issuer, date, link` |
| `/api/courses` | `id, title, description, imageUrl, link` |
| `/api/quotes` | `id, text, author` |
| `/api/gallery` | `id, title, imageUrl, createdAt` |
| `/api/what_i_do` | `id, title, icon, items` (comma-separated) |
| `/api/testimonials` | approved visitor testimonies only, see [Visitor testimonies](#visitor-testimonies-owner-approval-required) |
| `/api/settings` | `id, name, email, bio, profileImageUrl, phone, location, website` |
| `/api/health` | `{ "status": "ok" }` |

`imageUrl` / `coverImage` / `profileImageUrl` is the absolute URL of the uploaded file if there is one,
otherwise the external URL you entered.

### Admin writes

| Endpoint | Method | Purpose | Auth | Request body | Response |
|---|---|---|---|---|---|
| `/api/<resource>` | POST | Create | Admin | fields above (writable ones), as `multipart/form-data` **or** JSON; images: file field `image` (or `imageUrl` / `coverImage` text) | `201` the created object · `400` validation |
| `/api/<resource>/<id>` | PUT (also PATCH) | Update, **partial**: omitted fields are kept | Admin | same | `200` the updated object |
| `/api/<resource>/<id>` | DELETE | Delete | Admin | – | `200 { "success": true }` |
| `/api/settings` | PUT | Update profile settings | Admin | any of `name, email, bio, phone, location, website, profileImageUrl`, or file `profileImage` | `200 { "success": true }` |

`<resource>` ∈ `projects, blogs, skills, experiences, education, certificates, courses, quotes, gallery, what_i_do`.
Uploads: jpg/jpeg/png/gif/webp only (SVG rejected), verified with Pillow, max 5 MB (`MAX_UPLOAD_SIZE_MB`).
Links must be `http(s)://…`, a `/relative/path` or `#`.

### Visitor testimonies (owner approval required)

A testimony submitted from the home page is stored as **pending** and is invisible to the public until
you approve it, either in the React dashboard (**Testimonials** tab: *Approve* / *Unpublish* / *Delete*,
with a pending counter) or in Django Admin → *Testimonials* (tick **approved**, or use the bulk actions).
If `CONTACT_NOTIFY_EMAIL` is set you also get an email for each new submission.

| Endpoint | Method | Purpose | Auth | Request body | Response |
|---|---|---|---|---|---|
| `/api/testimonials` | GET | List testimonies | – (approved only) · Admin (all, pending first) | – | `[ { id, name, role, text, isApproved, createdAt } ]` |
| `/api/testimonials` | POST | Submit a testimony | – | `{ "name" (≤120), "role"? (≤120, default "Client"), "text" (10–1500 chars) }` | `201 { "success": true, "status": "pending" }` · `400` validation · `429` after 10/hour per IP. `isApproved` in the body is ignored. |
| `/api/testimonials/<id>` | PATCH / PUT | Approve, unpublish or edit | Admin | `{ "isApproved": true }` | `200` the updated object |
| `/api/testimonials/<id>` | DELETE | Delete | Admin | – | `200 { "success": true }` |

`/testimonials` ("See All") lists approved testimonies followed by the dashboard **Quotes**.

### Contact form

| Endpoint | Method | Purpose | Auth | Request body | Response |
|---|---|---|---|---|---|
| `/api/contact` | POST | Store a message (and email it if configured) | – | `{ "name", "email", "message", "projectType"?, "budget"?, "subject"? }` (`message` ≤ 5000 chars) | `200 { "success": true }` · `400` validation · `429` after 10/hour per IP |

---

## Security notes

* `SECRET_KEY`, DB credentials, email credentials come only from the environment (`backend/.env`, git-ignored).
* Production: `DEBUG` off by default, `ALLOWED_HOSTS` required, HTTPS redirect + `SECURE_PROXY_SSL_HEADER`,
  secure/HttpOnly/SameSite cookies, HSTS (1 year), `X-Frame-Options: DENY`, `nosniff`, referrer policy.
* CORS: exact origins from `FRONTEND_URL` (+ optional regexes), `/api/` only, never `*`; localhost origins are
  added only by `config.settings.local`. Auth is a Bearer token in a header, so there are no cookies to protect
  with CSRF on the API; Django Admin keeps normal CSRF (set `CSRF_TRUSTED_ORIGINS` for a custom admin domain).
* Login and contact endpoints are rate-limited; login timing does not reveal which emails exist.
* Improvements over the Node version: no default admin password or default JWT secret; only *staff* users
  are admins; create/update no longer copy arbitrary request keys into the table; unknown/invalid input returns `400` instead of `500`.
* Tip: set `ADMIN_URL=some-secret-path/` to move the Django admin off `/admin/`.

## Known differences from the Node API

* Empty `projects`/`blogs` tables return `[]` (Node injected hard-coded demo rows). Use `python manage.py seed_demo`.
* Create returns `201` (Node `200`); `PUT` is a partial update, which also fixes the admin panel
  resetting `featured`/`readingTime` on every edit.
* Testimonies: the old "Add Testimony" button only added a card in the visitor's own browser tab (lost on
  refresh, never saved). It now posts to the API and waits for your approval; the three Lorem Ipsum demo
  testimonies were removed.
* Home "Quotes & Principles" shows the dashboard Quotes (built-in quotes only while you have none).
* Contact form: the frontend sends no `subject`; Node required one and failed with `500`. Django
  generates one and also stores `projectType` and `budget`.
* Frontend changes (only what the migration required): `src/utils/api.ts` (env-driven URL, no hard-coded
  host), `src/pages/Article.tsx` (loads posts from `/api/blogs/<slug>`; it used to show only hard-coded articles),
  `src/pages/Admin.tsx` (shows server errors on save instead of failing silently).
* Not wired to any backend in the original either: the React admin's *Settings* and *Messages* tabs. Use Django Admin
  (*Site settings*, *Contact messages*) for those.
