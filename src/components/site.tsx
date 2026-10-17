import { UserRound } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

export const CONTACT_EMAIL = "theheroesagency.info@gmail.com";
export const BOOKING_URL = "https://calendly.com/theheroesagency-info/30min";
export const BOOKING_LABEL = "Book a 15-minute call";

export const ANNOUNCEMENT_ITEMS = [
  {
    text: "Built for nonfiction authors: turn readers into opportunities.",
    cta: "Book a call",
    href: BOOKING_URL,
  },
  {
    text: "Websites, email automation, and launch creative, built as one system.",
    cta: "View packages",
    href: "/pricing",
  },
] as const;


const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function Btn({
  children,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "ghost" | "ghostDark";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5";
  const v =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:shadow-[0_8px_24px_-8px_var(--color-ring)]"
      : variant === "ghostDark"
        ? "border border-pitch-foreground/30 text-pitch-foreground hover:border-pitch-foreground hover:bg-white/10"
        : "border border-foreground/25 text-foreground hover:border-foreground hover:bg-secondary";
  return <span className={`${base} ${v} ${className}`}>{children}</span>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex flex-col leading-tight" onClick={() => setOpen(false)}>
          <span className="font-serif text-lg sm:text-xl">TheHeroes Agency</span>
          <span className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">Author Studio</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/account" aria-label="My account" title="My account" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-foreground/25 text-foreground hover:bg-secondary">
            <UserRound aria-hidden className="h-5 w-5" />
          </Link>
          <Link to="/" hash="review" className="hidden rounded-md sm:inline-block">
            <Btn className="px-4 py-2">Free review</Btn>
          </Link>
          <button
            type="button"
            className="rounded-md border border-foreground/25 px-3 py-2 text-sm font-semibold md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t bg-background px-5 pb-8 pt-4 md:hidden">
          <ul className="divide-y">
            {nav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: true }}
                  className="block py-4 font-serif text-2xl"
                  activeProps={{ className: "text-ring" }}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/" hash="review" onClick={() => setOpen(false)} className="mt-6 block">
            <Btn className="w-full">Get my free author site review</Btn>
          </Link>
        </nav>
      )}
    </header>
  );
}

export function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground overflow-hidden">
      <ul className="sr-only">
        {ANNOUNCEMENT_ITEMS.map((item) => (
          <li key={item.text}>
            {item.text} <a href={item.href}>{item.cta}</a>
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className="announce-track py-2 text-sm font-medium tracking-wide">
        {[0, 1].map((half) => (
          <span key={half} className="flex shrink-0 items-center">
            {ANNOUNCEMENT_ITEMS.map((item) => (
              <span key={item.text} className="flex items-center whitespace-nowrap">
                <span className="pl-6 pr-2">{item.text}</span>
                <a
                  href={item.href}
                  tabIndex={-1}
                  {...(item.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="pr-6 font-semibold underline underline-offset-4"
                >
                  → {item.cta}
                </a>
                <span className="opacity-60">/</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Footer() {

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 text-sm text-muted-foreground md:flex-row md:justify-between">
        <div>
          <p className="font-serif text-lg text-foreground">TheHeroes Agency</p>
          <p className="text-xs uppercase tracking-[0.22em]">Author Studio</p>
          <p className="mt-1">Websites and launch funnels for nonfiction authors.</p>
          <p className="mt-3">
            {CONTACT_EMAIL}
          </p>
        </div>
        <nav aria-label="Footer" className="flex max-w-xl flex-wrap gap-x-6 gap-y-4">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="hover:text-foreground">
              {n.label}
            </Link>
          ))}
          <Link to="/account" className="hover:text-foreground">My account</Link>
          <Link to="/terms" className="hover:text-foreground">Terms of service</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy policy</Link>
          <Link to="/refund-policy" className="hover:text-foreground">Refund policy</Link>
        </nav>
      </div>
    </footer>
  );
}

export function ComingNext({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-28">
      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Coming next</p>
      <h1 className="mt-4 max-w-[20ch] text-5xl">{title}</h1>
      <p className="mt-6 max-w-[60ch] text-lg text-muted-foreground">
        This page is being written. In the meantime, request a free author site review.
      </p>
      <Link to="/" hash="review" className="mt-8 inline-block">
        <Btn>Get my free author site review</Btn>
      </Link>
    </section>
  );
}
