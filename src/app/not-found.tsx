import Link from "next/link";
import { APP_ROUTES } from "@/config/navigation";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6 text-[var(--color-text-primary)]">
      <div className="max-w-md w-full border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center space-y-4">
        <p className="text-4xl font-extrabold text-[var(--color-accent)] font-mono">404</p>
        <h1 className="text-lg font-bold text-[var(--color-text-primary)]">Page Not Found</h1>
        <p className="text-xs text-[var(--color-text-secondary)]">
          The requested page could not be located. You can return directly to the dashboard.
        </p>
        <div className="pt-2">
          <Link
            href={APP_ROUTES.DASHBOARD}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white text-xs font-semibold hover:bg-[var(--color-accent-hover)] transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
