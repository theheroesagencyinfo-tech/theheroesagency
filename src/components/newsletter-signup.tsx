import { useId, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/lib/newsletter.functions";

export function NewsletterSignup() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [note, setNote] = useState("");
  async function subscribe(event: FormEvent) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setNote("");
    try {
      const result = await subscribeNewsletter({ data: { email } });
      if (!result?.ok) throw new Error("Subscription failed");
      setStatus("done");
      setNote(result.alreadySubscribed ? "You're already on the list." : "You're on the list. Platform tips arrive soon.");
      setEmail("");
    } catch {
      setStatus("error");
      setNote("We couldn't add your email. Check the address and try again.");
    }
  }
  return <div>
    <h2 className="max-w-[34ch] font-serif text-2xl">Build a book platform that works beyond launch day.</h2>
    <p className="mt-2 max-w-[55ch] text-muted-foreground">Get practical ideas on author websites, email automation, reader magnets, and book launches without the jargon.</p>
    <form onSubmit={subscribe} className="mt-5 flex max-w-md flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor={id}>Email address</label>
      <input id={id} name="email" type="email" required maxLength={255} autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Enter your email" aria-describedby={`${id}-note`} className="min-w-0 w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/70" />
      <Button type="submit" variant="studio" size="studio" disabled={status === "sending"} className="shrink-0">{status === "sending" ? "Joining..." : "Get platform tips"}</Button>
    </form>
    <p id={`${id}-note`} className="mt-2 text-xs text-muted-foreground" role="status">{note || "No spam. Unsubscribe anytime."}</p>
    <p className="mt-2 text-xs text-muted-foreground">By joining, you agree to receive platform tips by email. <Link to="/privacy" className="underline underline-offset-4">Privacy policy</Link></p>
  </div>;
}