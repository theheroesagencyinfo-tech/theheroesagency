import { Facebook, Instagram, Linkedin, UserRound } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { subscribeNewsletter } from "@/lib/newsletter.functions";
import logoLight from "@/assets/theheroes-logo.png.asset.json";
import logoDark from "@/assets/theheroes-logo-dark-trimmed.png.asset.json";

// Absolute asset origin so images also load when the site is hosted elsewhere (e.g. Vercel).
const ASSET_ORIGIN = "https://theheroesagency.lovable.app";
export const assetSrc = (a: { url: string }) => (a.url.startsWith("/__l5e/") ? ASSET_ORIGIN + a.url : a.url);

function Logo({ className }: { className: string }) {
  return (
    <picture>
      <source media="(prefers-color-scheme: dark)" srcSet={assetSrc(logoDark)} />
      <img src={assetSrc(logoLight)} alt="TheHeroes Agency · Author Studio" width={1190} height={196} className={className} />
    </picture>
  );
}

export const CONTACT_EMAIL = "theheroesagency.info@gmail.com";
export const INFO_EMAIL = "theheroesagency.info@gmail.com";
export const SUPPORT_EMAIL = "theheroesagency.info@gmail.com";
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
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Logo className="h-8 w-auto sm:h-10" />
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

export const SOCIALS = [
  {
    label: "Threads",
    handle: "@theheroes_authorstudio",
    href: "https://www.threads.com/@theheroes_authorstudio",
    icon: ThreadsIcon,
  },
  {
    label: "Instagram",
    handle: "@theheroes_authorstudio",
    href: "https://www.instagram.com/theheroes_authorstudio",
    icon: Instagram,
  },
  {
    label: "LinkedIn",
    handle: "TheHeroes Author Studio",
    href: "https://www.linkedin.com/in/theheroesauthorstudio",
    icon: Linkedin,
  },
  {
    label: "X",
    handle: "@moubarrac",
    href: "https://x.com/moubarrac",
    icon: XIcon,
  },
  {
    label: "Facebook",
    handle: "TheHeroes Agency",
    href: "https://www.facebook.com/share/19fEAZNYmW/",
    icon: Facebook,
  },
  {
    label: "TikTok",
    handle: "@moubarrac",
    href: "https://www.tiktok.com/@moubarrac",
    icon: TikTokIcon,
  },
] as const;


function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.016c.03-3.579.879-6.43 2.525-8.482C5.872 1.219 8.614.05 12.176.024h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.084 3.507 5.327l-2.04.594c-1.104-3.96-3.898-5.953-8.3-5.986-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.853-2.045 1.647-1.613 1.618-3.593 1.087-4.798-.255-.574-.705-1.046-1.293-1.373-.155-.077-.32-.144-.493-.2-.108-.433-.242-.855-.4-1.269.691.087 1.316.244 1.856.475 1.013.44 1.748 1.153 2.116 2.045.804 1.946.875 5.148-1.487 7.45-1.876 1.773-4.075 2.437-7.526 2.459zm.706-6.381c-2.591 0-4.085-1.2-4.085-2.842 0-1.62 1.443-2.795 4.008-2.795.136 0 .27.003.404.01-.041-.853-.342-1.553-.936-2.065-.689-.594-1.714-.897-3.043-.897l-.022.001c-1.073 0-2.21.242-3.113.664l-.77-1.608c1.175-.55 2.537-.854 3.898-.854h.022c2.207.011 3.899.623 5.03 1.82 1.06 1.121 1.594 2.715 1.588 4.738v.005c0 .912-.076 1.713-.214 2.437 1.153.197 1.941.735 2.306 1.615.24.577.322 1.224.256 1.93-1.348-.033-2.386-.376-3.062-1.02-.363.192-.763.353-1.193.479-.66.197-1.39.3-2.17.307zm-.025-3.876c-1.548.015-2.105.66-2.105 1.034 0 .337.374.894 1.866.894.346 0 .666-.032.965-.099.286-.628.453-1.348.51-2.166-.403-.045-.798-.065-1.173-.063h-.073z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.25.71-.26 1.5-.1 2.22.4 1.52 1.93 2.66 3.49 2.69 1.31.09 2.66-.36 3.51-1.37.45-.52.74-1.17.8-1.84.04-1.47.02-2.94.03-4.41.01-4.13-.01-8.25.01-12.38z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [note, setNote] = useState("");

  async function subscribe(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setNote("");
    try {
      const res = await subscribeNewsletter({ data: { email } });
      if (res?.ok) {
        setStatus("done");
        setNote(
          res.alreadySubscribed
            ? "You're already on the list."
            : "You're on the list. Platform tips arrive soon."
        );
        setEmail("");
      } else {
        setStatus("error");
        setNote("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setNote("Enter a valid email address.");
    }
  }

  return (
    <footer className="border-t">
      <div className="mx-auto max-w-[1500px] px-5 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="max-w-[34ch] font-serif text-2xl">
              Build a book platform that works beyond launch day.
            </h2>
            <p className="mt-2 max-w-[55ch] text-muted-foreground">
              Get practical ideas on author websites, email automation, reader
              magnets, and book launches without the jargon.
            </p>
            <form onSubmit={subscribe} className="mt-5 flex max-w-md flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                maxLength={255}
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/70"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
              >
                {status === "sending" ? "Joining..." : "Get platform tips"}
              </button>
            </form>
            <p className="mt-2 text-xs text-muted-foreground" role="status">
              {note || "No spam. Unsubscribe anytime."}
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="flex max-w-xl flex-wrap gap-x-6 gap-y-4 text-sm text-muted-foreground md:justify-end"
          >
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
        <div className="mt-10 flex flex-col gap-6 border-t pt-8 text-sm text-muted-foreground md:flex-row md:items-start md:justify-between">
          <div>
            <Logo className="h-10 w-auto" />
            <p className="mt-1">Websites and launch funnels for nonfiction authors.</p>
            <p className="mt-3"><a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4 hover:text-foreground">{CONTACT_EMAIL}</a></p>
            
          </div>
          <div className="flex items-center gap-3" aria-label="Social media">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-foreground/25 text-muted-foreground hover:border-foreground hover:bg-secondary hover:text-foreground"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function ComingNext({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-[1500px] px-5 py-28">
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
