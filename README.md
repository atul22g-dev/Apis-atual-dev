# Atual APIs Dashboard

A comprehensive **API Dashboard** built with **Next.js 14** (App Router), **TypeScript**, and **Tailwind CSS** — serving collections of projects, movies, products, wallpapers, and more through a unified interface with full authentication, live search, and interactive UI components.

🌐 **Live Demo:** [atualapis.pages.dev](https://atualapis.pages.dev)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Authentication System](#-authentication-system)
  - [Dashboard Login (Password)](#dashboard-login-password)
  - [API Authentication (API Key / Bearer Token)](#api-authentication-api-key--bearer-token)
- [API Endpoints](#-api-endpoints)
- [Categories](#-categories)
- [Components & Pages](#-components--pages)
- [Data Architecture](#-data-architecture)
- [CORS Configuration](#-cors-configuration)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🧭 Overview

**Atual APIs Dashboard** is a full-stack application that serves as a central hub for curated collections of web development projects, movies, tech products, wallpapers, and development resources. It provides both:

- **A beautiful dashboard UI** — Browse, search, and explore all data through an interactive dark-themed interface
- **RESTful JSON APIs** — Consume the same data programmatically with authentication support

The project exports static JSON data through dynamic API routes, making it ideal for developers who need structured data for demos, testing, or personal collections.

---

## ✨ Features

### 🔐 Dual Authentication
- **Dashboard login** — Password-protected access with session cookies (7-day expiry)
- **API authentication** — API key via `X-API-Key` header, `api_key` query param, or Bearer token

### 🗂️ 13+ Category Views
- Browse projects, movies, products, wallpapers, CDNs, npm packages, MongoDB projects, and more

### 🔍 Real-time Live Search
- Instant client-side filtering across all categories — no page reloads needed

### 🎨 Rich Interactive UI
- **Dark theme** with animated gradients, glassmorphism effects, and grid background patterns
- **Wallpaper lightbox** — Full-screen gallery with keyboard navigation (arrow keys, Escape)
- **Movie catalog** — Posters, IMDB ratings, quality badges, genres, and download links
- **Product catalog** — Pricing (INR), color swatches, star ratings, stock indicators, and featured badges
- **API Index** — Interactive endpoint browser with live response previews and copy-to-clipboard

### 🌐 CORS Support
- Configurable CORS middleware for cross-origin API requests
- Preflight handling with customizable allowed origins, methods, and headers

### 📊 Dashboard Analytics
- Stats bar showing total categories, items, and breakdowns
- Vercel Speed Insights & Analytics integration

### 🖼️ Image Optimization
- Next.js image remote patterns configured for external sources
- Lazy loading on all images

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | Framework with file-based routing and API routes |
| **TypeScript** | Type safety across the entire codebase |
| **Tailwind CSS 3** | Utility-first styling with custom design system |
| **Lucide React** | Icon library |
| **Vercel Analytics** | Real-time visitor analytics |
| **Vercel Speed Insights** | Performance monitoring |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── [slug]/                         # Dynamic category pages (movies, products, wallpapers, etc.)
│   │   └── page.tsx                    # Server component: routes to custom or generic category pages
│   ├── api/
│   │   ├── [category]/route.ts         # Dynamic API endpoint serving JSON data per category
│   │   ├── auth/route.ts               # Auth documentation endpoint
│   │   ├── categories/route.ts         # Index of all categories (authenticated)
│   │   ├── check-auth/route.ts         # Session validation endpoint
│   │   ├── index/page.tsx              # Interactive API Explorer (client component)
│   │   ├── login/route.ts              # Session-based login (POST)
│   │   └── logout/route.ts             # Session logout (POST)
│   ├── login/
│   │   └── page.tsx                    # Login page with password form
│   ├── globals.css                     # Global styles, glass effects, animations
│   ├── layout.tsx                      # Root layout (navbar, auth provider, analytics)
│   └── page.tsx                        # Landing page with hero, stats, and category grid
├── components/
│   ├── AuthGuard.tsx                   # Client-side auth check wrapper
│   ├── CategoryPage.tsx                # Reusable generic category listing with search
│   ├── MoviesPage.tsx                  # Movie catalog (posters, ratings, downloads)
│   ├── Navbar.tsx                      # Navigation bar (responsive, dropdown menus)
│   ├── ProductsPage.tsx                # Product catalog (pricing, colors, ratings)
│   └── WallpapersPage.tsx             # Wallpaper gallery with lightbox viewer
├── docs/
│   ├── index.json                      # Category index with auth metadata
│   ├── Movies/index.json               # Movie dataset
│   ├── Products/index.json             # Product dataset
│   ├── Projects/                       # Project datasets (10 categories)
│   └── Wallpapers/index.json           # Wallpaper dataset
├── lib/
│   ├── auth.ts                         # API authentication logic & helpers
│   ├── AuthContext.tsx                  # React context for dashboard auth state
│   ├── data.ts                         # Data imports, TypeScript interfaces, category definitions
│   └── middleware.ts                   # CORS middleware for API routes
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/atul22g-dev/Apis-atual-dev.git
cd Apis-atual-dev

# Install dependencies
npm install

# Configure environment variables (see Environment Variables section)
# Create a .env.local file with the following variables (see Environment Variables section)
# LOGIN_PASSWORD=your-secure-password
# API_KEY=your-api-key

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev        # Start development server (port 3000)
npm run build      # Production build
npm start          # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```

### Build for Production

```bash
npm run build
npm start
```

---

## 🔐 Authentication System

The project has **two separate authentication layers**:

### Dashboard Login (Password)

The dashboard UI is protected by a **password-based login** system using session cookies.

**Flow:**
1. Unauthenticated users are redirected to `/login`
2. User enters the password
3. `POST /api/login` validates the password against `LOGIN_PASSWORD` env var
4. On success, a `session` cookie is set (httpOnly, 7-day expiry)
5. `AuthGuard` component checks `/api/check-auth` on every page load
6. Users can log out via `POST /api/logout`

**Components involved:**
- `src/app/login/page.tsx` — Login form UI with show/hide password toggle
- `src/lib/AuthContext.tsx` — React context managing auth state (`login`, `logout`, `isAuthenticated`)
- `src/components/AuthGuard.tsx` — Wraps protected pages, redirects to `/login` if unauthenticated
- `src/app/api/check-auth/route.ts` — Validates session cookie
- `src/app/api/login/route.ts` — Password validation + session creation
- `src/app/api/logout/route.ts` — Session destruction

### API Authentication (API Key / Bearer Token)

All API endpoints (except `/api/auth` and `/api/categories`) are protected by **API key authentication**. The `/api/playlists` endpoint returns all playlist metadata and requires a key.

**Supported methods:**

| Method | Where to send |
|---|---|
| `X-API-Key` header | `X-API-Key: YOUR_API_KEY` |
| `api_key` query param | `?api_key=YOUR_API_KEY` |
| Bearer token | `Authorization: Bearer YOUR_API_KEY` |

**Implementation:**
- `src/lib/auth.ts` — `validateAuth()` checks headers/query params against `API_KEY` env var
- `src/app/api/[category]/route.ts` — Calls `validateAuth()` for protected routes
- Unauthenticated requests receive a `401` JSON response with supported methods listed

```bash
# Examples
curl -H "X-API-Key: your-key" http://localhost:3000/api/frontend
curl -H "Authorization: Bearer your-key" http://localhost:3000/api/movies
curl "http://localhost:3000/api/wallpapers?api_key=your-key"
```

---

## 📡 API Endpoints

All endpoints return **JSON** responses.

### Endpoint List

| Endpoint | Auth Required | Description |
|---|---|---|
| `GET /api/index` | ✅ Yes | Interactive API explorer (client-side page) |
| `GET /api/auth` | ❌ No | Authentication documentation & examples |
| `GET /api/categories` | ✅ Yes | Category index with metadata (`{ data, _links }` response) |
| `GET /api/frontend` | ✅ Yes | Frontend web development projects |
| `GET /api/landing-page` | ✅ Yes | Landing page templates |
| `GET /api/libraries` | ✅ Yes | JavaScript libraries & resources |
| `GET /api/movies` | ✅ Yes | Movie collection (posters, downloads) |
| `GET /api/products` | ✅ Yes | Tech products catalog |
| `GET /api/fullstack` | ✅ Yes | Fullstack web projects |
| `GET /api/repositories` | ✅ Yes | Open source repositories |
| `GET /api/apps` | ✅ Yes | Mobile & desktop applications |
| `GET /api/cdns` | ✅ Yes | CDN resources & links |
| `GET /api/wallpapers` | ✅ Yes | Curated wallpaper collection |
| `GET /api/unfinished` | ✅ Yes | Work in progress projects |
| `GET /api/mongodb` | ✅ Yes | MongoDB database projects |
| `GET /api/packages` | ✅ Yes | Published npm packages |
| `GET /api/playlists` | ✅ Yes | All playlist metadata (Songs, Poetry, Standup Comedy) — private |
| `POST /api/login` | ❌ No | Dashboard password login |
| `POST /api/logout` | ❌ No | Dashboard logout |
| `GET /api/check-auth` | ❌ No | Check session validity |

### API Index Page

Visit `/api/index` in the browser for an interactive **API Explorer** that lets you:
- Browse all available endpoints
- Make test requests inline
- View formatted JSON responses
- Copy cURL examples and endpoint URLs

---

## 🗂️ Categories

| Category | Slug | Icon | Data Type | Custom Page |
|---|---|---|---|---|
| Frontend | `frontend` | `FolderCog` | `Project[]` | — |
| LandingPage | `landing-page` | `Zap` | `Project[]` | — |
| Libraries | `libraries` | `BookOpen` | `Project[]` | — |
| Movies | `movies` | `Film` | `Movie[]` | ✅ MoviesPage |
| Products | `products` | `ShoppingBag` | `Product[]` | ✅ ProductsPage |
| Fullstack | `fullstack` | `Server` | `Project[]` | — |
| Repositories | `repositories` | `GitBranch` | `Project[]` | — |
| Apps | `apps` | `Smartphone` | `Project[]` | — |
| CDNs | `cdns` | `Globe` | `Cdn[]` | — |
| Wallpapers | `wallpapers` | `Image` | `Wallpaper[]` | ✅ WallpapersPage |
| Unfinished | `unfinished` | `Construction` | `Project[]` | — |
| MongoDB | `mongodb` | `Database` | `MongoDBProject[]` | — |
| Packages | `packages` | `Package` | `Package[]` | — |

Categories with **Custom Pages** have specialized layouts:
- **Movies** — Grid with posters, IMDB ratings, quality badges, genre tags, download buttons
- **Products** — Cards with images, INR pricing, color swatches, star ratings, stock status
- **Wallpapers** — Compact grid with full-screen lightbox (keyboard navigation)

All other categories use the generic `CategoryPage` component with search and card layout.

---

## 🧩 Components & Pages

### Layout (`src/app/layout.tsx`)
- Root layout wrapping all pages
- `Inter` font from Google Fonts
- `AuthProvider` context for auth state management
- `Navbar` for navigation
- Vercel Analytics & Speed Insights scripts

### Landing Page (`src/app/page.tsx`)
- Hero section with animated title and gradient effects
- Stats bar (categories, total items, frontend count, media count)
- Category grid with colored cards and hover animations
- Footer with copyright

### Login Page (`src/app/login/page.tsx`)
- Centered glass card form
- Password input with show/hide toggle
- Loading spinner during authentication
- Error message display
- Redirect on successful login

### Navbar (`src/components/Navbar.tsx`)
- Fixed top navigation with backdrop blur on scroll
- Logo with gradient icon
- Desktop navigation: Home, API Index, Categories dropdown, Logout
- Mobile responsive hamburger menu with slide-down overlay
- Sign In / Logout toggle based on auth state

### AuthGuard (`src/components/AuthGuard.tsx`)
- Client component checking auth state
- Shows loading spinner during auth check
- Redirects to `/login` if unauthenticated

### CategoryPage (`src/components/CategoryPage.tsx`)
- Reusable generic page for all categories
- Back navigation, title, description
- Real-time search bar with clear functionality
- Responsive card grid (1-4 columns)
- Default card with image, title, description, stars, source/demo links
- Empty state with clear search option

### MoviesPage (`src/components/MoviesPage.tsx`)
- Grid with 2:3 aspect ratio posters
- IMDB rating badge (top-right)
- Quality badge (top-left)
- Hover overlay gradient
- Release year, language, size tags
- Genres and description
- Download button linking to first source

### ProductsPage (`src/components/ProductsPage.tsx`)
- Product images with featured badge
- Company and category tags
- INR pricing with Indian locale formatting
- Color swatch circles
- Star rating display (filled/empty)
- Review count and stock status
- Description excerpt

### WallpapersPage (`src/components/WallpapersPage.tsx`)
- Compact 9:16 aspect ratio grid (2-5 columns)
- Hover overlay with wallpaper name
- **Lightbox**: Full-screen overlay with:
  - Previous / Next navigation buttons
  - Image counter (e.g. "Sunset · 3 / 25")
  - Keyboard support: ← → Arrow keys, Escape to close
  - Click outside to dismiss

### API Index Page (`src/app/api/index/page.tsx`)
- Interactive list of all API endpoints
- Expand/collapse each endpoint
- Live response fetching with loading state
- Formatted JSON response viewer
- Copy-to-clipboard for URLs, cURL examples, and response data
- "Quick Access" section with direct links
- Desktop and responsive design

---

## 💾 Data Architecture

### Data Sources

All data is stored as **static JSON files** in `src/docs/`:

```
src/docs/
├── index.json               # Category index (id, name, src, auth metadata)
├── Movies/
│   └── index.json           # Movie objects with downloads array
├── Products/
│   └── index.json           # Product objects with prices, images, colors
├── Projects/
│   ├── App.json             # Mobile/desktop apps
│   ├── Cdns.json            # CDN resource links
│   ├── Frontend.json        # Frontend projects
│   ├── Fullstack.json       # Fullstack projects
│   ├── LandingPage.json     # Landing page templates
│   ├── Libraries.json       # JS libraries
│   ├── MongoDB.json         # MongoDB projects with health status
│   ├── Packages.json        # npm packages
│   ├── Repositories.json    # Open source repos
│   └── Unfinished.json      # Work in progress
└── Wallpapers/
    └── index.json           # Wallpaper objects with URLs
```

### Data Flow

```
JSON files → import (src/lib/data.ts) → 
  ├── Dynamic API Route (src/app/api/[category]/route.ts) → JSON Response
  └── Category Pages (src/app/[slug]/page.tsx) → UI Rendering
```

### TypeScript Interfaces (`src/lib/data.ts`)

| Interface | Fields |
|---|---|
| `Project` | `id`, `title`, `src?`, `demo?`, `desc?`, `img?` |
| `Movie` | `Key`, `Name`, `Poster`, `Title`, `Desc`, `Release`, `Language`, `Subtitles`, `Size`, `Quality`, `Format`, `IMDB`, `Genres`, `Country`, `Movie_story`, `Screenshots1-4`, `downloads[]` |
| `Product` | `id`, `name`, `company?`, `price`, `colors?`, `description`, `category`, `featured?`, `shipping?`, `stock`, `reviews`, `stars`, `image`, `images[]?` |
| `Wallpaper` | `id`, `Name`, `url` |
| `Cdn` | `name`, `src?`, `demo?` |
| `Package` | `name`, `src`, `demo` |
| `MongoDBProject` | `name`, `db-check`, `status` |
| `CategoryInfo` | `id`, `name`, `slug`, `description`, `icon`, `count`, `color` |
| `AuthConfig` | `name`, `version`, `base_url`, `docs`, `note`, `authentication_methods[]`, `example_requests[]` |

### Data Transformation

Some categories require data transformation before rendering:
- **CDNs** → Items are mapped with `id: c.name`
- **MongoDB** → Items are transformed to include `title`, `desc` (health status), `demo` (status)
- **Packages** → Items are transformed to include `title`, `src`, `demo`

---

## 🌐 CORS Configuration

The middleware (`src/middleware.ts`) automatically handles CORS for all `/api/*` routes.

### Environment Variables

```env
CORS_ORIGIN=*                                     # Comma-separated allowed origins
CORS_METHODS=GET,POST,OPTIONS                     # Allowed HTTP methods
CORS_HEADERS=Content-Type,Authorization,X-API-Key # Allowed headers
```

### Behavior

- **Preflight requests** (`OPTIONS`): Returns appropriate CORS headers with 24-hour max-age
- **Normal requests**: Adds `Access-Control-Allow-Origin` header
- **Cookie-based auth routes** (`/api/login`, `/api/logout`): Sets `Access-Control-Allow-Credentials: true` and echoes the request origin
- **Wildcard origin**: When `CORS_ORIGIN=*`, echoes the origin for credential routes, uses `*` for others

---

## 🔧 Environment Variables

Create a `.env.local` file in the project root:

```env
# REQUIRED: Dashboard login password
LOGIN_PASSWORD=your-secure-password

# REQUIRED: API key for external API access
API_KEY=your-api-key

# OPTIONAL: CORS configuration (defaults shown below)
CORS_ORIGIN=*
CORS_METHODS=GET,POST,OPTIONS
CORS_HEADERS=Content-Type,Authorization,X-API-Key
```

### Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `LOGIN_PASSWORD` | ✅ Yes | Password for dashboard login (session-based auth) |
| `API_KEY` | ✅ Yes | API key for programmatic API access (header/query/token) |
| `CORS_ORIGIN` | ❌ No | Comma-separated allowed origins (default: `*`) |
| `CORS_METHODS` | ❌ No | Comma-separated allowed HTTP methods (default: `GET,POST,OPTIONS`) |
| `CORS_HEADERS` | ❌ No | Comma-separated allowed headers (default: `Content-Type,Authorization,X-API-Key`) |

> ⚠️ **Security Note**: Never commit `.env.local` to version control. The `.gitignore` already excludes it.

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

The project is pre-configured for Vercel deployment with `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

**Steps:**

1. Push your repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables (`LOGIN_PASSWORD`, `API_KEY`) in Vercel dashboard
4. Deploy

### Other Hosting Options

The project can also be deployed to any Node.js/Next.js compatible platform (Netlify, Cloudflare Pages, Railway, etc.).

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Type-check** your changes: `npm run typecheck`
5. **Lint** your changes: `npm run lint`
6. **Commit** your changes (`git commit -m 'Add amazing feature'`)
7. **Push** to the branch (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

### Adding a New Category

1. Add JSON data file in `src/docs/` (or a subdirectory)
2. Import the data in `src/lib/data.ts`
3. Add the TypeScript interface if needed
4. Add the category to the `dataMap` in `src/app/[slug]/page.tsx` and `src/app/api/[category]/route.ts`
5. Add the category definition to the `categories` array in `src/lib/data.ts`
6. If needed, create a custom page component in `src/components/`

---

## 📄 License

This project is open source. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Built with ❤️ using <strong>Next.js</strong> & <strong>Tailwind CSS</strong>
  <br />
  <a href="https://github.com/atual-dev">@atual-dev</a>
</div>
