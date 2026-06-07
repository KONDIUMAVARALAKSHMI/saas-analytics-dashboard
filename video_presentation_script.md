# Video Presentation Script: Multi-Tenant SaaS Analytics Dashboard

This document provides a complete guide and script for recording your project walkthrough video. It is organized into structural details, codebase checkpoints, execution steps, and a final teleprompter-ready script.

---

## 🎬 Video Overview

- **Target Duration:** 5–8 minutes
- **Structure:**
  1. **Introduction & Problem Statement** (Slide or Camera)
  2. **Architecture & Tech Stack** (Code/Diagram)
  3. **Codebase Deep Dive** (VS Code with highlighted file links & line numbers)
  4. **Live Execution & Output Demo** (Browser & Terminal)
  5. **Conclusion**

---

## 🏗️ Architecture & Flow Diagram

Here is how the request flow and data isolation are managed in the application:

```mermaid
graph TD
    Client[Browser / Client] -->|Request /tenants/acme-corp/dashboard| Middleware[Middleware.ts - Auth Guard]
    Middleware -->|Unauthenticated| Login[Redirect to /login]
    Middleware -->|Authenticated| Router[Next.js App Router]
    Router -->|Check params.tenantSlug| Layout[Dashboard Layout]
    Layout -->|Verify user.tenantSlug match| Render[Render Layout]
    Render -->|Render Slot 1| Analytics[@analytics Parallel Route]
    Render -->|Render Slot 2| Support[@support Parallel Route]
    Render -->|Suspense fallback: Skeleton| Page[Main Dashboard Page]
    Page -->|Await 2.0s| Metrics[MetricsWidget Server Component]
    Page -->|Await 2.5s| Revenue[RevenueWidget Server Component]
    Metrics -->|Prisma Query| DB[(PostgreSQL Database)]
    Revenue -->|Prisma Query| DB
    Client -->|EventSource API| SSE[/api/events SSE Stream]
```

---

## 📁 Codebase Checkpoints (Files to Show)

Make sure these files are open in your IDE tabs so you can switch between them smoothly.

### 1. Database Schema & Tenant Isolation
* **File:** [prisma/schema.prisma](file:///d:/Downloads/saas-dashboard/prisma/schema.prisma)
* **Highlights:**
  * **Lines 16-24:** `Tenant` model representing separate client organizations.
  * **Lines 26-36:** `User` model with a relation to a specific `Tenant` and a `Role` (ADMIN vs MEMBER).
  * **Lines 38-47:** `AnalyticsData` model storing tenant-specific metrics. Note that every record belongs to a `Tenant`.

### 2. Multi-Tenant Route Protection & Authentication
* **File:** [auth.ts](file:///d:/Downloads/saas-dashboard/auth.ts)
  * **Highlights (Lines 58-79):** The `jwt` and `session` callbacks where `role`, `tenantId`, and `tenantSlug` are embedded in the user session.
* **File:** [middleware.ts](file:///d:/Downloads/saas-dashboard/middleware.ts)
  * **Highlights (Lines 8-25):** The middleware auth guard checking if the route is public or private. If private and not logged in, redirects to `/login`. If logged in, redirects to their assigned tenant dashboard path.

### 3. Parallel Routing & Dashboard Composition
* **File:** [layout.tsx](file:///d:/Downloads/saas-dashboard/app/tenants/%5BtenantSlug%5D/dashboard/layout.tsx)
* **Highlights:**
  * **Lines 5-14:** Destructuring `children`, `analytics`, and `support` parameters.
  * **Lines 21-24:** Security check: Redirection if the URL tenant slug doesn't match the user's token slug.
  * **Lines 30-34:** Rendering the parallel slots (`{analytics}` and `{support}`) in a split-screen grid layout.

### 4. Streaming UI & Suspense
* **File:** [page.tsx](file:///d:/Downloads/saas-dashboard/app/tenants/%5BtenantSlug%5D/dashboard/page.tsx)
* **Highlights:**
  * **Lines 34-46:** Role-Based Access Control (RBAC): Checking if `isAdmin` is true to render the admin-only alert panel.
  * **Lines 50-65:** Independent `<Suspense>` wrappers around `<MetricsWidget>` and `<RevenueWidget>` to show loading skeletons while async database calls complete.

### 5. Intercepting Routes (Modals vs Full Page Views)
* **File:** [page.tsx](file:///d:/Downloads/saas-dashboard/app/tenants/%5BtenantSlug%5D/dashboard/page.tsx)
  * **Highlights (Lines 73-88):** Links to `/item/[id]`.
* **File:** [(.)item/[itemId]/page.tsx](file:///d:/Downloads/saas-dashboard/app/tenants/%5BtenantSlug%5D/dashboard/%28.%29item/%5BitemId%5D/page.tsx)
  * **Highlights (Lines 13-21):** Client component showing the item details overlay inside a modal.
* **File:** [item/[itemId]/page.tsx](file:///d:/Downloads/saas-dashboard/app/item/%5BitemId%5D/page.tsx)
  * **Highlights (Lines 5-15):** The server-side, standalone version of the page shown when reloading the browser tab or visiting the URL directly.

### 6. Real-Time Streaming & Server-Sent Events (SSE)
* **File:** [route.ts](file:///d:/Downloads/saas-dashboard/app/api/events/route.ts)
  * **Highlights (Lines 13-37):** Setting up a `ReadableStream` with a `setInterval` sending event data payloads to the client every 2 seconds.
* **File:** [real-time-feed.tsx](file:///d:/Downloads/saas-dashboard/components/dashboard/real-time-feed.tsx)
  * **Highlights (Lines 17-39):** Instantiating `EventSource('/api/events')` to capture the real-time server stream in client state.

---

## 💻 Commands Sequence & Demo Flow

Follow this exact terminal and browser walkthrough to record the output.

### Step 1: Start the application
Open your terminal inside the project directory:

```powershell
# Verify files and prepare docker containers
docker-compose down
docker-compose up --build
```
*(Wait until you see migration outputs and the Next.js server logs listening on port 3000)*

### Step 2: Clear Manual Setup (Fallback / Alternative execution)
If you are running the Next.js app locally (`npm run dev`) outside of Docker:
1. Make sure your database container is running (it maps port 5432 to your host machine).
2. Open your `.env` file and make sure the `DATABASE_URL` points to `localhost:5432` instead of `db:5432` (we updated the `.env` file to default to this).
3. Then execute:
```powershell
# Install dependencies
npm install

# Push migration & Seed Database
npx prisma db push
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

### Step 3: Interactive Demo Steps
1. Navigate to: `http://localhost:3000/` (will redirect to `/login` if unauthenticated).
2. Login with Admin credentials:
   - **Email:** `admin@test.com`
   - **Password:** `password123`
3. Point out the **Streaming Skeleton fallback** during the initial load (2 seconds wait).
4. Point out the **Admin Panel** at the top (only visible to admins).
5. Open a new Incognito tab and log in as Member:
   - **Email:** `member@test.com`
   - **Password:** `password123`
   - Point out that the Admin Panel is **hidden**.
6. Switch back to the Admin tab. Point out the **Parallel Routes** (Analytics Overview and Support Overview).
7. Scroll down to **Recent Items**. Click "View Details" on Item #2:
   - Observe the URL changes to `http://localhost:3000/item/2` and the modal pops up on top.
   - Hit **Refresh (F5)** on the browser:
   - Observe the page reloads as a **full standalone detail page**. Click "Back to Dashboard" to return.
8. Point out the **Real-Time Feed** updating automatically every 2 seconds without page refreshes.
9. Click **Data Explorer** in the navigation bar:
   - Type `filter` in the search bar and press enter. See the query parameters update in the URL.
   - Click "Next Page" / "Prev Page" to show server-side pagination.
10. Click **Profile** in the nav bar:
    - Update name to `Admin User Pro` and click Save.
    - Refresh the dashboard to see the welcome text updated instantly via **Server Actions** revalidation.
11. Click **Export CSV** on the dashboard header:
    - Open the downloaded `export.csv` file to show headers and rows formatted as CSV.
12. Navigate manually to `http://localhost:3000/faulty-page`:
    - Show the **Next.js Error Boundary UI** and click "Try again".

---

## 🎙️ Video Recording Script (Word-for-Word)

Below is the recording script. Spoken text is in **bold**, actions are inside `[brackets]`.

---

### Phase 1: Intro & Problem Statement
* **Visual:** Web Camera OR project homepage at `http://localhost:3000/login`
* **Audio:**
  > **"Hello everyone! Today, I am excited to demonstrate my Multi-Tenant SaaS Analytics Dashboard built with Next.js 14, Prisma, PostgreSQL, and Auth.js v5. Let's start with the problem this project solves."**
  >
  > **"Building modern software-as-a-service applications requires strict tenant data isolation, sub-second dashboard loading speeds, role-based access controls, and real-time feeds. In traditional models, a dashboard loads all metrics synchronously, creating a bottleneck that delays page loading. This project resolves these challenges by using modern React Server Components, Streaming UI with Suspense, Parallel & Intercepting Routing, and native Server-Sent Events."**

---

### Phase 2: Architecture & Schema walkthrough
* **Visual:** Switch to VS Code. Show [schema.prisma](file:///d:/Downloads/saas-dashboard/prisma/schema.prisma)
* **Audio:**
  > **"Let's look at the database schema. In `schema.prisma`, we have defined models for `Tenant`, `User`, and `AnalyticsData`. Each User belongs to a Tenant, and their access is gated via Roles—either `ADMIN` or `MEMBER`. The `AnalyticsData` table contains tenant-specific metrics. Because every row is mapped to a tenant ID, we achieve strict multi-tenant isolation."**

* **Visual:** Show [auth.ts](file:///d:/Downloads/saas-dashboard/auth.ts) and [middleware.ts](file:///d:/Downloads/saas-dashboard/middleware.ts)
* **Audio:**
  > **"For authentication, we integrate Auth.js version 5. In `auth.ts`, we intercept the sign-in flow and store the tenant's slug and user's role directly into the JWT token and session object. In `middleware.ts`, we run a route matcher that prevents unauthorized access, redirecting logged-in users directly to their dynamic tenant path."**

---

### Phase 3: Advanced Next.js Layouts (Parallel, Intercepting Routes, and Streaming)
* **Visual:** Show [layout.tsx](file:///d:/Downloads/saas-dashboard/app/tenants/%5BtenantSlug%5D/dashboard/layout.tsx)
* **Audio:**
  > **"Here is the dashboard layout. We use Next.js Parallel Routes by defining slot properties—`analytics` and `support`. These slots represent separate folders prefixed with `@`, allowing us to render multiple independent sub-pages simultaneously in a single view."**

* **Visual:** Show [page.tsx](file:///d:/Downloads/saas-dashboard/app/tenants/%5BtenantSlug%5D/dashboard/page.tsx)
* **Audio:**
  > **"In the main page file, we wrap our async server widgets—`MetricsWidget` and `RevenueWidget`—inside React `<Suspense>` boundaries. Each widget simulates an artificial database fetch delay. By using Suspense, the outer shell loads instantly, and each dashboard widget streams in as soon as its data is ready."**

* **Visual:** Show [(.)item/[itemId]/page.tsx](file:///d:/Downloads/saas-dashboard/app/tenants/%5BtenantSlug%5D/dashboard/%28.%29item/%5BitemId%5D/page.tsx)
* **Audio:**
  > **"We also utilize Intercepting Routes, represented by the folder `(.)item`. When clicking a detailed view from the dashboard, this interceptor overrides the navigation, displaying a modal component client-side while preserving the dashboard background state. If a user refreshes the page, Next.js falls back to the full standalone detail route."**

---

### Phase 4: Live Output Demo
* **Visual:** Switch to Terminal. Run `docker-compose up --build` or `npm run dev`. Once ready, switch to Browser.
* **Audio:**
  > **"Now, let's see the application in action. I'll launch the project container using Docker Compose. The database migration and seed script will configure our initial Postgres database automatically."**

* **Visual:** Go to `http://localhost:3000/login`. Login as `admin@test.com` with `password123`.
* **Audio:**
  > **"I will log in as the administrator. Watch the widgets closely as they load."**
  >
  > *[Login and pause for 2 seconds to show the loading skeleton state]*
  >
  > **"You can see the widgets displayed their loading skeletons first, then populated their data asynchronously. Since I logged in as an administrator, this admin panel is visible at the top."**

* **Visual:** Click "View Details" on Item #2. Show modal. Press F5 (refresh). Show full details page. Click "Back to Dashboard".
* **Audio:**
  > **"Next, I'll click 'View Details' on Item #2. Notice that the URL changes, but the item opens in a beautiful modal overlay. If I hit refresh, Next.js serves the full detail page. Clicking back brings us safely home."**

* **Visual:** Point out the "Real-Time Feed" cards changing/populating.
* **Audio:**
  > **"Below, our Real-Time Feed is listening to our custom Server-Sent Events stream. The feed receives real-time metrics every 2 seconds without polling the backend."**

* **Visual:** Click "Data Explorer". Type `filter` in the search bar. Click next page.
* **Audio:**
  > **"Let's visit the Data Explorer. As I search or paginate through records, the search query is synced to the URL parameters. This enables shareable URLs and keeps our queries fully server-side."**

* **Visual:** Go to Profile. Update name to `Admin User Pro`. Click save. Go back to Dashboard.
* **Audio:**
  > **"Let's change our profile details. By utilizing Server Actions, our profile update is processed securely. The action automatically revalidates the cache, updating the header instantly."**

* **Visual:** Click "Export CSV". Show the downloaded spreadsheet payload.
* **Audio:**
  > **"Finally, I can download a CSV report of my tenant data with a single click. And if an unexpected error occurs..."**

* **Visual:** Navigate to `http://localhost:3000/faulty-page`.
* **Audio:**
  > **"Our custom error boundary catches it gracefully, displaying a fallback UI so the user is never left with a broken white screen."**

---

### Phase 5: Outro
* **Visual:** Go back to Dashboard.
* **Audio:**
  > **"That concludes the tour of this multi-tenant dashboard. We've combined security, scalability, and high-performance routing features to build a production-ready SaaS template. Thank you for watching!"**
