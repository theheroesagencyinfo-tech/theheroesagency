import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Admin sign in — TheHeroes Agency" },
    { name: "description", content: "Sign in to manage reviews and messages for TheHeroes Agency." },
    { property: "og:title", content: "Admin sign in — TheHeroes Agency" },
    { property: "og:description", content: "Admin area for TheHeroes Agency · Author Studio." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AuthPage,
});

const inputClass = "w-full rounded-md border border-input bg-background px-4 py-3 text-base focus-visible:border-ring";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState("");
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
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setBusy(false);
      setMsg(error ? error.message : "Check your email to confirm your account, then sign in.");
    }
  }
  return <section className="mx-auto max-w-md px-5 py-20">
    <h1 className="text-4xl">{mode === "in" ? "Admin sign in" : "Create admin account"}</h1>
    <form onSubmit={onSubmit} className="mt-8 grid gap-5">
      <div className="grid gap-2"><label htmlFor="a-email" className="text-sm font-medium">Email</label><input id="a-email" name="email" type="email" required autoComplete="email" className={inputClass} /></div>
      <div className="grid gap-2"><label htmlFor="a-pass" className="text-sm font-medium">Password</label><input id="a-pass" name="password" type="password" required minLength={8} autoComplete={mode === "in" ? "current-password" : "new-password"} className={inputClass} /></div>
      {msg && <p role="alert" className="text-sm text-muted-foreground">{msg}</p>}
      <Button type="submit" disabled={busy} variant="studio" size="studio" className="justify-self-start">{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}</Button>
    </form>
    <button type="button" onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(""); }} className="mt-6 text-sm underline underline-offset-4">
      {mode === "in" ? "First time? Create the admin account" : "Already have an account? Sign in"}
    </button>
  </section>;
}
