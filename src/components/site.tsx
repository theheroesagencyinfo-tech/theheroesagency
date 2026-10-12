import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const CONTACT_EMAIL = "hello@theheroesauthorstudio.com";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Btn({
  children,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5";
  const v =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:shadow-[0_8px_24px_-8px_var(--color-ring)]"
      : "border border-foreground/25 text-foreground hover:border-foreground hover:bg-secondary";
  return <span className={`${base} ${v} ${className}`}>{children}</span>;
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="font-serif text-lg leading-tight sm:text-xl">
          TheHeroes <span className="italic">Author Studio</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-muted-foreground hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/" hash="review" className="rounded-md">
          <Btn className="px-4 py-2">Free review</Btn>
        </Link>
      </div>
      <nav aria-label="Mobile" className="flex gap-5 overflow-x-auto px-5 pb-3 text-sm md:hidden">
        {nav.map((n) => (
          <Link key={n.to} to={n.to} className="text-muted-foreground">
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 text-sm text-muted-foreground md:flex-row md:justify-between">
        <div>
          <p className="font-serif text-lg text-foreground">TheHeroes Author Studio</p>
          <p className="mt-1">Websites and launch funnels for nonfiction authors.</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="mt-3 inline-block underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-6">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="hover:text-foreground">
              {n.label}
            </Link>
          ))}
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
