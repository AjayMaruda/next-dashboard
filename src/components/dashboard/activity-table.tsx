"use client";

import { useState, useCallback, useTransition } from "react";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, InboxIcon } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { ActivityItem, TransactionStatus } from "@/types/dashboard";

// ─── Status Badge ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<TransactionStatus, string> = {
  completed: "bg-emerald-50 text-emerald-800 border-emerald-600 shadow-[1px_1px_0px_#15803d]",
  pending: "bg-amber-50 text-amber-900 border-amber-600 shadow-[1px_1px_0px_#d97706]",
  failed: "bg-red-50 text-[var(--color-accent)] border-[var(--color-accent)] shadow-[1px_1px_0px_var(--color-accent)]",
  cancelled: "bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] border-[var(--color-border)] shadow-[1px_1px_0px_rgba(0,0,0,0.1)]",
};

function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
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
      <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] p-4 mb-4 shadow-[2px_2px_0px_rgba(0,0,0,0.08)]">
        <InboxIcon className="h-6 w-6 text-[var(--color-text-muted)]" aria-hidden />
      </div>
      <p className="font-bold text-[var(--color-text-primary)] mb-1">No transactions found</p>
      <p className="text-sm text-[var(--color-text-muted)] max-w-xs font-medium">
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
          <div className="h-8 w-8 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-32 bg-[var(--color-surface-raised)]" />
            <div className="h-3 w-24 bg-[var(--color-surface-raised)]" />
          </div>
          <div className="h-3 w-20 bg-[var(--color-surface-raised)]" />
          <div className="h-5 w-16 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]" />
          <div className="h-3 w-14 bg-[var(--color-surface-raised)]" />
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
      <ChevronUp className="h-3 w-3 text-[var(--color-accent)] stroke-[2.5]" />
    ) : (
      <ChevronDown className="h-3 w-3 text-[var(--color-accent)] stroke-[2.5]" />
    );
  }

  return (
    <section className="card" aria-label="Recent transactions">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-[var(--color-accent)] inline-block shadow-[1px_1px_0px_#000]" />
            <h2 className="font-bold text-base text-[var(--color-text-primary)] uppercase tracking-tight">Recent Activity</h2>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">
            Verified ledger of latest transactions ({total} recorded)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:ml-auto w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-muted)]" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Filter by customer..."
              className="w-full sm:w-52 border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-8 pr-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] shadow-[2px_2px_0px_rgba(0,0,0,0.06)] focus:border-[var(--color-accent)] focus:outline-none focus:shadow-[3px_3px_0px_rgba(155,28,28,0.25)] transition-all"
              aria-label="Search transactions"
            />
          </div>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => handleStatus(e.target.value)}
            className="border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-3 pr-7 text-sm font-medium text-[var(--color-text-primary)] shadow-[2px_2px_0px_rgba(0,0,0,0.06)] focus:border-[var(--color-accent)] focus:outline-none focus:shadow-[3px_3px_0px_rgba(155,28,28,0.25)] cursor-pointer transition-all"
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
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
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]">
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
                      "text-[11px] font-bold text-[var(--color-text-primary)] uppercase tracking-wider whitespace-nowrap",
                      cls,
                      field && "cursor-pointer select-none hover:text-[var(--color-accent)] transition-colors"
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
                    <span className="inline-flex items-center gap-1.5">
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
                    "border-b border-[var(--color-border-subtle)] transition-colors hover:bg-[var(--color-surface-raised)]/70",
                    idx === items.length - 1 && "border-b-0"
                  )}
                >
                  {/* Customer */}
                  <td className="pl-4 pr-3 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 bg-[var(--color-accent-subtle)] border border-[var(--color-accent)] flex items-center justify-center text-[10px] font-bold text-[var(--color-accent)] shadow-[1px_1px_0px_rgba(155,28,28,0.25)] shrink-0">
                        {item.customer.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[var(--color-text-primary)] truncate max-w-[130px]">
                          {item.customer}
                        </p>
                        <p className="text-[11px] text-[var(--color-text-muted)] truncate max-w-[130px]">
                          {item.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  {/* Type */}
                  <td className="px-3 py-3.5 text-xs font-semibold text-[var(--color-text-secondary)] hidden md:table-cell uppercase tracking-wide">
                    {item.type}
                  </td>
                  {/* Amount */}
                  <td className="px-3 py-3.5 text-right font-bold tabular-nums whitespace-nowrap">
                    <span className={item.amount < 0 ? "text-[var(--color-negative)] font-extrabold" : "text-[var(--color-text-primary)]"}>
                      {item.amount < 0 ? "-" : ""}{formatCurrency(Math.abs(item.amount))}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>
                  {/* Date */}
                  <td className="px-3 py-3.5 text-xs font-medium text-[var(--color-text-muted)] whitespace-nowrap hidden sm:table-cell pr-4">
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
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            Showing Page <span className="text-[var(--color-text-primary)]">{page}</span> of {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page === 1}
              className="p-1.5 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] shadow-[1px_1px_0px_rgba(0,0,0,0.06)] hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              const isCurrent = page === p;
              return (
                <button
                  key={p}
                  onClick={() => handlePage(p)}
                  className={cn(
                    "h-7 w-7 text-xs font-bold transition-all",
                    isCurrent
                      ? "bg-[var(--color-accent)] text-white border border-[var(--color-accent-hover)] shadow-[2px_2px_0px_#0a0a0a]"
                      : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] shadow-[1px_1px_0px_rgba(0,0,0,0.06)] hover:bg-[var(--color-surface-raised)] hover:text-black"
                  )}
                  aria-label={`Go to page ${p}`}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => handlePage(page + 1)}
              disabled={page === totalPages}
              className="p-1.5 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] shadow-[1px_1px_0px_rgba(0,0,0,0.06)] hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        <div className="space-y-1.5">
          <div className="h-4 w-36 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]" />
          <div className="h-3 w-24 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-44 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]" />
          <div className="h-8 w-28 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]" />
        </div>
      </div>
      <TableSkeleton />
    </div>
  );
}
