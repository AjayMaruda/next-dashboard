"use client";

import { useState, useCallback, useTransition } from "react";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, InboxIcon } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { ActivityItem, TransactionStatus } from "@/types/dashboard";

// ─── Status Badge ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<TransactionStatus, string> = {
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  failed: "bg-red-400/10 text-red-400 border-red-400/20",
  cancelled: "bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] border-[var(--color-border-subtle)]",
};

function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

type SortField = "customer" | "amount" | "date";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
];

const PAGE_SIZE = 8;

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyActivity({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-[var(--color-surface-raised)] p-4 mb-4">
        <InboxIcon className="h-6 w-6 text-[var(--color-text-muted)]" aria-hidden />
      </div>
      <p className="font-medium text-[var(--color-text-primary)] mb-1">No transactions found</p>
      <p className="text-sm text-[var(--color-text-muted)] max-w-xs">
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "There are no transactions for the selected period."}
      </p>
    </div>
  );
}

// ─── Table Skeleton ──────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3.5 border-b border-[var(--color-border-subtle)]"
        >
          <div className="h-8 w-8 rounded-full bg-[var(--color-surface-raised)] shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-32 rounded bg-[var(--color-surface-raised)]" />
            <div className="h-3 w-24 rounded bg-[var(--color-surface-raised)]" />
          </div>
          <div className="h-3 w-20 rounded bg-[var(--color-surface-raised)]" />
          <div className="h-5 w-16 rounded-full bg-[var(--color-surface-raised)]" />
          <div className="h-3 w-14 rounded bg-[var(--color-surface-raised)]" />
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface ActivityTableProps {
  initialData: ActivityItem[];
  totalCount: number;
}

export function ActivityTable({ initialData, totalCount }: ActivityTableProps) {
  const [items, setItems] = useState<ActivityItem[]>(initialData);
  const [total, setTotal] = useState(totalCount);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasFilters = search !== "" || status !== "all";

  const fetchData = useCallback(
    async (params: { search: string; status: string; page: number }) => {
      const query = new URLSearchParams({
        search: params.search,
        status: params.status,
        page: String(params.page),
        limit: String(PAGE_SIZE),
      });
      const res = await fetch(`/api/dashboard/activity?${query}`);
      const json = await res.json();
      setItems(json.data);
      setTotal(json.meta.total);
    },
    []
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    startTransition(() => fetchData({ search: value, status, page: 1 }));
  };

  const handleStatus = (value: string) => {
    setStatus(value);
    setPage(1);
    startTransition(() => fetchData({ search, status: value, page: 1 }));
  };

  const handlePage = (p: number) => {
    setPage(p);
    startTransition(() => fetchData({ search, status, page: p }));
  };

  const handleSort = (field: SortField) => {
    const dir = sortField === field && sortDir === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDir(dir);
    // Client-side sort of current page
    setItems((prev) =>
      [...prev].sort((a, b) => {
        let av: string | number = a[field];
        let bv: string | number = b[field];
        if (field === "amount") { av = Number(av); bv = Number(bv); }
        return dir === "asc" ? (av < bv ? -1 : 1) : av > bv ? -1 : 1;
      })
    );
  };

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronUp className="h-3 w-3 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3 w-3 text-[var(--color-accent)]" />
    ) : (
      <ChevronDown className="h-3 w-3 text-[var(--color-accent)]" />
    );
  }

  return (
    <section className="card" aria-label="Recent transactions">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 border-b border-[var(--color-border-subtle)]">
        <div>
          <h2 className="font-semibold text-[var(--color-text-primary)]">Recent Transactions</h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            {total} transaction{total !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-muted)]" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search transactions..."
              className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] py-1.5 pl-8 pr-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] w-48 transition-colors"
              aria-label="Search transactions"
            />
          </div>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => handleStatus(e.target.value)}
            className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] py-1.5 pl-3 pr-7 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] cursor-pointer transition-colors"
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: "#0f172a" }}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isPending ? (
          <TableSkeleton />
        ) : items.length === 0 ? (
          <EmptyActivity hasFilters={hasFilters} />
        ) : (
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)]">
                {[
                  { label: "Customer", field: "customer" as SortField, cls: "pl-4 pr-3 py-3 text-left" },
                  { label: "Type", field: null, cls: "px-3 py-3 text-left hidden md:table-cell" },
                  { label: "Amount", field: "amount" as SortField, cls: "px-3 py-3 text-right" },
                  { label: "Status", field: null, cls: "px-3 py-3 text-left" },
                  { label: "Date", field: "date" as SortField, cls: "px-3 py-3 text-left hidden sm:table-cell pr-4" },
                ].map(({ label, field, cls }) => (
                  <th
                    key={label}
                    scope="col"
                    className={cn(
                      "text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide whitespace-nowrap",
                      cls,
                      field && "cursor-pointer select-none hover:text-[var(--color-text-secondary)] transition-colors"
                    )}
                    onClick={field ? () => handleSort(field) : undefined}
                    aria-sort={
                      field && sortField === field
                        ? sortDir === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                  >
                    <span className="inline-flex items-center gap-1">
                      {label}
                      {field && <SortIcon field={field} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item.id}
                  className={cn(
                    "border-b border-[var(--color-border-subtle)] transition-colors hover:bg-[var(--color-surface-raised)]",
                    idx === items.length - 1 && "border-b-0"
                  )}
                >
                  {/* Customer */}
                  <td className="pl-4 pr-3 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-600/30 flex items-center justify-center text-[10px] font-semibold text-[var(--color-accent)] shrink-0">
                        {item.customer.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[var(--color-text-primary)] truncate max-w-[120px]">
                          {item.customer}
                        </p>
                        <p className="text-[11px] text-[var(--color-text-muted)] truncate max-w-[120px]">
                          {item.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  {/* Type */}
                  <td className="px-3 py-3.5 text-[var(--color-text-secondary)] hidden md:table-cell">
                    {item.type}
                  </td>
                  {/* Amount */}
                  <td className="px-3 py-3.5 text-right font-medium tabular-nums whitespace-nowrap">
                    <span className={item.amount < 0 ? "text-[var(--color-negative)]" : "text-[var(--color-text-primary)]"}>
                      {item.amount < 0 ? "-" : ""}{formatCurrency(Math.abs(item.amount))}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>
                  {/* Date */}
                  <td className="px-3 py-3.5 text-[var(--color-text-muted)] whitespace-nowrap hidden sm:table-cell pr-4">
                    {item.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border-subtle)]">
          <p className="text-xs text-[var(--color-text-muted)]">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page === 1}
              className="rounded-md p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button
                  key={p}
                  onClick={() => handlePage(p)}
                  className={cn(
                    "h-7 w-7 rounded-md text-xs font-medium transition-colors",
                    page === p
                      ? "bg-[var(--color-accent)] text-white"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)]"
                  )}
                  aria-label={`Go to page ${p}`}
                  aria-current={page === p ? "page" : undefined}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => handlePage(page + 1)}
              disabled={page === totalPages}
              className="rounded-md p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export function ActivityTableSkeleton() {
  return (
    <div className="card">
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-subtle)]">
        <div className="space-y-1.5">
          <div className="h-4 w-36 rounded bg-[var(--color-surface-raised)]" />
          <div className="h-3 w-24 rounded bg-[var(--color-surface-raised)]" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-44 rounded-md bg-[var(--color-surface-raised)]" />
          <div className="h-8 w-28 rounded-md bg-[var(--color-surface-raised)]" />
        </div>
      </div>
      <TableSkeleton />
    </div>
  );
}
