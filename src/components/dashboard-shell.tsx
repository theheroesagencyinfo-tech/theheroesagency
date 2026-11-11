import { PortalMark } from "@/components/site";
import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LogOut, Menu, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
      return <Button variant="ghost" key={key} type="button" aria-current={on ? "page" : undefined}
        onClick={() => { onSelect(key); setOpen(false); }}
        className={`group flex h-auto justify-start gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium hover:bg-pitch-foreground/10 hover:text-pitch-foreground ${on ? "bg-pitch-foreground/10 text-pitch-foreground" : "text-pitch-muted"}`}>
        <span className={`h-5 w-0.5 rounded-full ${on ? "bg-pitch-accent" : "bg-transparent"}`} aria-hidden />
        <I aria-hidden className={`h-4 w-4 ${on ? "text-pitch-accent" : ""}`} />
        <span className="flex-1">{label}</span>
        {badge !== undefined && badge !== 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{badge}</span>}
      </Button>;
    })}
  </nav>;

  const panel = <div className="flex h-full flex-col gap-8 p-5">
    <div>
      <Link to="/" aria-label="TheHeroes Agency home"><PortalMark className="mb-6" /></Link>
      <p className="mt-1 font-serif text-2xl">{title} <span className="text-pitch-accent">·</span> studio room</p>
    </div>
    {identity && <div className="rounded-xl border border-pitch-foreground/10 bg-pitch-foreground/5 p-4">{identity}</div>}
    {nav}
    <div className="mt-auto grid gap-3 border-t border-pitch-foreground/10 pt-5">
      {footer}
      <Button variant="ghost" type="button" onClick={onSignOut} className="justify-start gap-3 px-3 py-2 text-sm text-pitch-muted hover:bg-pitch-foreground/5 hover:text-pitch-foreground">
        <LogOut aria-hidden className="h-4 w-4" />Sign out</Button>
      <Link to="/" className="px-3 text-xs text-pitch-muted underline-offset-4 hover:underline">Back to website</Link>
    </div>
  </div>;

  return <div className="portal mx-auto max-w-[1500px] px-3 py-6 sm:px-5">
    <div className="grid min-h-[720px] overflow-clip rounded-lg border shadow-sm bg-background lg:grid-cols-[248px_1fr]">
      <aside className="hidden self-start bg-[var(--portal-navy)] text-pitch-foreground lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto">
        <div>{panel}</div>
      </aside>
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3 sticky top-0 z-10 border-b bg-[var(--portal-navy)] px-4 py-3 text-pitch-foreground lg:hidden">
          <Button variant="ghost" size="icon" type="button" onClick={() => setOpen(true)} aria-label="Open admin menu" className="hover:bg-pitch-foreground/10 hover:text-pitch-foreground"><Menu className="h-5 w-5" /></Button>
          <span className="flex min-w-0 items-center gap-2"><img src="/favicon.png" alt="" className="h-7 w-7 shrink-0 rounded bg-background p-0.5" /><p className="truncate font-serif text-lg">{current?.label}</p></span>
          <span className="w-9" />
        </div>
        <main className="p-4 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="portal inset-y-0 left-0 top-0 h-dvh w-[min(300px,90vw)] translate-x-0 translate-y-0 overflow-y-auto rounded-none bg-[var(--portal-navy)] p-0 text-pitch-foreground sm:rounded-none">
        <DialogTitle className="sr-only">Admin navigation</DialogTitle>
        <DialogDescription className="sr-only">Choose a studio section.</DialogDescription>
        {panel}
      </DialogContent>
    </Dialog>
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

export function StatCard({ label, value, hint, icon: I, onClick }: { label: string; value: ReactNode; hint?: string | undefined; icon: LucideIcon; onClick?: () => void }) {
  const Tag = onClick ? "button" : "div";
  return <Tag type={onClick ? "button" : undefined} onClick={onClick} aria-label={onClick ? `${label}: open` : undefined} className={`min-w-0 rounded-sm border border-t-2 border-t-brass bg-card p-4 text-left shadow-sm sm:p-5 ${onClick ? "cursor-pointer transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" : ""}`}>
    <div className="flex items-center justify-between gap-2"><p className="min-w-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:text-[11px]">{label}</p>
      <I aria-hidden className="h-4 w-4 shrink-0 text-brass" /></div>
    <p className="mt-3 font-serif text-3xl leading-none sm:text-5xl">{value}</p>
    {hint && <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{hint}</p>}
  </Tag>;
}
