import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";

export type NavItem<K extends string> = { key: K; label: string; icon: LucideIcon; badge?: number | string | undefined };

/** Shared dashboard frame: dark sidebar (drawer on small screens) + content area. */
export function DashboardShell<K extends string>({ eyebrow, title, identity, items, active, onSelect, onSignOut, footer, children }: {
  eyebrow: string; title: string; identity?: ReactNode; items: NavItem<K>[]; active: K;
  onSelect: (k: K) => void; onSignOut: () => void; footer?: ReactNode; children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const current = items.find(i => i.key === active);
  const nav = <nav aria-label={`${title} sections`} className="grid gap-1">
    {items.map(({ key, label, icon: I, badge }) => {
      const on = key === active;
      return <button key={key} type="button" aria-current={on ? "page" : undefined}
        onClick={() => { onSelect(key); setOpen(false); }}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${on ? "bg-pitch-foreground/10 text-pitch-foreground" : "text-pitch-muted hover:bg-pitch-foreground/5 hover:text-pitch-foreground"}`}>
        <span className={`h-5 w-0.5 rounded-full ${on ? "bg-pitch-accent" : "bg-transparent"}`} aria-hidden />
        <I aria-hidden className={`h-4 w-4 ${on ? "text-pitch-accent" : ""}`} />
        <span className="flex-1">{label}</span>
        {badge !== undefined && badge !== 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{badge}</span>}
      </button>;
    })}
  </nav>;

  const panel = <div className="flex h-full flex-col gap-8 p-5">
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-pitch-muted">{eyebrow}</p>
      <p className="mt-1 font-serif text-2xl">{title} <span className="text-pitch-accent">·</span> studio room</p>
    </div>
    {identity && <div className="rounded-xl border border-pitch-foreground/10 bg-pitch-foreground/5 p-4">{identity}</div>}
    {nav}
    <div className="mt-auto grid gap-3 border-t border-pitch-foreground/10 pt-5">
      {footer}
      <button type="button" onClick={onSignOut} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-pitch-muted hover:bg-pitch-foreground/5 hover:text-pitch-foreground">
        <LogOut aria-hidden className="h-4 w-4" />Sign out</button>
      <Link to="/" className="px-3 text-xs text-pitch-muted underline-offset-4 hover:underline">Back to website</Link>
    </div>
  </div>;

  return <div className="mx-auto max-w-[1500px] px-3 py-6 sm:px-5">
    <div className="grid min-h-[80vh] overflow-hidden rounded-lg border bg-background lg:grid-cols-[248px_1fr]">
      <aside className="hidden bg-pitch text-pitch-foreground lg:block">
        <div className="sticky top-0">{panel}</div>
      </aside>
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3 border-b bg-pitch px-4 py-3 text-pitch-foreground lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-md p-2 hover:bg-pitch-foreground/10"><Menu className="h-5 w-5" /></button>
          <p className="text-sm font-medium">{current?.label}</p>
          <span className="w-9" />
        </div>
        <main className="p-5 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
    {open && <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-pitch/60" />
      <div className="absolute inset-y-0 left-0 w-[280px] overflow-y-auto bg-pitch text-pitch-foreground shadow-2xl">
        <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-3 rounded-md p-2 hover:bg-pitch-foreground/10"><X className="h-5 w-5" /></button>
        {panel}
      </div>
    </div>}
  </div>;
}

export function SectionHeader({ eyebrow, title, text, action }: { eyebrow: string; title: string; text?: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b pb-6">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">{title}</h1>
      {text && <p className="mt-2 max-w-[60ch] text-muted-foreground">{text}</p>}
    </div>
    {action}
  </div>;
}

export function StatCard({ label, value, hint, icon: I }: { label: string; value: ReactNode; hint?: string | undefined; icon: LucideIcon }) {
  return <div className="border-t border-foreground/15 pt-5">
    <div className="flex items-center justify-between gap-2"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <I aria-hidden className="h-4 w-4 shrink-0 text-brass" /></div>
    <p className="mt-3 font-serif text-4xl leading-none sm:text-5xl">{value}</p>
    {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
  </div>;
}
