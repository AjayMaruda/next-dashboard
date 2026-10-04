# Nexus Dashboard

A production-quality, dynamic analytics dashboard built with Next.js 16, TypeScript, and Tailwind CSS. Demonstrates modern frontend architecture with clean data flow, reusable components, and professional UX.

![Nexus Dashboard Preview](./public/preview.png)

---

## Features

- **Dynamic data flow** — all dashboard values come from API routes, never hardcoded in UI components
- **4 KPI stat cards** — Revenue, Users, Orders, Conversion Rate with trend indicators
- **Interactive revenue chart** — area chart with 7D / 30D / 90D / 1Y period switching
- **Traffic sources donut chart** — acquisition channel breakdown
- **Transactions table** — search, status filter, column sorting, pagination
- **Skeleton loading states** — entire dashboard loads with skeleton placeholders
- **Empty & error states** — graceful fallbacks with retry
- **Responsive layout** — sidebar on desktop, drawer on mobile
- **Slate Dark theme** — minimalist SaaS design inspired by Linear/Vercel

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | lucide-react |
| Class merging | clsx + tailwind-merge |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/AjayMaruda/next-dashboard.git
cd next-dashboard
npm install
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`.

### Production Build

```bash
npm run build
npm run start
```

---

## Environment Variables

No environment variables are required to run the project locally.

If deploying to a non-localhost origin, set:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

This is used by the server-side data fetching helper to construct absolute API URLs. Defaults to `http://localhost:3000`.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — Inter font, metadata
│   ├── page.tsx                # Redirects to /dashboard
│   ├── globals.css             # Tailwind v4 theme tokens + base styles
│   ├── dashboard/
│   │   ├── page.tsx            # Server Component — fetches data, renders dashboard
│   │   └── loading.tsx         # Next.js loading UI — full skeleton
│   └── api/
│       └── dashboard/
│           ├── route.ts        # GET /api/dashboard?period=30d
│           ├── stats/route.ts  # GET /api/dashboard/stats
│           ├── revenue/route.ts  # GET /api/dashboard/revenue?period=
│           └── activity/route.ts # GET /api/dashboard/activity?search=&status=&page=
│
├── components/
│   ├── layout/
│   │   ├── dashboard-shell.tsx # Client wrapper — manages sidebar state
│   │   ├── sidebar.tsx         # Responsive sidebar with mobile drawer
│   │   └── top-nav.tsx         # Sticky header with search + notifications
│   └── dashboard/
│       ├── stats-grid.tsx      # Grid of 4 KPI stat cards
│       ├── stat-card.tsx       # Individual stat card + trend badge + skeleton
│       ├── revenue-chart.tsx   # Area chart with period selector (client)
│       ├── traffic-chart.tsx   # Donut chart for traffic sources
│       └── activity-table.tsx  # Table with search, filter, sort, pagination (client)
│
├── lib/
│   ├── mock-data/
│   │   └── dashboard.ts        # All mock data — isolated from UI
│   ├── api/
│   │   └── dashboard.ts        # Typed fetch helpers — UI data access layer
│   └── utils.ts                # cn(), formatCurrency(), formatNumber(), formatPercent()
│
└── types/
    └── dashboard.ts            # All TypeScript interfaces
```

---

## Data Flow

```
Mock Data (lib/mock-data/dashboard.ts)
        ↓
API Route Handlers (app/api/dashboard/*)
        ↓
Fetch Helpers (lib/api/dashboard.ts)
        ↓
Dashboard Server Component (app/dashboard/page.tsx)
        ↓
UI Components (components/dashboard/*)
        ↓
Client Components for Interactivity
(revenue-chart, activity-table call API directly on interaction)
```

The mock data layer is fully isolated — swapping it for a real database only requires updating `lib/mock-data/dashboard.ts` and the API route handlers. No UI components need to change.

---

## API Reference

### `GET /api/dashboard`
Full dashboard payload.

**Query params:** `period` — `7d` | `30d` | `90d` | `1y` (default: `30d`)

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalRevenue": { "value": 248500, "change": 12.4, "trend": "up" },
      "totalUsers":   { "value": 14820,  "change": 8.1,  "trend": "up" },
      "totalOrders":  { "value": 3247,   "change": -2.3, "trend": "down" },
      "conversionRate": { "value": 3.6,  "change": 0.4,  "trend": "up" }
    },
    "revenue": [{ "date": "Sep 4", "revenue": 8420, "orders": 112, "users": 358 }],
    "traffic": [{ "source": "Organic Search", "value": 38, "color": "#6366f1" }],
    "activity": [{ "id": "txn_0001", "customer": "...", "amount": 240, "status": "completed", ... }]
  }
}
```

### `GET /api/dashboard/stats`
KPI stats only.

### `GET /api/dashboard/revenue?period=30d`
Revenue time series for the given period.

### `GET /api/dashboard/activity`
Paginated, filterable activity list.

**Query params:** `search`, `status` (`all` | `completed` | `pending` | `failed` | `cancelled`), `page`, `limit`

**Response includes** `data[]` + `meta: { total, page, limit, totalPages }`

---

## Design Decisions

### Slate Dark Theme
Chosen to align with the minimalist SaaS aesthetic. CSS custom properties are defined as Tailwind v4 `@theme` tokens, making the entire color system easily swappable.

### Server Components first
The dashboard page is a Server Component. Data is fetched server-side on the initial load. Client components (`RevenueChart`, `ActivityTable`) are used only where interactivity requires it.

### Mock data isolation
All mock data lives in `lib/mock-data/dashboard.ts`. API routes import from this layer. UI components never import mock data directly — they only consume typed API responses. This means production backend integration requires zero UI changes.

### No external component library
Components are built manually using Tailwind CSS. This avoids version conflicts with Tailwind v4 and gives full control over design consistency.

### Recharts over heavier alternatives
Recharts is composable, lightweight, and React-native. It works well with Tailwind's design tokens and doesn't require a separate style system.

---

## Responsive Design

| Breakpoint | Layout |
|---|---|
| Mobile (`< 768px`) | Top nav with hamburger, sidebar as drawer overlay, single-column grid |
| Tablet (`768px–1024px`) | Sidebar hidden by default (hamburger), 2-column stat grid |
| Desktop (`> 1024px`) | Persistent sidebar + main content, 4-column stat grid, 3-column chart row |

Tables on mobile hide non-essential columns (`Type`, `Date`) and maintain horizontal scroll for the remaining columns.

---

## Loading / Error / Empty States

| State | Implementation |
|---|---|
| Initial load | `app/dashboard/loading.tsx` — full skeleton (Next.js convention) |
| Suspense boundary | `<Suspense fallback={<skeletons />}>` wraps async data fetch |
| API error | Caught in `DashboardContent`, renders error UI with retry button |
| Period switch loading | Chart fades to 40% opacity while fetching new period data |
| Table filter loading | `useTransition` + `TableSkeleton` rows during API calls |
| Empty table | `EmptyActivity` component with context-aware message |

---

## Running Checks

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit

# Build (also type-checks)
npm run build
```
