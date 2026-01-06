# Digital Signage

A full-stack digital signage system:
- Admin dashboard to manage media, build playlists, and monitor players
- Player page that fetches the active playlist and plays content in a loop
- Heartbeat tracking for online/offline player status

## Tech Stack
- Server: Node.js, Express, MongoDB (Mongoose), JWT
- Client: React (Vite), Tailwind (via CDN), GSAP for UI animations

## Project Structure

```
screen/
├─ server/
│  ├─ index.js
│  ├─ .env
│  ├─ public/player.html
│  ├─ uploads/                # optional legacy local files (still served)
│  └─ src/
│     ├─ app.js               # express app setup
│     ├─ config/db.js         # mongo connection
│     ├─ controllers/         # route handlers
│     ├─ middleware/          # auth
│     ├─ routes/              # express routers
│     ├─ state/heartbeats.js  # in-memory heartbeat map
│     └─ utils/               # bootstrapping, scheduler, cache
├─ client/
│  ├─ .env
│  ├─ src/
│  │  ├─ App.jsx              # routes
│  │  ├─ api.js               # API helpers
│  │  ├─ context/AuthContext.jsx
│  │  ├─ layouts/ProtectedLayout.jsx
│  │  ├─ components/          # UI components
│  │  └─ pages/               # route pages
│  └─ index.html
```

## Server

### App Setup
- CORS, JSON parsing, logging, static `/uploads` (server/src/app.js)
- Routers:
  - `/api/auth` (server/src/routes/auth.routes.js)
  - `/api/content` (server/src/routes/content.routes.js)
  - `/api/player` (server/src/routes/player.api.routes.js)
  - `/api/time` returns server UTC time
  - `/player` serves `public/player.html`

### Auth
- `POST /api/auth/login` issues JWT (server/src/controllers/auth.controller.js)
- `server/src/middleware/auth.js` validates `Authorization: Bearer <token>`
- `server/src/middleware/roles.js` exports `requireAdmin` for admin-only endpoints

### Content
- `GET /api/content` (auth required): list all content (short TTL cached)
- `POST /api/content/upload` (auth required): URL-based upload
  - Body: `{ publicUrl, expiryAt?, name?, mimeType? }`
  - Stores `Content` with `publicUrl`, infers `mimeType` if missing; `expiryAt` handled in UTC
  - Legacy local files under `/uploads` are still served if present

### Player API
- `GET /api/player`: returns active playlist, enriched with URLs and filtered by expiry (short TTL cached)
- `POST /api/player/playlist` (auth required): set a new active playlist
- `GET /api/player/statuses` (auth required): heartbeats
- `POST /api/player/ping`: player heartbeat (no auth)

### Heartbeats
- In-memory map keyed by `playerId` or `req.ip` (server/src/controllers/heartbeat.controller.js)

### Models
- `Content`: originalFilename, storedFilename?, publicUrl, mimeType?, fileSize?, uploader, expiryAt, isExpired, expiredAt, fileRemoved
- `Playlist`: name, isActive, playlist: [{ contentId, type: 'video'|'image', durationSec? }]
- `User`: name, email, passwordHash, role ('user'|'admin')

### Utilities
- `bootstrapAdmin`: seed/update admin credentials on startup (server/src/utils/bootstrapAdmin.js)
- `expiryScheduler`: periodic cleanup of expired content (server/src/utils/expiryScheduler.js)
- `cache`: simple short TTL cache for list endpoints (server/src/utils/cache.js)

### Player Page
- Served at `/player` (`player.controller.servePlayer`)
- Dual-video crossfade transitions for smooth video-to-video playback
- Resume playback across reloads using localStorage (video currentTime / image remaining)
- Heartbeats: `POST /api/player/ping` every 10s
- Auto-reload playlist every 15s (only restarts loop if playlist signature changes)
- Programmatic refresh available via `window.refreshPage()` (no visible button)
- URL options:
  - `?api=http://host:port` override API base (useful for `file://` opening)

## Client

### Auth
- `AuthContext` stores JWT and user in localStorage; provides `login/logout`
- Loading gate: navbar actions render after auth state resolves
- Session auto-logout scheduled using server-synced time

### Pages
- `Login`: animated login form (GSAP)
- `Upload`: URL-based upload with optional expiry
- `Library`: Active vs Expired view, IST timezone display, fast render with skeleton and incremental loading
- `Playlist`: build playlist from library, set durations for images; skeleton while loading
- `Player Status`: heartbeat view; skeleton on first load; IST display for last seen
- `NotFound`: 404 page

### Components
- `Navbar`: responsive navigation and Add User trigger; gated by auth loading
- `AddUserModal`: admin-only
- `UploadForm`: media URL input + expiry in UTC
- `ContentList`: grouped by expiry, local cache, stable ordering on refresh, skeleton
- `PlaylistEditor`: add/remove items and save playlist; skeleton while loading
- `PlayerStatusList`: polling + skeleton + IST display

### API Helper (`client/src/api.js`)
- `login(email, password)`
- `listContent()`
- `uploadContent(publicUrl, expiryAt?, name?, mimeType?)`
- `savePlaylist(playlist)`
- `getPlaylist()`
- `listPlayers()`
- Uses `VITE_API_BASE_URL` from client `.env`

## Environment Variables

### Server `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/screen
JWT_SECRET=<set-your-secret>
ADMIN_EMAIL=<admin@example.com>
ADMIN_PASSWORD=<password>
CLIENT_ORIGIN=http://localhost:5174
TZ=Asia/Kolkata              # optional; server defaults to Asia/Kolkata if undefined
```

### Client `.env`
```
VITE_API_BASE_URL=http://localhost:5000
```

## Scripts

### Server
- `npm run dev` (nodemon)
- `npm start`

### Client
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Getting Started

1. Clone and install:
   - `cd server && npm install`
   - `cd client && npm install`
2. Configure `.env` files (see above)
3. Start server:
   - `cd server && npm run dev`
4. Start client:
   - `cd client && npm run dev`
5. Open client (`http://localhost:5174/`), login, add media URLs, build playlist, and view statuses.
6. Player page:
   - `http://localhost:5000/player`
   - For `file://` usage: `file:///path/to/player.html?api=http://<host>:5000`

## Notes
- Time handling:
  - Backend stores and compares expiry in UTC
  - Frontend displays in IST (Asia/Kolkata)
- Caching:
  - Short TTL caching on list endpoints and client-side local cache for fast refresh
- Transitions:
  - Dual-video crossfade for professional LED/digital signage playback
- Refresh:
  - No visible refresh button; use `window.refreshPage()` if needed
