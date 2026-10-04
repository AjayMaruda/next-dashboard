export const SITE_CONTENT = {
  brand: {
    name: "Analytics",
    tagline: "Analytics & Insights",
    logoAlt: "Analytics Platform Logo",
  },
  user: {
    name: "Ajay Maruda",
    email: "ajay@gmail.io",
    initials: "AJ",
  },
  topNav: {
    title: "Dashboard",
    searchPlaceholder: "Search metrics, orders, customers...",
    searchAriaLabel: "Global search",
    liveMetricsBadge: "LIVE METRICS",
    notificationsAriaLabel: "Notifications",
    menuOpenAriaLabel: "Open navigation menu",
    menuCloseAriaLabel: "Close sidebar",
    telemetryToast: {
      title: "System Telemetry",
      description:
        "All services operating within normal latency parameters. 0 dropped webhooks.",
    },
    queryToast: {
      title: "Global Query",
      description: (query: string) =>
        `Filtered across platform records for "${query}"`,
    },
  },
  dashboardHeader: {
    title: "Overview",
    liveBadge: "Live Cockpit",
    subtitle:
      "Real-time metrics, financial trajectory, and recent transactions.",
    exportButton: {
      label: "Export",
      exportedLabel: "Exported",
      ariaLabel: "Export platform summary",
      toastTitle: "Export Complete",
      toastDescription:
        "Platform telemetry and metrics snapshot exported successfully.",
    },
  },
  executiveTicker: {
    sectionAriaLabel: "Executive Vital Telemetry",
    targetTitle: "Q4 TARGET PROGRESS",
    remainingSuffix: "remaining to target",
    runRateLabel: "RUN RATE",
    runRateUnit: "/day",
    avgOrderLabel: "AVG ORDER",
    netRetentionLabel: "NET RETENTION",
    healthLabel: "HEALTH",
    healthValue: "99.98%",
  },
  statsGrid: {
    sectionAriaLabel: "Core Performance Indicators",
    loadingAriaLabel: "Loading key performance indicators",
    revenue: {
      label: "Total Revenue",
      badge: "Pacing",
      subtextSuffix: "of ₹300k Q4 goal",
    },
    users: {
      label: "Active Users",
      badge: "Accounts",
      subtextSuffix: "vs prior period",
    },
    orders: {
      label: "Total Orders",
      badge: "Orders",
      subtextSuffix: "checkout velocity",
    },
    conversion: {
      label: "Conversion Rate",
      badge: "Benchmark",
      benchmarkExceeds: "Exceeds 3.2% benchmark",
      benchmarkUnder: "Under 3.2% benchmark",
    },
    defaultSubtext: "vs. previous 30-day window",
    defaultBadgeText: "Active",
  },
  revenueChart: {
    title: "Revenue Performance Trajectory",
    subtitle: "Gross transactional volume and checkout velocity",
    timeframeAriaLabel: "Select timeframe",
    chartAriaLabel: "Revenue over time chart",
    liveSync: "Live synchronization",
    dailyAvg: "Daily Avg:",
    peak: "Peak:",
    floor: "Floor:",
    ordersSuffix: "orders placed",
    periods: [
      { label: "7D", value: "7d" },
      { label: "30D", value: "30d" },
      { label: "90D", value: "90d" },
      { label: "1Y", value: "1y" },
    ] as const,
  },
  trafficChart: {
    title: "Acquisition Channels",
    subtitle: "Session volume distribution across primary acquisition routes.",
    chartAriaLabel: "Traffic acquisition sources",
    channelsSuffix: "Channels",
    primaryLabel: "Primary:",
    dominantBadge: "Dominant",
  },
  activityFeed: {
    stream: {
      title: "Live Event Stream",
      badge: "Receiving",
      subtitle: "Real-time webhook events and customer transaction telemetry.",
      streamStatus: "Continuous stream",
      ingestLatencyPrefix: "Ingest Latency:",
    },
    utilities: {
      title: "Operational Utilities",
      badge: "Quick Actions",
      subtitle:
        "Administrative exports, automated statements, and webhook pipeline controls.",
      generateStatement: {
        label: "Generate Monthly Statement",
        toastTitle: "Statement Generated",
        toastDescription: (volume: string) =>
          `Monthly financial statement ready (${volume} gross volume)`,
      },
      exportAuditLog: {
        label: "Export Full Audit Log (.CSV)",
        toastTitle: "Audit Log Exported",
        toastDescription: (count: number) =>
          `${count} transactions exported to audit-log.csv`,
      },
      syncGateways: {
        label: "Sync External Payment Gateways",
        syncingLabel: "Synchronizing Gateways...",
        toastSyncingTitle: "Syncing Gateways",
        toastSyncingDescription:
          "Initiating handshake with payment webhooks...",
        toastSuccessTitle: "Gateways Synchronized",
        toastSuccessDescription: "Telemetry handshake completed (200 OK)",
      },
      syncedPrefix: "Synced:",
      justNow: "Just now",
      todayAt: (time: string) => `Today at ${time}`,
      nodeLabel: "Node: US-East-1",
    },
  },
  activityTable: {
    title: "Recent Transactions",
    subtitle: (count: number) =>
      `${count} verified transaction${count !== 1 ? "s" : ""} recorded`,
    sectionAriaLabel: "Recent transactions ledger",
    filterStatusLabel: "Status:",
    filterStatusAriaLabel: "Filter transactions by status",
    filterLimitLabel: "Show:",
    filterLimitAriaLabel: "Select items per page",
    searchPlaceholder: "Search customer...",
    searchAriaLabel: "Search transactions",
    pageSizeSuffix: "/ page",
    statusOptions: [
      { label: "All Statuses", value: "all" },
      { label: "Completed", value: "completed" },
      { label: "Pending", value: "pending" },
      { label: "Failed", value: "failed" },
      { label: "Cancelled", value: "cancelled" },
    ],
    columns: {
      customer: "Customer",
      type: "Type",
      amount: "Amount",
      status: "Status",
      date: "Date",
    },
    empty: {
      title: "No transactions found",
      filteredDescription:
        "Try adjusting your search query, status filter, or page size.",
      defaultDescription: "There are no transactions recorded for this period.",
    },
    pagination: {
      showing: "Showing",
      of: "of",
      prevAriaLabel: "Previous page",
      nextAriaLabel: "Next page",
      goToPageAriaLabel: (page: number) => `Go to page ${page}`,
    },
  },
  error: {
    title: "Unable to load dashboard data",
    description:
      "Something went wrong while retrieving platform metrics. Please try again.",
    retryButton: "Retry Connection",
  },
  metadata: {
    title: "Analytics Dashboard — Analytics & Insights",
    description:
      "Modern SaaS analytics dashboard. Monitor revenue, users, conversions and activity in real time.",
  },
} as const;
