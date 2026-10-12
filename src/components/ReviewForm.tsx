import { useId, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { reviewSchema, serviceOptions } from "@/lib/review-schema";
import { submitReview } from "@/lib/review.functions";
import { Button } from "@/components/ui/button";

type Field = "name" | "email" | "book" | "website" | "service" | "message";
const fields: { id: Field; label: string; type: string; optional?: boolean; auto: string; max: number }[] = [
  { id: "name", label: "Name", type: "text", auto: "name", max: 100 },
  { id: "email", label: "Email", type: "email", auto: "email", max: 255 },
  { id: "book", label: "Book title or topic", type: "text", auto: "off", max: 200 },
  { id: "website", label: "Author website", type: "text", optional: true, auto: "url", max: 300 },
];
const inputClass = "w-full rounded-md border border-input bg-background px-4 py-3 text-base focus-visible:border-ring";

export function ReviewForm({ mode = "review", selectedService }: { mode?: "review" | "quote"; selectedService?: string | undefined }) {
  const prefix = useId();
  const send = useServerFn(submitReview);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const parsed = reviewSchema.safeParse({ ...Object.fromEntries(new FormData(form)), request_type: mode });
    if (!parsed.success) {
      const errs: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as Field] ??= issue.message;
      setErrors(errs);
      const first = parsed.error.issues[0]?.path[0];
      if (first) (form.elements.namedItem(String(first)) as HTMLElement | null)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try { const res = await send({ data: parsed.data }); setStatus(res.ok ? "done" : "failed"); }
    catch { setStatus("failed"); }
  }
  if (status === "done") return <div role="status" className="border-y py-8">
    <h3 className="text-3xl">Request received.</h3>
    <p className="mt-3 text-muted-foreground">{mode === "quote" ? "I'll email you to discuss the scope of your project." : "I'll send your review within 24 hours."}</p>
  </div>;
  return <form onSubmit={onSubmit} noValidate className="grid gap-5">
    {fields.filter(f => mode === "review" || f.id !== "website").map(f => <div key={f.id} className="grid gap-2">
      <label htmlFor={`${prefix}-${f.id}`} className="text-sm font-medium">{f.label} {f.optional && <span className="text-muted-foreground">(optional)</span>}</label>
      <input id={`${prefix}-${f.id}`} name={f.id} type={f.type} autoComplete={f.auto} maxLength={f.max} required={!f.optional} aria-invalid={!!errors[f.id]} aria-describedby={errors[f.id] ? `${prefix}-${f.id}-err` : undefined} className={inputClass} />
      {errors[f.id] && <p role="alert" id={`${prefix}-${f.id}-err`} className="text-sm text-destructive">{errors[f.id]}</p>}
    </div>)}
    <div className="grid gap-2">
      <label htmlFor={`${prefix}-service`} className="text-sm font-medium">{mode === "quote" ? "Service" : "What would you like help with?"}</label>
      <select key={selectedService} id={`${prefix}-service`} name="service" defaultValue={selectedService || "not sure yet"} className={inputClass}>
        {serviceOptions.map(service => <option key={service} value={service}>{service.charAt(0).toUpperCase() + service.slice(1)}</option>)}
      </select>
    </div>
    {mode === "quote" && <div className="grid gap-2">
      <label htmlFor={`${prefix}-message`} className="text-sm font-medium">Message</label>
      <textarea id={`${prefix}-message`} name="message" required rows={5} maxLength={3000} aria-invalid={!!errors.message} aria-describedby={errors.message ? `${prefix}-message-err` : undefined} className={inputClass} />
      {errors.message && <p role="alert" id={`${prefix}-message-err`} className="text-sm text-destructive">{errors.message}</p>}
    </div>}
    {status === "failed" && <p role="alert" className="text-sm text-destructive">Something went wrong sending your request. Please try again.</p>}
    <Button type="submit" disabled={status === "sending"} variant="studio" size="studio" className="mt-2 justify-self-start">{status === "sending" ? "Sending…" : mode === "quote" ? "Send my quote request" : "Get my free author site review"}</Button>
  </form>;
}
