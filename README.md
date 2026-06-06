# Multi-Tenant SaaS Analytics Dashboard

A production-ready, multi-tenant SaaS analytics dashboard built with **Next.js 14 App Router**, **Prisma**, **PostgreSQL**, and **NextAuth.js v5**. This project demonstrates advanced patterns including React Server Components (RSC), Streaming UI with Suspense, Server Actions, Parallel Routes, Intercepting Routes, SSE, and more.

---

## 🚀 Quick Start

### Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose installed

### 1. Clone & Setup Environment

```bash
git clone <repo-url>
cd saas-analytics-dashboard
cp .env.example .env
```

### 2. Start the Application

```bash
docker-compose up --build
```

This single command will:
- Start a PostgreSQL 15 database container
- Build and start the Next.js application container
- Run Prisma migrations automatically
- Seed the database with test users and data

The app will be accessible at **http://localhost:3000**

### 3. Test Credentials

| Role   | Email            | Password     |
|--------|------------------|--------------|
| Admin  | admin@test.com   | password123  |
| Member | member@test.com  | password123  |

Tenant slug: `acme-corp`

---

## 🏗️ Architecture

### Technology Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Framework    | Next.js 14 (App Router)           |
| Language     | TypeScript                        |
| Database     | PostgreSQL 15                     |
| ORM          | Prisma 5                          |
| Auth         | NextAuth.js v5 (beta)             |
| Styling      | Tailwind CSS                      |
| Validation   | Zod                               |
| Container    | Docker + Docker Compose           |

### Project Structure

```
saas-analytics-dashboard/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth.js handler
│   │   ├── health/              # Health check endpoint
│   │   ├── events/              # SSE endpoint
│   │   └── export-csv/          # CSV export endpoint
│   ├── actions/
│   │   └── profile.ts           # Server Actions
│   ├── tenants/[tenantSlug]/
│   │   ├── dashboard/
│   │   │   ├── layout.tsx       # Parallel routes layout
│   │   │   ├── page.tsx         # Main dashboard
│   │   │   ├── @analytics/      # Parallel route slot
│   │   │   ├── @support/        # Parallel route slot
│   │   │   └── (.)item/[id]/    # Intercepting route (modal)
│   │   └── data/                # Data table with search/pagination
│   ├── item/[itemId]/           # Standalone item detail page
│   ├── login/                   # Login page
│   ├── profile/                 # User profile page
│   └── faulty-page/             # Error boundary demo
├── components/
│   ├── auth/                    # Auth components
│   └── dashboard/               # Dashboard components
├── lib/
│   └── prisma.ts                # Prisma client singleton
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed.ts                  # TypeScript seed script
│   └── seed.sql                 # SQL placeholder for Docker init
├── auth.ts                      # NextAuth configuration
├── middleware.ts                 # Route protection middleware
├── docker-compose.yml
├── Dockerfile
└── submission.json
```

### Multi-Tenancy

This project uses **path-based multi-tenancy** (`/tenants/{tenantSlug}/...`). Every database query includes a `tenantId` filter derived from the authenticated user's session, ensuring complete data isolation between tenants.

---

## ✨ Features Implemented

### 1. Docker & Containerization
- `docker-compose up` starts both the Next.js app and PostgreSQL
- Health checks on both services
- Automatic database migration and seeding on startup

### 2. Database Schema (Prisma)
- `User` model with email, password (hashed), name, role, and tenant relation
- `Tenant` model with name and unique slug
- `Role` enum: `ADMIN` | `MEMBER`
- `AnalyticsData` model for tenant-scoped metrics

### 3. Authentication (NextAuth.js v5)
- Credentials provider with bcrypt password hashing
- JWT session strategy
- Role and tenantSlug stored in JWT token
- Login page at `/login` with `data-testid` attributes

### 4. Multi-Tenancy & RBAC
- Path-based tenancy: `/tenants/{tenantSlug}/dashboard`
- Middleware protects all non-public routes
- `data-testid="admin-only-panel"` visible only to ADMIN role

### 5. Dashboard Streaming (RSC + Suspense)
- Two async Server Components with artificial delay
- Each wrapped in `<Suspense>` with `data-testid="widget-loading-skeleton"` fallback
- Loaded content has `data-testid="widget-loaded-content"`

### 6. Server Actions
- Profile update via Server Action with Zod validation
- `data-testid="profile-name-input"`, `profile-submit-button`, `profile-success-message`

### 7. Parallel Routes
- `@analytics` slot: `data-testid="analytics-view-content"`
- `@support` slot: `data-testid="support-view-content"`
- Both rendered simultaneously on the dashboard

### 8. Intercepting Routes
- Click item link → modal overlay with `data-testid="item-detail-modal"`
- URL updates to `/item/{id}` while dashboard remains in background
- Page refresh loads standalone detail page

### 9. Server-Sent Events (SSE)
- `/api/events` endpoint with `Content-Type: text/event-stream`
- Sends events every 2 seconds
- Client component with `data-testid="real-time-feed"` displays live updates

### 10. CSV Export
- Button with `data-testid="export-csv-button"`
- Downloads `export.csv` with headers: `"id","value","timestamp","label","category"`

### 11. Search & Pagination
- URL-driven: `?q=searchterm&page=2`
- `data-testid="search-input"`, `next-page-button`, `prev-page-button`, `list-item`

### 12. Health Check
- `GET /api/health` → `{ "status": "ok" }`

### 13. Error Boundary
- `/faulty-page` throws intentionally
- Caught by `error.tsx` with `data-testid="error-boundary-ui"` and `error-reset-button`

---

## 🔧 Development (without Docker)

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your local PostgreSQL credentials

# Run migrations
npx prisma migrate dev

# Seed database
npx tsx prisma/seed.ts

# Start dev server
npm run dev
```

---

## 🧪 Running Tests

Navigate to these URLs after starting the app to verify features:

| Feature             | URL                                        |
|---------------------|--------------------------------------------|
| Login               | http://localhost:3000/login                |
| Admin Dashboard     | http://localhost:3000/tenants/acme-corp/dashboard |
| Profile             | http://localhost:3000/profile              |
| Data Table          | http://localhost:3000/tenants/acme-corp/data |
| Item Modal          | Click "View Details" on dashboard          |
| Error Boundary      | http://localhost:3000/faulty-page          |
| Health Check        | http://localhost:3000/api/health           |
| SSE Events          | http://localhost:3000/api/events           |
| CSV Export          | http://localhost:3000/api/export-csv       |

---

## 🔐 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens store minimal user data
- All Server Actions validate input with Zod
- Route middleware enforces authentication
- Tenant data always filtered by `tenantId`
