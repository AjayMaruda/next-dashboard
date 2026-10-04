"use client";

import type { TrafficSource } from "@/types/dashboard";
import { Compass } from "lucide-react";
import { SITE_CONTENT } from "@/config/site-content";

interface TrafficChartProps {
  data: TrafficSource[];
}

export function TrafficChart({ data }: TrafficChartProps) {
  const content = SITE_CONTENT.trafficChart;
  const topSource = data.reduce((max, s) => (s.value > max.value ? s : max), data[0]);

  return (
    <section
      className="card p-4 sm:p-5 flex flex-col justify-between h-full"
      aria-label={content.chartAriaLabel}
    >
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[var(--color-accent)]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              {content.title}
            </h2>
          </div>
          <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider bg-[var(--color-surface-raised)] px-2 py-0.5 border border-[var(--color-border)]">
            {data.length} {content.channelsSuffix}
          </span>
        </div>

        <p className="text-xs text-[var(--color-text-muted)] font-medium mb-3">
          {content.subtitle}
        </p>

        <div className="mb-4">
          <div className="h-3 w-full flex border border-[var(--color-border)] overflow-hidden gap-[1px] bg-[var(--color-border)]">
            {data.map((item) => (
              <div
                key={item.source}
                className="h-full transition-all hover:opacity-85 cursor-pointer"
                style={{
                  width: `${item.value}%`,
                  backgroundColor: item.color,
                }}
                title={`${item.source}: ${item.value}%`}
              />
            ))}
          </div>
        </div>

        <ul className="space-y-2.5" role="list">
          {data.map((item) => (
            <li
              key={item.source}
              className="flex items-center justify-between gap-3 text-xs p-1.5 hover:bg-[var(--color-surface-subtle)] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="h-2 w-2 shrink-0"
                  style={{ backgroundColor: item.color }}
                  aria-hidden
                />
                <span className="font-semibold text-[var(--color-text-secondary)] truncate">
                  {item.source}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="w-20 h-1.5 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] overflow-hidden hidden sm:block">
                  <div
                    className="h-full transition-all"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
                <span className="font-bold text-[var(--color-text-primary)] tabular-nums w-8 text-right">
                  {item.value}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-3 mt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)] font-medium">
        <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
          <Compass className="h-3 w-3 text-[var(--color-accent)]" />
          {content.primaryLabel}{" "}
          <strong className="text-[var(--color-text-primary)] font-bold">{topSource.source}</strong> (
          {topSource.value}%)
        </span>
        <span className="text-[10px] uppercase font-bold text-[var(--color-accent)] tracking-wider">
          {content.dominantBadge}
        </span>
      </div>
    </section>
  );
}

export function TrafficChartSkeleton() {
  return (
    <div className="card p-4 sm:p-5 flex flex-col justify-between h-full animate-pulse">
      <div>
        <div className="flex justify-between items-center pb-3 mb-3 border-b border-[var(--color-border-subtle)]">
          <div className="h-4 w-32 bg-[var(--color-surface-raised)]" />
          <div className="h-4 w-16 bg-[var(--color-surface-raised)]" />
        </div>
        <div className="h-3 w-48 bg-[var(--color-surface-raised)] mb-3" />
        <div className="h-3 w-full bg-[var(--color-surface-raised)] mb-4" />
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center p-1.5">
              <div className="h-3 w-24 bg-[var(--color-surface-raised)]" />
              <div className="h-3 w-8 bg-[var(--color-surface-raised)]" />
            </div>
          ))}
        </div>
      </div>
      <div className="pt-3 mt-3 border-t border-[var(--color-border-subtle)] flex justify-between">
        <div className="h-3 w-28 bg-[var(--color-surface-raised)]" />
        <div className="h-3 w-16 bg-[var(--color-surface-raised)]" />
      </div>
    </div>
  );
}
