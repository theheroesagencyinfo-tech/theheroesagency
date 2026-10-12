import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function PageIntro({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return <section className="mx-auto max-w-6xl px-5 pb-14 pt-16 sm:pt-20">
    <p className="text-sm font-semibold text-muted-foreground">{label}</p>
    <h1 className="mt-6 max-w-[24ch] text-4xl leading-[1.08] sm:text-6xl">{title}</h1>
    <p className="mt-6 max-w-[60ch] text-lg text-muted-foreground">{children}</p>
  </section>;
}

export function ReviewCta() {
  return <section className="border-t bg-secondary"><div className="mx-auto max-w-6xl px-5 py-16">
    <h2 className="max-w-[25ch] text-3xl sm:text-4xl">Let's start with your book.</h2>
    <Button asChild variant="studio" size="studio" className="mt-6"><Link to="/contact" hash="review">Get my free author site review</Link></Button>
  </div></section>;
}

export function ImagePlaceholder({ label, portrait = false }: { label: string; portrait?: boolean }) {
  return <div role="img" aria-label={label} className={`flex w-full items-center justify-center border bg-secondary p-6 text-center text-sm text-muted-foreground ${portrait ? "aspect-[4/5]" : "aspect-[16/10]"}`}>
    <span>{label}</span>
  </div>;
}