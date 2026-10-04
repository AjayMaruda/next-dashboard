"use client";

import type { TrafficSource } from "@/types/dashboard";

interface ChannelMatrixProps {
  data: TrafficSource[];
}

export function ChannelMatrix({ data }: ChannelMatrixProps) {
  return (
    <section className="card p-4 sm:p-5 flex flex-col justify-between" aria-label="Channel Acquisition Matrix">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-[#b45309] inline-block shadow-[1px_1px_0px_#000]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">
            SECTION 03 // TRAFFIC CHANNELS
          </span>
        </div>
        <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">
          5 ACTIVE SOURCES
        </span>
      </div>

      {/* Multi-segment Stacked Distribution Bar */}
      <div className="mb-4">
        <div className="h-4 w-full flex border border-[var(--color-border)] shadow-[2px_2px_0px_rgba(0,0,0,0.06)] overflow-hidden">
          {data.map((item) => (
            <div
              key={item.source}
              className="h-full relative group transition-all"
              style={{
                width: `${item.value}%`,
                backgroundColor: item.color,
              }}
              title={`${item.source}: ${item.value}%`}
            />
          ))}
        </div>
      </div>

      {/* Ranked Channels List */}
      <ul className="space-y-2 mb-2" role="list">
        {data.map((item, idx) => (
          <li
            key={item.source}
            className="flex items-center justify-between gap-3 p-1.5 hover:bg-[var(--color-surface-raised)] border border-transparent hover:border-[var(--color-border)] transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-[10px] font-bold text-[var(--color-text-muted)] w-3">
                #{idx + 1}
              </span>
              <span
                className="h-2.5 w-2.5 shrink-0 shadow-[1px_1px_0px_#000]"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
              <span className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                {item.source}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="w-16 h-1.5 bg-[var(--color-surface-raised)] border border-[var(--color-border)] overflow-hidden hidden sm:block">
                <div
                  className="h-full"
                  style={{ width: `${item.value}%`, backgroundColor: item.color }}
                />
              </div>
              <span className="text-xs font-black text-[var(--color-text-primary)] tabular-nums w-8 text-right">
                {item.value}%
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)] font-semibold mt-2">
        <span>Highest Yield: Organic Search</span>
        <span className="text-[var(--color-accent)] font-bold">38% Lead</span>
      </div>
    </section>
  );
}

export function ChannelMatrixSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="h-4 w-32 bg-[var(--color-surface-raised)] mb-4" />
      <div className="h-4 w-full bg-[var(--color-surface-raised)] mb-4" />
      <div className="space-y-2">
        <div className="h-6 w-full bg-[var(--color-surface-raised)]" />
        <div className="h-6 w-full bg-[var(--color-surface-raised)]" />
        <div className="h-6 w-full bg-[var(--color-surface-raised)]" />
      </div>
    </div>
  );
}
