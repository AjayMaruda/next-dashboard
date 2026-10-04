"use client";

import { useState, useCallback, useTransition } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  InboxIcon,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type {
  ActivityItem,
  TransactionStatus,
  SortField,
  SortDir,
} from "@/types/dashboard";
import { SITE_CONTENT } from "@/config/site-content";

const STATUS_STYLES: Record<TransactionStatus, string> = {
  completed: "bg-emerald-50 text-emerald-800 border-emerald-300",
  pending: "bg-amber-50 text-amber-900 border-amber-300",
  failed: "bg-red-50 text-[var(--color-accent)] border-red-300",
  cancelled:
    "bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] border-[var(--color-border)]",
};

function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

const PAGE_SIZE_OPTIONS = [5, 10, 15];

function EmptyActivity({ hasFilters }: { hasFilters: boolean }) {
  const content = SITE_CONTENT.activityTable.empty;
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] p-3 mb-3">
        <InboxIcon
          className="h-5 w-5 text-[var(--color-text-muted)]"
          aria-hidden
        />
      </div>
      <p className="font-bold text-[var(--color-text-primary)] text-sm mb-1">
        {content.title}
      </p>
      <p className="text-xs text-[var(--color-text-muted)] max-w-xs font-medium">
        {hasFilters ? content.filteredDescription : content.defaultDescription}
      </p>
    </div>
  );
}

function TableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="animate-pulse min-w-[620px]">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3 border-b border-[var(--color-border-subtle)]"
        >
          <div className="h-6 w-6 bg-[var(--color-surface-raised)] shrink-0" />
          <div className="w-44 space-y-1.5 shrink-0">
            <div className="h-3 w-32 bg-[var(--color-surface-raised)]" />
            <div className="h-2.5 w-24 bg-[var(--color-surface-raised)]" />
          </div>
          <div className="h-3 w-24 bg-[var(--color-surface-raised)] shrink-0" />
          <div className="h-3 w-20 bg-[var(--color-surface-raised)] shrink-0" />
          <div className="h-5 w-20 bg-[var(--color-surface-raised)] shrink-0" />
          <div className="h-3 w-16 bg-[var(--color-surface-raised)] shrink-0" />
        </div>
      ))}
    </div>
  );
}

interface ActivityTableProps {
  initialData: ActivityItem[];
  totalCount: number;
  initialSortField?: SortField;
  initialSortDir?: SortDir;
}

export function ActivityTable({
  initialData,
  totalCount,
  initialSortField = "date",
  initialSortDir = "desc",
}: ActivityTableProps) {
  const content = SITE_CONTENT.activityTable;
  const [items, setItems] = useState<ActivityItem[]>(initialData);
  const [total, setTotal] = useState(totalCount);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState<SortField>(initialSortField);
  const [sortDir, setSortDir] = useState<SortDir>(initialSortDir);
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasFilters = search !== "" || status !== "all";

  const fetchData = useCallback(
    async (params: {
      search: string;
      status: string;
      page: number;
      limit?: number;
      sortField?: SortField;
      sortDir?: SortDir;
    }) => {
      const currentLimit = params.limit ?? pageSize;
      const currentSortField = params.sortField ?? sortField;
      const currentSortDir = params.sortDir ?? sortDir;

      const query = new URLSearchParams({
        search: params.search,
        status: params.status,
        page: String(params.page),
        limit: String(currentLimit),
        sortField: currentSortField,
        sortDir: currentSortDir,
      });
      const res = await fetch(`/api/dashboard/activity?${query}`);
      const json = await res.json();
      setItems(json.data);
      setTotal(json.meta.total);
    },
    [pageSize, sortField, sortDir],
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    startTransition(() =>
      fetchData({ search: value, status, page: 1, limit: pageSize, sortField, sortDir }),
    );
  };

  const handleStatus = (value: string) => {
    setStatus(value);
    setPage(1);
    startTransition(() =>
      fetchData({ search, status: value, page: 1, limit: pageSize, sortField, sortDir }),
    );
  };

  const handlePageSize = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
    startTransition(() =>
      fetchData({ search, status, page: 1, limit: newSize, sortField, sortDir }),
    );
  };

  const handlePage = (p: number) => {
    setPage(p);
    startTransition(() =>
      fetchData({ search, status, page: p, limit: pageSize, sortField, sortDir }),
    );
  };

  const handleSort = (field: SortField) => {
    const dir = sortField === field && sortDir === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDir(dir);
    setPage(1);

    startTransition(() =>
      fetchData({
        search,
        status,
        page: 1,
        limit: pageSize,
        sortField: field,
        sortDir: dir,
      }),
    );

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("sortField", field);
      url.searchParams.set("sortDir", dir);
      window.history.replaceState(null, "", url.toString());
    }
  };

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field)
      return <ChevronUp className="h-3 w-3 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3 w-3 text-[var(--color-accent)] stroke-[2.5]" />
    ) : (
      <ChevronDown className="h-3 w-3 text-[var(--color-accent)] stroke-[2.5]" />
    );
  }

  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const columns = [
    {
      label: content.columns.customer,
      field: "customer" as SortField,
      cls: "pl-4 pr-3 py-2.5 text-left min-w-[190px]",
    },
    {
      label: content.columns.type,
      field: null,
      cls: "px-3 py-2.5 text-left min-w-[110px]",
    },
    {
      label: content.columns.amount,
      field: "amount" as SortField,
      cls: "px-3 py-2.5 text-right min-w-[100px]",
    },
    {
      label: content.columns.status,
      field: null,
      cls: "px-3 py-2.5 text-left min-w-[110px]",
    },
    {
      label: content.columns.date,
      field: "date" as SortField,
      cls: "px-3 py-2.5 text-left pr-4 min-w-[90px]",
    },
  ];

  return (
    <section
      className="card flex flex-col w-full min-w-0 max-w-full overflow-hidden transition-all duration-200"
      aria-label={content.sectionAriaLabel}
    >
      <div className="p-3.5 sm:p-4 border-b border-[var(--color-border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[var(--color-accent)]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              {content.title}
            </h2>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] font-medium mt-0.5">
            {content.subtitle(total)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs">
            <label
              htmlFor="status-filter"
              className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:inline"
            >
              {content.filterStatusLabel}
            </label>
            <select
              id="status-filter"
              value={status}
              onChange={(e) => handleStatus(e.target.value)}
              className="border border-[var(--color-border)] bg-[var(--color-surface)] py-1 px-2.5 text-xs font-semibold text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none transition-colors cursor-pointer"
              aria-label={content.filterStatusAriaLabel}
            >
              {content.statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <label
              htmlFor="limit-filter"
              className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:inline"
            >
              {content.filterLimitLabel}
            </label>
            <select
              id="limit-filter"
              value={pageSize}
              onChange={(e) => handlePageSize(Number(e.target.value))}
              className="border border-[var(--color-border)] bg-[var(--color-surface)] py-1 px-2 text-xs font-semibold text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none transition-colors cursor-pointer"
              aria-label={content.filterLimitAriaLabel}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} {content.pageSizeSuffix}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 sm:flex-initial">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-muted)]"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={content.searchPlaceholder}
              className="border border-[var(--color-border)] bg-[var(--color-surface)] py-1 pl-8 pr-3 text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none w-full sm:w-44 transition-colors"
              aria-label={content.searchAriaLabel}
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto min-w-0 [scrollbar-width:thin] touch-pan-x">
        {isPending ? (
          <TableSkeleton count={pageSize} />
        ) : items.length === 0 ? (
          <EmptyActivity hasFilters={hasFilters} />
        ) : (
          <table className="w-full min-w-[620px] text-xs text-left" role="table">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]">
                {columns.map(({ label, field, cls }) => (
                  <th
                    key={label}
                    scope="col"
                    className={cn(
                      "text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider whitespace-nowrap",
                      cls,
                      field &&
                        "cursor-pointer select-none hover:text-[var(--color-text-primary)] transition-colors",
                    )}
                    onClick={field ? () => handleSort(field) : undefined}
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
                    "border-b border-[var(--color-border-subtle)] transition-colors hover:bg-[var(--color-surface-raised)]/60",
                    idx === items.length - 1 && "border-b-0",
                  )}
                >
                  <td className="pl-4 pr-3 py-2.5 whitespace-nowrap min-w-[190px]">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-red-50 border border-red-200 flex items-center justify-center text-[9px] font-bold text-[var(--color-accent)] shrink-0">
                        {item.customer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--color-text-primary)] truncate max-w-[130px]">
                          {item.customer}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-muted)] truncate max-w-[130px]">
                          {item.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[var(--color-text-secondary)] font-medium whitespace-nowrap min-w-[110px]">
                    {item.type}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold tabular-nums whitespace-nowrap min-w-[100px]">
                    <span
                      className={
                        item.amount < 0
                          ? "text-[var(--color-negative)]"
                          : "text-[var(--color-text-primary)]"
                      }
                    >
                      {item.amount < 0 ? "-" : ""}
                      {formatCurrency(Math.abs(item.amount))}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap min-w-[110px]">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-3 py-2.5 text-[var(--color-text-muted)] whitespace-nowrap pr-4 font-medium min-w-[90px]">
                    {item.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 border-t border-[var(--color-border-subtle)] text-xs">
        <p className="text-[11px] text-[var(--color-text-muted)] font-medium text-center sm:text-left">
          {content.pagination.showing}{" "}
          <strong className="text-[var(--color-text-primary)]">
            {startItem}–{endItem}
          </strong>{" "}
          {content.pagination.of}{" "}
          <strong className="text-[var(--color-text-primary)]">{total}</strong>
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page === 1}
              className="p-1 border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label={content.pagination.prevAriaLabel}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p =
                totalPages <= 5
                  ? i + 1
                  : Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              const isCurrent = page === p;
              return (
                <button
                  key={p}
                  onClick={() => handlePage(p)}
                  className={cn(
                    "h-6 w-6 text-xs font-semibold transition-all",
                    isCurrent
                      ? "bg-[var(--color-accent)] text-white border border-[var(--color-accent-hover)] font-bold shadow-[1px_1px_0px_rgba(0,0,0,0.15)]"
                      : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)]",
                  )}
                  aria-label={content.pagination.goToPageAriaLabel(p)}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => handlePage(page + 1)}
              disabled={page === totalPages}
              className="p-1 border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label={content.pagination.nextAriaLabel}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export function ActivityTableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="card flex flex-col w-full min-w-0 max-w-full overflow-hidden animate-pulse">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 border-b border-[var(--color-border-subtle)] gap-3">
        <div className="space-y-1.5">
          <div className="h-4 w-32 bg-[var(--color-surface-raised)]" />
          <div className="h-3 w-48 bg-[var(--color-surface-raised)]" />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="h-7 w-24 bg-[var(--color-surface-raised)]" />
          <div className="h-7 w-20 bg-[var(--color-surface-raised)]" />
          <div className="h-7 flex-1 sm:w-32 bg-[var(--color-surface-raised)]" />
        </div>
      </div>
      <div className="w-full overflow-x-auto min-w-0">
        <TableSkeleton count={count} />
      </div>
    </div>
  );
}
