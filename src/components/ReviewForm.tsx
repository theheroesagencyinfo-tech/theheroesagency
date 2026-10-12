import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { reviewSchema } from "@/lib/review-schema";
import { submitReview } from "@/lib/review.functions";

type Field = "name" | "email" | "book" | "website";

const fields: { id: Field; label: string; type: string; optional?: boolean; auto: string }[] = [
  { id: "name", label: "Your name", type: "text", auto: "name" },
  { id: "email", label: "Email", type: "email", auto: "email" },
  { id: "book", label: "Book title or topic", type: "text", auto: "off" },
  { id: "website", label: "Author website", type: "text", optional: true, auto: "url" },
];

export function ReviewForm() {
  const send = useServerFn(submitReview);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = reviewSchema.safeParse(raw);
    if (!parsed.success) {
      const errs: Partial<Record<Field, string>> = {};
      for (const i of parsed.error.issues) errs[i.path[0] as Field] ??= i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await send({ data: parsed.data });
      setStatus(res.ok ? "done" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-lg border bg-card p-8">
        <h3 className="text-3xl">Thanks — your request is in.</h3>
        <p className="mt-3 max-w-[55ch] text-muted-foreground">
          I'll look at your site and book, then email you my notes. No sales call required.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 rounded-lg border bg-card p-6 sm:p-8">
      {fields.map((f) => (
        <div key={f.id} className="grid gap-2">
          <label htmlFor={f.id} className="text-sm font-medium">
            {f.label} {f.optional && <span className="text-muted-foreground">(optional)</span>}
          </label>
          <input
            id={f.id}
            name={f.id}
            type={f.type}
            autoComplete={f.auto}
            aria-invalid={!!errors[f.id]}
            aria-describedby={errors[f.id] ? `${f.id}-err` : undefined}
            className="rounded-md border border-input bg-background px-4 py-3 text-base focus-visible:border-ring"
          />
          {errors[f.id] && (
            <p id={`${f.id}-err`} className="text-sm text-destructive">
              {errors[f.id]}
            </p>
          )}
        </div>
      ))}
      {status === "failed" && (
        <p role="alert" className="text-sm text-destructive">
          Something went wrong sending your request. Please try again.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send my request"}
      </button>
    </form>
  );
}
