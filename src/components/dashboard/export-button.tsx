"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";
import { toast } from "sonner";
import { SITE_CONTENT } from "@/config/site-content";

export function ExportButton() {
  const [downloaded, setDownloaded] = useState(false);
  const config = SITE_CONTENT.dashboardHeader.exportButton;

  const handleExport = () => {
    toast.success(config.toastTitle, {
      description: config.toastDescription,
    });
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="btn-sharp inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--color-accent)] text-white text-xs font-bold border border-[var(--color-accent-hover)] cursor-pointer transition-all"
      aria-label={config.ariaLabel}
    >
      {downloaded ? (
        <Check className="h-3.5 w-3.5 text-emerald-300" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
      <span>{downloaded ? config.exportedLabel : config.label}</span>
    </button>
  );
}
