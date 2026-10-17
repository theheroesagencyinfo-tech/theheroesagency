import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useId, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { z } from "zod";
import { BOOKING_URL } from "@/components/site";
import { Button } from "@/components/ui/button";
import { packages, addons, RUSH, packageSlugs, orderSchema, invoiceLines, type OrderInput } from "@/lib/packages";
import { money } from "@/lib/client-projects";
import { submitOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/get-started")({
  validateSearch: (s) => z.object({ package: z.enum(packageSlugs).catch("reader-to-client") }).parse(s),
  head: () => ({ meta: [
    { title: "Confirm your package · TheHeroes Agency · Author Studio" },
    { name: "description", content: "Review your author platform package, choose add-ons, and send your project details." },
    { property: "og:title", content: "Confirm your package · TheHeroes Agency" },
    { property: "og:description", content: "Choose your package and add-ons, then send your details or book a call." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: GetStarted,
});

type Field = "name" | "email" | "book" | "message";
const inputClass = "w-full rounded-md border border-input bg-background px-4 py-3 text-base focus-visible:border-ring";

function GetStarted() {
  const search = Route.useSearch();
  const prefix = useId();
  const send = useServerFn(submitOrder);
  const [slug, setSlug] = useState(search.package);
  const [chosen, setChosen] = useState<string[]>([]);
  const [rush, setRush] = useState(false);
  const [step, setStep] = useState<"choose" | "method" | "done">("choose");
  const [wantsCall, setWantsCall] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "failed">("idle");
  const [contact, setContact] = useState<Pick<OrderInput, "name" | "email" | "book" | "message"> | null>(null);
  const pkg = packages.find(p => p.slug === slug)!;
  const toggle = (id: string) => setChosen(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);

  function onConfirm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = orderSchema.safeParse({ ...Object.fromEntries(new FormData(form)), package: slug, addons: chosen, rush });
    if (!parsed.success) {
      const errs: Partial<Record<Field, string>> = {};
      for (const i of parsed.error.issues) errs[i.path[0] as Field] ??= i.message;
      setErrors(errs);
      const first = parsed.error.issues[0]?.path[0];
      if (first) (form.elements.namedItem(String(first)) as HTMLElement | null)?.focus();
      return;
    }
    setErrors({});
    const { name, email, book, message } = parsed.data;
    setContact({ name, email, book, message }); setStep("method"); window.scrollTo({ top: 0 });
  }

  async function sendWith(call: boolean) {
    if (!contact || status === "sending") return;
    setWantsCall(call); setStatus("sending");
    try {
      const r = await send({ data: { ...contact, package: slug, addons: chosen, rush, wants_call: call } });
      if (r.ok) { setStatus("idle"); setStep("done"); window.scrollTo({ top: 0 }); } else setStatus("failed");
    } catch { setStatus("failed"); }
  }

  const inv = invoiceLines(slug, chosen, rush);
  const summary = <aside className="h-fit border-t pt-6 md:sticky md:top-28">
    <p className="text-sm text-muted-foreground">Your selection</p>
    <h2 className="mt-2 text-3xl">{pkg.name}</h2>
    <p className="mt-2"><span className="text-sm text-muted-foreground">From </span><span className="font-serif text-3xl">{pkg.price}</span> <span className="text-sm text-muted-foreground">· {pkg.time}</span></p>
    {(chosen.length > 0 || rush) && <ul className="mt-5 space-y-2 border-t pt-5 text-sm">
      {inv.lines.slice(1).map(l => <li key={l.label} className="flex justify-between gap-4"><span>{l.label}</span><span className="shrink-0 font-semibold">+{money(l.amount)}{l.monthly ? "/month" : ""}</span></li>)}
    </ul>}
    <div className="mt-5 flex items-baseline justify-between gap-4 border-t pt-5" aria-live="polite">
      <span className="font-semibold">Estimated total</span><span className="font-serif text-4xl">{money(inv.oneOff)}</span>
    </div>
    {inv.monthly > 0 && <p className="mt-1 text-right text-sm">+ {money(inv.monthly)}/month for ongoing services</p>}
    <p className="mt-5 text-sm text-muted-foreground">Final price is confirmed in a written scope before any payment.</p>
  </aside>;

  if (step === "done") return <section className="mx-auto max-w-3xl px-5 py-20" role="status">
    <p className="text-sm font-semibold text-muted-foreground">Request received</p>
    <h1 className="mt-6 text-4xl leading-[1.08] sm:text-5xl">Thank you, your {pkg.name.toLowerCase()} request is in.</h1>
    {wantsCall ? <>
      <p className="mt-6 text-lg text-muted-foreground">I've noted that you'd like to talk first. Pick a time below and we'll go through your package and add-ons together.</p>
      <Button asChild variant="studio" size="studio" className="mt-8"><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book my 15-minute call</a></Button>
    </> : <p className="mt-6 text-lg text-muted-foreground">I'll contact you shortly, and I'll email your invoice so we can get started.</p>}
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl">Follow your project as it moves forward</h2>
      <p className="mt-3 max-w-[60ch] text-muted-foreground">Create a free account with the same email you just used, and you'll see your project's status at every stage.</p>
      <Button asChild variant="studioOutline" size="studio" className="mt-6"><Link to="/auth">Create my account</Link></Button>
    </div>
  </section>;

  return <>
    <section className="mx-auto max-w-[1500px] px-5 pb-10 pt-16 sm:pt-20">
      <Link to="/pricing" hash="packages" className="text-sm underline underline-offset-4">← Back to pricing</Link>
      <h1 className="mt-6 max-w-[22ch] text-4xl leading-[1.08] sm:text-6xl">{step === "choose" ? "Confirm your package." : "How would you like to move forward?"}</h1>
      <ol className="mt-6 flex gap-6 text-sm text-muted-foreground">{["Package", "Next step"].map((l, i) => <li key={l} className={i === ["choose", "method"].indexOf(step) ? "font-semibold text-foreground" : ""}>0{i + 1} {l}</li>)}</ol>
    </section>
    <section className="border-t"><div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-14 md:grid-cols-[1.4fr_1fr]">
      <div>
        {step === "choose" && <form onSubmit={onConfirm} noValidate>
          <fieldset><legend className="text-xl">Package</legend>
            <div className="mt-4 grid gap-3">{packages.map(p => <label key={p.slug} className={`flex cursor-pointer items-start gap-4 rounded-md border p-4 ${p.slug === slug ? "border-primary ring-1 ring-primary" : ""}`}>
              <input type="radio" name="pkg" checked={p.slug === slug} onChange={() => setSlug(p.slug)} className="mt-1.5 accent-primary" />
              <span className="flex-1"><span className="flex flex-wrap justify-between gap-2"><span className="font-semibold">{p.name}{p.popular && <span className="ml-2 text-xs text-primary">Most popular</span>}</span><span>From {p.price} · {p.time}</span></span><span className="mt-1 block text-sm text-muted-foreground">{p.outcome}</span></span>
            </label>)}</div>
          </fieldset>
          <details className="mt-6 border-y py-4"><summary className="cursor-pointer text-sm font-semibold">What's included in {pkg.name.toLowerCase()}</summary>
            <ul className="mt-4 space-y-2 text-sm">{pkg.items.map(i => <li key={i} className="flex gap-3"><Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{i}</li>)}</ul></details>
          <fieldset className="mt-10"><legend className="text-xl">Add-ons <span className="text-sm text-muted-foreground">(optional)</span></legend>
            <div className="mt-4 divide-y border-y">{addons.map(a => <label key={a.id} className="flex cursor-pointer items-center gap-4 py-3">
              <input type="checkbox" checked={chosen.includes(a.id)} onChange={() => toggle(a.id)} className="h-4 w-4 accent-primary" />
              <span className="flex-1">{a.name}</span><span className="shrink-0 text-sm font-semibold">{a.price}</span></label>)}
              <label className="flex cursor-pointer items-center gap-4 py-3"><input type="checkbox" checked={rush} onChange={() => setRush(!rush)} className="h-4 w-4 accent-primary" /><span className="flex-1">{RUSH.name}</span><span className="shrink-0 text-sm font-semibold">{RUSH.price}</span></label>
            </div>
          </fieldset>
          <fieldset className="mt-10"><legend className="text-xl">Your details</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">{([["name", "Name", "text", "name", 100], ["email", "Email", "email", "email", 255], ["book", "Book title or topic", "text", "off", 200]] as const).map(([id, label, type, auto, max]) => <div key={id} className={`grid gap-2 ${id === "book" ? "sm:col-span-2" : ""}`}>
              <label htmlFor={`${prefix}-${id}`} className="text-sm font-medium">{label}</label>
              <input id={`${prefix}-${id}`} name={id} type={type} autoComplete={auto} maxLength={max} required defaultValue={contact?.[id] ?? ""} aria-invalid={!!errors[id]} aria-describedby={errors[id] ? `${prefix}-${id}-err` : undefined} className={inputClass} />
              {errors[id] && <p role="alert" id={`${prefix}-${id}-err`} className="text-sm text-destructive">{errors[id]}</p>}
            </div>)}</div>
          </fieldset>
          <Button type="submit" variant="studio" size="studio" className="mt-8">Confirm this package</Button>
        </form>}

        {step === "method" && <div className="grid gap-4">
          <p className="text-muted-foreground">Your {pkg.name.toLowerCase()} package comes to an estimated {money(inv.oneOff)}{inv.monthly ? ` plus ${money(inv.monthly)}/month` : ""}. Choose one and it's sent straight away.</p>
          {([[false, "I'm ready. Email me the invoice", "I'll confirm the details and email your invoice so we can get started."], [true, "I'd like a call first", "We'll talk it through on a 15-minute call before anything is invoiced."]] as const).map(([call, t, d]) =>
            <button key={String(call)} type="button" disabled={status === "sending"} onClick={() => sendWith(call)} className="rounded-md border p-6 text-left transition-colors hover:border-primary focus-visible:border-primary disabled:opacity-60">
              <span className="block text-2xl">{status === "sending" && wantsCall === call ? "Sending…" : t}</span><span className="mt-2 block text-muted-foreground">{d}</span></button>)}
          {status === "failed" && <p role="alert" className="text-sm text-destructive">Something went wrong sending your request. Please try again.</p>}
          <button type="button" onClick={() => setStep("choose")} className="justify-self-start text-sm underline underline-offset-4">Change package, add-ons, or details</button>
        </div>}
      </div>
      {summary}
    </div></section>
  </>;
}
