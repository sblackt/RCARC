# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Site overview

Static HTML/CSS/vanilla-JS front end with a thin PHP/MySQL backend. No build step, no framework, no
`package.json` — files are served as-is by `.cpanel.yml`'s deploy copy. Live at rcarc.ca (Renfrew County
Amateur Radio Club) on shared cPanel hosting.

## Pages

- `index.html` — homepage: welcome, upcoming-events preview, nets, "what is amateur radio", membership modal
- `events.html` — full events calendar (`event-calendar.js`) with detail popups (`events-details.js`)
- `gallery.html` — categorized photo gallery, backed by `gallery-api.php`
- `admin.html` — admin panel, Events tab + Photos tab, gated by a client-side password prompt
- `about.html`, `history.html` — club info and history
- `get-started.html`, `get-licensed.html` — onboarding content for new hams
- `morse.html` — interactive Morse code trainer
- `netinfo.html` — net schedule/info
- `contact.html` — contact info
- `404.html` — custom error page, wired up via `.htaccess` (`ErrorDocument 404 /404.html`)
- `archive/` — old pre-redesign site pages/assets kept for historical reference; not linked from current nav

The "JOIN THE CLUB!" membership modal (`#membershipForm`) is duplicated across most pages rather than
shared via a template (there's no templating system to share it with).

## Backend / API

- `api.php` — events CRUD (GET/POST/PUT/DELETE on the `events` table). **No authentication on any
  method** — anyone who knows the URL can create, edit, or delete events. This is a step beyond the
  documented "accepted debt" below: `gallery-api.php` at least checks an admin secret on writes,
  `api.php` checks nothing.
- `gallery-api.php` — photo/category CRUD against `photos`/`photo_categories`. POST/PUT/DELETE require
  an `X-Admin-Secret` header (or `admin_secret` POST field), checked with `hash_equals` against a
  hardcoded secret. Also validates file type/size on upload and blocks PHP execution inside
  `img/gallery/` via that directory's own `.htaccess`.
- `youtube-api.php` — server-side proxy to the YouTube Data API v3, keeps the API key out of client JS
  (GET only).
- `youtube-rss.php` — parses the club's YouTube channel RSS feed as an alternate/fallback data source.

## Database (`rcarc_event_manager`)

- `events` — type (`breakfast`/`meeting`/`techie`/`special`), name, date, time, location, topic,
  details, presenter, link
- `photo_categories` — id, slug, label, description
- `photos` — id, filename (randomly generated on upload, not the original name), original_filename,
  category_id, caption

## Membership form data flow

The membership modal collects **name, email, callsign, phone, address, and interests** and POSTs
directly from `jointheclub.js` to an external Google Apps Script web-app URL (hardcoded in that file) —
it never touches this repo's DB or PHP backend. That Apps Script and its destination Google Sheet live
outside this repo and aren't auditable from here; if asked about the security of member application
data, say so rather than guessing.

## Legacy / dead files

Not worth cleaning up unprompted, but don't be confused by them:

- `gallery-config.json` — pre-database gallery config, superseded 2026-08-12 when the gallery moved to
  DB-backed storage. No longer referenced by any JS or HTML.
- `insert` — one-time SQL seed for initial breakfast/meeting event rows, already run against production.
- `SECURITY_SETUP.md` — describes a server-side-hashed admin password via `auth.php` and a "secure"
  posture that was **never actually implemented**. `auth.php` does not exist in this repo. The real
  current state is what's documented below: a hardcoded plaintext password checked client-side in
  `admin.html`. Treat that file as aspirational, not a description of current behavior.

## Auto-deploy — work on a branch, not directly on main

**`main` auto-deploys to the live site (rcarc.ca) within minutes of every push.** A cron job on the
cPanel server (`/home/rcarc/deploy-poller.sh`, runs every 5 minutes) polls GitHub for new commits on
`main` and automatically pulls + deploys them — there is no manual approval step and no PR requirement
enforced by GitHub.

Because of this:

- **Do not commit or push directly to `main`** for anything beyond trivial, already-verified fixes.
  Create a feature branch, make changes there, and only merge to `main` when the change is actually
  ready to go live.
- Treat a merge to `main` as equivalent to hitting "deploy to production" — because it is.
- If a mistake lands on `main`, the fastest fix is a revert commit pushed to `main` (the poller will
  pick it up on its next tick, within 5 minutes) — don't try to intervene on the cPanel server directly
  unless asked.

## Deploy mechanism details

- Poller script: `/home/rcarc/deploy-poller.sh` on the server (not in this repo). Compares GitHub's
  latest `main` commit SHA against `/home/rcarc/deploy-poller.last-sha`; if changed, calls cPanel's
  `VersionControl::update` (pull) then `VersionControlDeployment::create` (runs `.cpanel.yml`), and
  only advances the state file after confirming the deploy actually succeeded.
- `.cpanel.yml` in this repo controls what happens on deploy: wipes `public_html` except `img/gallery/`
  (admin-uploaded photos), then copies the repo in. No `rsync` available in the deploy shell — stick to
  `find`/`cp`/`mkdir`.
- A GitHub Actions-based deploy was tried first and abandoned — the host's WAF serves an anti-bot JS
  challenge to GitHub-hosted runner IPs instead of JSON, so calling cPanel's API from GitHub's cloud
  runners doesn't work reliably. The cron poller runs *on* the cPanel server instead, avoiding that
  cross-network hop entirely.
- Deploys are not safe to run concurrently — two overlapping deploys once collided writing `.git`
  internals into `public_html` and both failed. The poller's `flock` lock prevents this by serializing
  runs; don't add a second deploy trigger without the same protection.

## Known accepted security debt

(User-approved trade-offs for this club site — don't re-raise unless something material changes, e.g.
the site starts handling payments.)

- DB password (`api.php`, `gallery-api.php`) and the YouTube API key (`youtube-api.php`) are hardcoded
  in plaintext in this public repo.
- Admin login (`admin.html`) is a hardcoded plaintext JS constant, checked client-side only.
- `api.php`'s write methods have no auth check at all (see Backend/API above) — anyone can create,
  edit, or delete events.
- The "Join the Club" membership form collects real PII (name, email, phone, address) and submits it
  directly to an external Google Apps Script endpoint — outside this repo, not covered by anything here.
