import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Check, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/components/site";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  head: () => ({ meta: [
    { title: "Client sign in · TheHeroes Agency" },
    { name: "description", content: "Sign in to your private client space with TheHeroes Agency." },
    { property: "og:title", content: "Client sign in · TheHeroes Agency" },
    { property: "og:description", content: "Private client space for TheHeroes Agency · Author Studio." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AuthPage,
});

const inputClass = "w-full rounded-md border border-input bg-background px-4 py-3 text-base transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";
const perks = ["Follow your project progress task by task", "Review wireframes and live pages as they land", "Download your invoice whenever you need it"];

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")), password = String(f.get("password"));
    setBusy(true); setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg(error.message);
      navigate({ to: "/account" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/account` } });
      setBusy(false);
      if (error) setMsg(error.message); else setSent(email);
    }
  }
  const switchTo = (m: "in" | "up") => { setMode(m); setMsg(""); setSent(""); };

  return <section className="mx-auto grid max-w-[1500px] gap-12 px-5 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
    <div className="flex flex-col justify-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Private client space</p>
      <h1 className="mt-4 text-4xl leading-[1.08] sm:text-5xl">Your author platform, in one quiet place.</h1>
      <p className="mt-6 max-w-[52ch] text-lg text-muted-foreground">Sign in to see where your project stands, what comes next, and everything we have built together so far.</p>
      <ul className="mt-10 grid gap-4 border-t pt-8">{perks.map(p => <li key={p} className="flex gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check aria-hidden className="h-3.5 w-3.5" /></span><span>{p}</span></li>)}</ul>
    </div>

    <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-10">
      <div role="tablist" aria-label="Account" className="grid grid-cols-2 rounded-full border bg-secondary p-1 text-sm font-medium">
        {(["in", "up"] as const).map(m => <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => switchTo(m)}
          className={`rounded-full px-4 py-2.5 transition-colors ${mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          {m === "in" ? "Sign in" : "Create account"}</button>)}
      </div>

      {sent ? <div className="mt-10 rounded-xl border bg-secondary p-6">
        <MailCheck aria-hidden className="h-7 w-7 text-primary" />
        <h2 className="mt-4 text-2xl">Check your inbox</h2>
        <p className="mt-2 text-muted-foreground">We sent a confirmation link to <span className="font-medium text-foreground">{sent}</span>. Open it, then come back and sign in.</p>
        <Button type="button" variant="studioOutline" size="studio" className="mt-6" onClick={() => switchTo("in")}>Go to sign in</Button>
      </div>
      : <>
        <h2 className="mt-10 text-3xl">{mode === "in" ? "Welcome back" : "Create your client account"}</h2>
        <p className="mt-2 text-sm text-muted-foreground">Use the email address you gave when you chose your package.</p>
        <form onSubmit={onSubmit} className="mt-8 grid gap-5">
          <div className="grid gap-2"><label htmlFor="a-email" className="text-xs font-semibold uppercase tracking-wider">Email address</label>
            <input id="a-email" name="email" type="email" required autoComplete="email" className={inputClass} /></div>
          <div className="grid gap-2"><label htmlFor="a-pass" className="text-xs font-semibold uppercase tracking-wider">Password</label>
            <div className="relative">
              <input id="a-pass" name="password" type={show ? "text" : "password"} required minLength={8} autoComplete={mode === "in" ? "current-password" : "new-password"} className={`${inputClass} pr-12`} />
              <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground hover:text-foreground">
                {show ? <EyeOff aria-hidden className="h-4 w-4" /> : <Eye aria-hidden className="h-4 w-4" />}</button>
            </div>
            {mode === "up" && <p className="text-xs text-muted-foreground">At least 8 characters.</p>}
          </div>
          {msg && <p role="alert" className="rounded-md border border-destructive/40 px-4 py-3 text-sm text-destructive">{msg}</p>}
          <Button type="submit" disabled={busy} variant="studio" size="studio" className="w-full">{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}</Button>
        </form>
      </>}
      <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">Trouble signing in? Email Mou at <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-4">{CONTACT_EMAIL}</a></p>
    </div>
  </section>;
}
