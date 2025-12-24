# Digital Signage

A full-stack digital signage system with:
- Admin dashboard to upload media, manage library, create playlists, and monitor players
- Player page that fetches the active playlist and plays content in a loop
- Heartbeat tracking for online/offline player status

## Tech Stack
- Server: Node.js, Express, MongoDB (Mongoose), Multer, JWT
- Client: React (Vite), Tailwind (via CDN), GSAP for UI animations

## Project Structure

```
screen/
├─ server/
│  ├─ index.js
│  ├─ .env
│  ├─ public/player.html
│  ├─ uploads/                # stored media files
│  └─ src/
│     ├─ app.js               # express app setup
│     ├─ config/db.js         # mongo connection
│     ├─ controllers/         # route handlers
│     ├─ middleware/          # auth & upload
│     ├─ routes/              # express routers
│     ├─ state/heartbeats.js  # in-memory heartbeat map
│     └─ utils/               # bootstrapping & scheduler
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
  - `/player` serves `public/player.html`

### Auth
- `POST /api/auth/login` issues JWT (server/src/controllers/auth.controller.js)
- `server/src/middleware/auth.js` validates `Authorization: Bearer <token>`
- `server/src/middleware/roles.js` exports `requireAdmin` for admin-only endpoints

### Content
- `GET /api/content` (auth required): list all content
- `POST /api/content/upload` (auth required): multipart upload via Multer
  - Saves file to `uploads/`
  - Creates `Content` record with `publicUrl`, `storedFilename`, `mimeType`, `fileSize`, optional `expiryAt`

### Player API
- `GET /api/player`: returns active playlist, enriched with `publicUrl/mimeType/expiryAt` and filters expired
- `POST /api/player/playlist` (auth required): set a new active playlist
- `GET /api/player/statuses` (auth required): list heartbeats
- `POST /api/player/ping`: player heartbeat (no auth)

### Heartbeats
- In-memory map keyed by `playerId` or `req.ip` (server/src/controllers/heartbeat.controller.js)

### Models
- `Content`: originalFilename, storedFilename, publicUrl, mimeType, fileSize, uploader, expiryAt, isExpired, expiredAt, fileRemoved
- `Playlist`: name, isActive, playlist: [{ contentId, type: 'video'|'image', durationSec? }]
- `User`: name, email, passwordHash, role ('user'|'admin')

### Utilities
- `bootstrapAdmin`: seed/update admin credentials on startup (server/src/utils/bootstrapAdmin.js)
- `expiryScheduler`: periodic cleanup of expired content (server/src/utils/expiryScheduler.js)

### Player Page
- Served at `/player` (`player.controller.servePlayer`)
- Fetches `GET /api/player`, plays entries in loop
- Heartbeats: `POST /api/player/ping` every 10s
- Auto-reload playlist every 15s
- URL options:
  - `?api=http://host:port` override API base (useful for `file://` opening)
  - `?refresh=SECONDS` auto page reload interval

## Client

### Auth
- `AuthContext` stores JWT and user in localStorage; provides `login/logout`
- Redirect logic in `App.jsx`:
  - Unauthenticated → `/login`
  - Authenticated → protected routes under `/`

### Pages
- `Login`: animated login form (GSAP)
- `Upload`: drag & drop upload with optional expiry (now factored into `UploadForm` component)
- `Library`: display active vs expired items
- `Playlist`: build playlist from library, set durations for images
- `Player Status`: heartbeat view of online/offline players
- `NotFound`: 404 page for unknown routes

### Components
- `Navbar`: responsive navigation and Add User trigger
- `AddUserModal`: admin-only modal with GSAP open/close animations
- `UploadForm`: drag & drop area, preview, and submit with status
- `ContentList`: card grid grouped by expiry status
- `PlaylistEditor`: add/remove items and save playlist
- `PlayerStatusList`: poll statuses and compute derived online state

### API Helper (`client/src/api.js`)
- `login(email, password)`
- `listContent()`
- `uploadContent(file, expiryAt?)`
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
5. Open client (default `http://localhost:5174/`), login with admin credentials, upload content, build playlist, and view statuses.
6. Player page:
   - `http://localhost:5000/player`
   - For `file://` usage: `file:///path/to/player.html?api=http://<host>:5000`

## Notes
- Static files served from `/uploads`
- Player page supports absolute `publicUrl` and local stored filenames
- CORS `CLIENT_ORIGIN` must match client dev URL
