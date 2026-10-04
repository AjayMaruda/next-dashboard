# Analytics Dashboard

A responsive, production-ready analytics dashboard built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

Designed with a dynamic server-side architecture, reusable component design, and complete data flows without hardcoded UI values.

---

## Data Flow

```text
Mock Data (lib/mock-data) → Route Handlers (app/api/dashboard) → Server Page (app/dashboard) → UI Components
```

- **Server-First Rendering**: The dashboard page is a React Server Component that fetches data and resolves URL query params on the server before rendering.
- **Isolated Mock Layer**: Mock data lives entirely in `lib/mock-data/`, allowing seamless replacement with a real database or backend API.
- **Suspense & Loading Skeletons**: Skeletons cover cards, charts, and table rows during route transitions and data fetches.

---

## Features

- **Executive KPI Cards**: Real-time metrics for Revenue, Users, Orders, and Conversion with periodic delta indicators and progress pacing.
- **Interactive Revenue Chart**: Recharts area chart with time-range switching (`7D`, `30D`, `90D`, `1Y`).
- **Acquisition Breakdown**: Donut chart displaying traffic share across Organic, Direct, Referral, and Paid channels.
- **Server-Sorted Transactions Table**: Paginated activity table with customer search, status filters, and server-side column sorting (`Customer`, `Amount`, `Date`).
- **Contained Mobile Scrolling**: Table scrolls horizontally within its card container on smaller screens without breaking page layout.
- **Decoupled Content Layer**: Centralized UI copy, labels, placeholders, and toast messages in a single configuration file (`site-content.ts`).
- **Sidebar Navigation**: Tab-based route navigation with active states for demo exploration.
- **Currency Localization**: Monetary figures formatted to Indian Rupee (`₹`, `en-IN`).

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16** | App Router, Server Components, Route Handlers |
| **React 19** | Modern UI primitives, Suspense, client hooks |
| **TypeScript 5** | End-to-end type safety for models, API, and props |
| **Tailwind CSS v4** | Design tokens, CSS variables, utility styling |
| **Recharts** | Responsive SVG charts (Area, Donut) |
| **Lucide React** | Consistent UI iconography |
| **Sonner** | Toast notifications |

---

## Project Structure

```
src/
├── app/
│   ├── api/dashboard/
│   │   ├── activity/route.ts   # GET with search, filter, sortField, sortDir, page
│   │   ├── revenue/route.ts    # GET revenue points by period
│   │   ├── stats/route.ts      # GET high-level KPI cards
│   │   └── route.ts            # Consolidated dashboard payload
│   ├── dashboard/
│   │   ├── loading.tsx         # Skeleton state for route transitions
│   │   └── page.tsx            # Server page resolving searchParams
│   ├── globals.css             # Theme variables, resets, custom scrollbars
│   ├── layout.tsx              # Root HTML shell, fonts, Sonner toaster
│   └── page.tsx                # Root redirect to /dashboard
├── components/
│   ├── dashboard/
│   │   ├── activity-table.tsx  # Server-sorted table with pagination & filters
│   │   ├── customer-activity-feed.tsx # Real-time event log
│   │   ├── executive-ticker.tsx       # Live status indicators
│   │   ├── export-button.tsx          # Export action with feedback toast
│   │   ├── revenue-chart.tsx          # Recharts area graph with period tabs
│   │   ├── stat-card.tsx              # KPI card primitive
│   │   ├── stats-grid.tsx             # Responsive metric cards layout
│   │   └── traffic-chart.tsx          # Channel distribution donut chart
│   ├── layout/
│   │   ├── dashboard-shell.tsx # Responsive wrapper
│   │   ├── sidebar.tsx         # Navigation sidebar with active state
│   │   └── top-nav.tsx         # Header bar with search and actions
│   └── ui/
│       └── sonner.tsx          # Themed Sonner toast component
├── config/
│   ├── navigation.ts           # Centralized route & sidebar definitions
│   └── site-content.ts         # Static text, labels, messages, and placeholders
├── lib/
│   ├── api/dashboard.ts        # Server fetch utilities and data querying
│   ├── mock-data/dashboard.ts  # Isolated mock dataset
│   └── utils.ts                # Currency, date, and number formatters
└── types/
    └── dashboard.ts            # Type definitions for stats, charts, and activity
```

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/AjayMaruda/next-dashboard.git
cd next-dashboard
npm install
```

### 2. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root path automatically redirects to `/dashboard`.

### 3. Build & Verify

```bash
npm run build
npm run start
```

For linting and type checking:

```bash
npm run lint
npx tsc --noEmit
```

---

## Key Implementation Details

### Server-Side Table Sorting (SSR)

Instead of sorting only the current page in browser memory, column clicks trigger a server fetch with `sortField` and `sortDir`. The backend sorts the full dataset prior to pagination, ensuring accurate ordering across pages. On initial load, `searchParams` are resolved on the server so the initial HTML is pre-sorted.

### Decoupled Content Layer

Hardcoded strings have been extracted into `src/config/site-content.ts`. Headings, descriptions, table column headers, filter options, empty states, and toast messages are referenced from this single source of truth, keeping component code clean and maintainable.

### Contained Mobile Scrolling

Data tables often break on mobile screens by either clipping content or forcing horizontal overflow on the entire document. The activity table is wrapped in an isolated `overflow-x-auto min-w-0` element with a `min-w-[620px]` inner table, allowing horizontal scroll within the card while keeping the outer page responsive.

### Custom Visual Design System

The interface uses a deliberate, high-contrast palette:

- Base background: `#f8f6f2` (warm beige/ivory)
- Primary accent: `#a82020` (deep crimson)
- Typography: Plus Jakarta Sans with dark ink text (`#141413`)
- Borders: Sharp `0px` radius with crisp, structural `1px` borders instead of heavy shadows

---

## Prompts Used During Development

As part of the technical assessment submission, here are the actual developer prompts used during the development of this dashboard:

### 1. Architecture, Data Pipeline & Core Requirements

```text
We need to build a dynamic analytics dashboard in Next.js (App Router) with TypeScript and Tailwind CSS.

Requirements:
1. No hardcoded data in UI components:
   - Create a clean mock data layer in lib/mock-data/
   - Expose it via Next.js Route Handlers:
     - /api/dashboard/stats (KPI cards)
     - /api/dashboard/revenue (revenue trends)
     - /api/dashboard/activity (recent transactions)
     - /api/dashboard (full dashboard payload)
   - Fetch this data server-side in the dashboard page and pass it down to reusable components.
2. Dashboard Features:
   - 4 KPI cards: Total Revenue, Total Users, Total Orders, Conversion Rate (with % change indicators and progress bars).
   - Revenue area chart with time range options: 7D, 30D, 90D, 1Y.
   - Traffic source donut chart (Organic, Direct, Referral, Paid).
   - Transactions table with search, status filters, and pagination.
3. Loading and Error Handling:
   - Add proper skeleton loading states using Suspense.
   - Handle empty states for searches with zero results.
```

### 2. Design System & Theme Customization

```text
1. Color theme:
   - Use red as the main accent color and warm beige/ivory for the background.
   - Use dark ink/black for text with high contrast for readability.
   - Use a modern font like Plus Jakarta Sans.
2. Layout & Borders:
   - Remove the rounded corners on everything. Give cards, badges, inputs, and buttons a sharp 0px radius.
   - Use thin, crisp 1px borders instead of heavy drop shadows.
3. Theme consistency:
   - Make sure chart tooltips and toast notifications match the beige and red theme.
```

### 3. Content Centralization & Navigation Architecture

```text
1. Move static text out of components:
   - Create src/config/site-content.ts and put all headings, labels, search placeholders, filter options, empty states, and toast messages in one place.
   - Import this config into components so no display text is hardcoded in JSX.
2. Sidebar navigation for demo:
   - Define all routes in src/config/navigation.ts.
   - Since this is a demo submission, redirect sidebar links (Analytics, Customers, Orders, Settings, Help) to /dashboard with query tabs like ?tab=customers so they do not show 404 pages.
   - Add active styling to the currently selected menu item.
```

### 4. Server-Side Table Sorting (SSR), Currency & Mobile Responsiveness

```text
We have a few improvements and fixes for the transactions table:
1. Server-side sorting (SSR):
   - Right now, table sorting only sorts the 5 items on the current page in the browser.
   - Change it so sorting happens on the server across the entire dataset before pagination.
   - Update /api/dashboard/activity and data helpers to accept sortField (customer, amount, date) and sortDir (asc, desc).
   - Read searchParams on the server in app/dashboard/page.tsx so the initial HTML is already sorted.
   - Update the URL search params when the user clicks a column header.
2. Currency update:
   - Change the currency format from USD ($) to Indian Rupee (₹, en-IN) across all cards and table rows.
3. Mobile table scrolling:
   - On mobile screens, the table gets squished. Add horizontal scroll inside the card container with a minimum table width (620px) so all columns stay visible without breaking the mobile page layout.
```
