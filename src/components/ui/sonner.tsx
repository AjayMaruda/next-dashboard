"use client";

import { Toaster as Sonner } from "sonner";
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  AlertCircle,
  Loader2,
} from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: (
          <CheckCircle2 className="h-4 w-4 text-[var(--color-positive)] shrink-0" />
        ),
        info: <Info className="h-4 w-4 text-[var(--color-accent)] shrink-0" />,
        warning: <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />,
        error: (
          <AlertCircle className="h-4 w-4 text-[var(--color-negative)] shrink-0" />
        ),
        loading: (
          <Loader2 className="h-4 w-4 animate-spin text-[var(--color-accent)] shrink-0" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--color-surface, #ffffff)",
          "--normal-border": "var(--color-border, #e3dbd0)",
          "--normal-text": "var(--color-text-primary, #121110)",
          "--border-radius": "0px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[var(--color-surface)] group-[.toaster]:text-[var(--color-text-primary)] group-[.toaster]:border-[var(--color-border)] group-[.toaster]:shadow-[3px_3px_0px_0px_rgba(18,17,16,0.14)] group-[.toaster]:font-sans group-[.toaster]:text-xs group-[.toaster]:rounded-none group-[.toaster]:border group-[.toaster]:p-3.5 group-[.toaster]:gap-3",
          title:
            "group-[.toast]:text-[var(--color-text-primary)] group-[.toast]:font-semibold group-[.toast]:text-xs group-[.toast]:tracking-tight",
          description:
            "group-[.toast]:text-[var(--color-text-secondary)] group-[.toast]:font-sans group-[.toast]:text-[11px] group-[.toast]:leading-relaxed",
          actionButton:
            "group-[.toast]:bg-[var(--color-accent)] group-[.toast]:text-white group-[.toast]:border group-[.toast]:border-[var(--color-accent-hover)] group-[.toast]:rounded-none group-[.toast]:shadow-[2px_2px_0px_0px_rgba(18,17,16,0.85)] group-[.toast]:font-semibold group-[.toast]:text-xs group-[.toast]:px-2.5 group-[.toast]:py-1.5 group-[.toast]:hover:bg-[var(--color-accent-hover)] group-[.toast]:transition-all group-[.toast]:cursor-pointer",
          cancelButton:
            "group-[.toast]:bg-[var(--color-surface-raised)] group-[.toast]:text-[var(--color-text-secondary)] group-[.toast]:border group-[.toast]:border-[var(--color-border)] group-[.toast]:rounded-none group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:px-2.5 group-[.toast]:py-1.5 group-[.toast]:hover:bg-[var(--color-border-subtle)] group-[.toast]:hover:text-[var(--color-text-primary)] group-[.toast]:transition-all group-[.toast]:cursor-pointer",
          closeButton:
            "group-[.toast]:bg-[var(--color-surface)] group-[.toast]:text-[var(--color-text-muted)] group-[.toast]:border group-[.toast]:border-[var(--color-border)] group-[.toast]:rounded-none group-[.toast]:hover:text-[var(--color-text-primary)] group-[.toast]:hover:bg-[var(--color-surface-raised)] group-[.toast]:transition-colors",
          info: "group-[.toaster]:border-l-[3px] group-[.toaster]:border-l-[var(--color-accent)]",
          success:
            "group-[.toaster]:border-l-[3px] group-[.toaster]:border-l-[var(--color-positive)]",
          warning:
            "group-[.toaster]:border-l-[3px] group-[.toaster]:border-l-amber-600",
          error:
            "group-[.toaster]:border-l-[3px] group-[.toaster]:border-l-[var(--color-negative)]",
        },
      }}
      {...props}
    />
  );
}
