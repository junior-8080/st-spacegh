"use client";

import {
  Briefcase,
  Building2,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { apiFetch } from "@/lib/api-client";
import { WEBSITE_URL } from "@/lib/env";
import { cn } from "@/lib/format";
import type { ApiResponse, Stats } from "@/lib/types";

type NavItem = { href: string; label: string; icon: LucideIcon; badge?: boolean };

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/posts", label: "Blog Posts", icon: FileText },
  { href: "/dashboard/jobs", label: "Job Vacancies", icon: Briefcase },
  { href: "/dashboard/facilities", label: "Facilities", icon: Building2 },
  { href: "/dashboard/messages", label: "Messages", icon: Mail, badge: true },
];

type DashboardShellProps = { email: string; children: ReactNode };

export function DashboardShell({ email, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  // The drawer closes itself on navigation because it is tied to the path it was opened on.
  const sidebarOpen = openPath === pathname;

  useEffect(() => {
    const load = () =>
      apiFetch<ApiResponse<Stats>>("/api/admin/stats").then(
        (res) => setUnread(res.data.unreadMessages),
        () => undefined,
      );
    load();
    window.addEventListener("st:messages-changed", load);
    return () => window.removeEventListener("st:messages-changed", load);
  }, [pathname]);

  useEffect(() => {
    const onUnauthorized = () => router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    window.addEventListener("st:unauthorized", onUnauthorized);
    return () => window.removeEventListener("st:unauthorized", onUnauthorized);
  }, [router]);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/login");
    router.refresh();
  }

  const isActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-brand-offwhite">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpenPath(null)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-brand-black text-white transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-brand-graphite px-5">
          <Link href="/dashboard" aria-label="ST-SPACE admin home">
            <Logo variant="dark" subtitle="Admin Dashboard" />
          </Link>
          <button
            type="button"
            className="rounded p-1 text-brand-gray hover:text-white lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpenPath(null)}
          >
            <X className="size-5" />
          </button>
        </div>
        <nav aria-label="Dashboard" className="flex-1 space-y-1 px-3 py-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                isActive(item.href)
                  ? "bg-brand-charcoal text-brand-gold"
                  : "text-brand-gray hover:bg-brand-charcoal hover:text-white",
              )}
            >
              {isActive(item.href) && (
                <span aria-hidden className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-brand-gold" />
              )}
              <item.icon className="size-4.5" aria-hidden />
              <span className="flex-1">{item.label}</span>
              {item.badge && unread > 0 && (
                <span className="rounded-full bg-brand-gold px-2 py-0.5 text-xs font-bold text-brand-black">
                  {unread}
                  <span className="sr-only"> unread</span>
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="border-t border-brand-graphite p-3">
          <a
            href={WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-brand-gray transition hover:bg-brand-charcoal hover:text-white"
          >
            <ExternalLink className="size-4.5" aria-hidden />
            View Website ↗
          </a>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            className="rounded p-1.5 text-neutral-700 hover:bg-neutral-100 lg:hidden"
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
            onClick={() => setOpenPath(pathname)}
          >
            <Menu className="size-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-neutral-600 sm:inline">{email}</span>
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-60"
            >
              <LogOut className="size-4" aria-hidden />
              Logout
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
