import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, Check, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { SUPPORT_EMAIL } from "@/components/site";
import banner from "@/assets/banner-writers-desk.png.asset.json";
import signupPhoto from "@/assets/mou/white.png.asset.json";
import { REF_STORAGE_KEY, isReferralCode } from "@/lib/loyalty";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Client sign in · TheHeroes Agency" },
    { name: "description", content: "Sign in to your private client space with TheHeroes Agency." },
    { property: "og:title", content: "Client sign in · TheHeroes Agency" },
    { property: "og:description", content: "Private client space for TheHeroes Agency · Author Studio." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: AuthPage,
});

const inputClass = "w-full rounded-md border border-input bg-background px-4 py-3 text-base transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";
const upPerks = ["Your own referral code from day one", "Seven loyalty levels with badges and studio rewards", "A personal profile with your author photo"];
const perks = ["Follow your project progress task by task", "Review wireframes and live pages as they land", "Download your invoice whenever you need it"];

// Google's brand mark: four fixed colours, never recoloured or restyled.
function GoogleMark() {
  return <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
  </svg>;
}

// A code from a friend's link is stored on arrival; Google sign-in cannot carry it
// into the account itself, so the new session hands it to the database once.
async function applyPendingReferral() {
  const code = (localStorage.getItem(REF_STORAGE_KEY) ?? "").toUpperCase();
  if (!isReferralCode(code)) return;
  const { data } = await supabase.rpc("apply_referral_code", { p_code: code });
  if (data) localStorage.removeItem(REF_STORAGE_KEY);
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [gBusy, setGBusy] = useState(false);

  // Anyone arriving here already signed in (or returned from Google) goes straight to
  // their account, after handing over a referral code if they still have one.
  useEffect(() => {
    let alive = true;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!alive || !data.user) return;
      await applyPendingReferral();
      navigate({ to: "/account", replace: true });
    })();
    return () => { alive = false; };
  }, [navigate]);

  async function googleIn() {
    setGBusy(true); setMsg("");
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth` });
    if (r.error) { setGBusy(false); setMsg(r.error.message); return; }
    if (r.redirected) return;
    await applyPendingReferral();
    navigate({ to: "/account" });
  }

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
      const stored = (localStorage.getItem(REF_STORAGE_KEY) ?? "").toUpperCase();
      const ref = String(f.get("ref") ?? "").trim().toUpperCase() || stored;
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/account`, data: isReferralCode(ref) ? { ref } : {} } });
      setBusy(false);
      if (error) setMsg(error.message); else setSent(email);
    }
  }
  const switchTo = (m: "in" | "up") => { setMode(m); setMsg(""); setSent(""); };

  return <section className="mx-auto grid max-w-[1500px] items-stretch gap-10 px-5 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
    <div className="relative flex min-h-[520px] flex-col justify-end overflow-hidden rounded-2xl bg-pitch p-8 text-pitch-foreground sm:p-12">
      <img key={mode} src={mode === "in" ? banner.url : signupPhoto.url} alt="" aria-hidden fetchPriority="high" className={`absolute inset-0 h-full w-full object-cover animate-in fade-in duration-700 ${mode === "in" ? "opacity-40" : "object-top opacity-35"}`} />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/70 to-transparent" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pitch-accent">{mode === "in" ? "Private client space" : "Join the studio"}</p>
        <h1 className="mt-4 text-4xl leading-[1.08] sm:text-5xl">{mode === "in" ? "Your author platform, in one quiet place." : "Begin your author platform with a studio that knows nonfiction."}</h1>
        <p className="mt-6 max-w-[52ch] text-lg text-pitch-muted">{mode === "in" ? "Sign in to see where your project stands, what comes next, and everything we have built together so far." : "Create your account to follow your project, collect loyalty badges, and invite fellow authors with your own referral code."}</p>
        <ul className="mt-10 grid gap-4 border-t border-pitch-foreground/20 pt-8">{(mode === "in" ? perks : upPerks).map(p => <li key={p} className="flex gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pitch-accent text-pitch"><Check aria-hidden className="h-3.5 w-3.5" /></span><span>{p}</span></li>)}</ul>
      </div>
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
        <Button type="button" variant="ghost" size="studio" disabled={gBusy || busy} onClick={googleIn}
          className="google-btn mt-8 w-full gap-2.5 rounded-md px-3 py-3 text-sm font-medium">
          <GoogleMark />{gBusy ? "Opening Google…" : "Continue with Google"}
        </Button>
        <p className="mt-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
          <span aria-hidden className="h-px flex-1 bg-border" />or<span aria-hidden className="h-px flex-1 bg-border" />
        </p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-5">
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
          {mode === "up" && <div className="grid gap-2"><label htmlFor="a-ref" className="text-xs font-semibold uppercase tracking-wider">Referral code (optional)</label>
            <input id="a-ref" name="ref" placeholder="HERO-XXXXXX" maxLength={11} className={`${inputClass} uppercase`} /><p className="text-xs text-muted-foreground">If a friend sent you a link, we have already saved their code.</p></div>}
          {msg && <p role="alert" className="rounded-md border border-destructive/40 px-4 py-3 text-sm text-destructive">{msg}</p>}
          <Button type="submit" disabled={busy} variant="studio" size="studio" className="w-full">{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}</Button>
        </form>
      </>}
      <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">Trouble signing in or resetting your password? Email Mou at <a href={`mailto:${SUPPORT_EMAIL}`} className="text-foreground underline underline-offset-4">{SUPPORT_EMAIL}</a></p>
    </div>
  </section>;
}
