import { useEffect, useState, type FormEvent } from "react";
import { Check, KeyRound, UserRound, ShieldCheck, Camera } from "lucide-react";
import { AvatarUpload } from "@/components/avatar-upload";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SUPPORT_EMAIL } from "@/components/site";

const inputClass = "w-full rounded-sm border border-input bg-background px-4 py-3 text-base focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";
const label = "text-xs font-semibold uppercase tracking-wider";

function Card({ icon: Icon, title, text, children }: { icon: typeof UserRound; title: string; text: string; children: React.ReactNode }) {
  return <section className="min-w-0 rounded-sm border bg-card p-6 shadow-sm sm:p-8">
    <div className="flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--portal-forest)] text-medal-gold"><Icon aria-hidden className="h-5 w-5" /></span>
      <div><h2 className="font-serif text-[1.7rem]">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{text}</p></div>
    </div>
    <div className="mt-6">{children}</div>
  </section>;
}

function Status({ ok, err }: { ok: string; err: string }) {
  if (err) return <p role="alert" className="text-sm text-destructive">{err}</p>;
  if (ok) return <p role="status" className="flex items-center gap-2 text-sm text-primary"><Check aria-hidden className="h-4 w-4" />{ok}</p>;
  return null;
}

export function AccountSettings({ email }: { email: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [p, setP] = useState({ ok: "", err: "", busy: false });
  const [pw, setPw] = useState({ ok: "", err: "", busy: false });
  const [created, setCreated] = useState("");

  useEffect(() => { supabase.auth.getUser().then(({ data }) => {
    const m = data.user?.user_metadata ?? {};
    setName(m["full_name"] ?? ""); setPhone(m["phone"] ?? "");
    if (data.user?.created_at) setCreated(new Date(data.user.created_at).toLocaleDateString());
  }); }, []);

  async function saveProfile(e: FormEvent) {
    e.preventDefault(); setP({ ok: "", err: "", busy: true });
    const { error } = await supabase.auth.updateUser({ data: { full_name: name.trim().slice(0, 100), phone: phone.trim().slice(0, 40) } });
    if (!error) { const { data } = await supabase.auth.getUser(); if (data.user) await supabase.from("profiles").update({ full_name: name.trim().slice(0, 100) }).eq("user_id", data.user.id); }
    setP({ ok: error ? "" : "Profile saved.", err: error?.message ?? "", busy: false });
  }
  async function savePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget); const a = String(f.get("pw")), b = String(f.get("pw2"));
    if (a.length < 8) return setPw({ ok: "", err: "Use at least 8 characters.", busy: false });
    if (a !== b) return setPw({ ok: "", err: "The two passwords do not match.", busy: false });
    setPw({ ok: "", err: "", busy: true });
    const { error } = await supabase.auth.updateUser({ password: a });
    setPw({ ok: error ? "" : "Password updated.", err: error?.message ?? "", busy: false });
    if (!error) e.currentTarget.reset();
  }

  return <div className="grid gap-5 lg:grid-cols-2">
    <div className="lg:col-span-2"><Card icon={Camera} title="Profile photo" text="Shown on your dashboard so your studio space feels like yours."><AvatarUpload name={name} /></Card></div>
    <Card icon={UserRound} title="Your profile" text="Your personal details for studio correspondence.">
      <form onSubmit={saveProfile} className="grid gap-5">
        <div className="grid gap-2"><label htmlFor="s-name" className={label}>Full name</label><input id="s-name" value={name} maxLength={100} onChange={e => setName(e.target.value)} autoComplete="name" className={inputClass} /></div>
        <div className="grid gap-2"><label htmlFor="s-phone" className={label}>Phone (optional)</label><input id="s-phone" value={phone} maxLength={40} onChange={e => setPhone(e.target.value)} autoComplete="tel" className={inputClass} /></div>
        <div className="grid gap-2"><span className={label}>Email address</span><p className="break-all rounded-sm border bg-secondary px-4 py-3 text-muted-foreground">{email}</p></div>
        <Status {...p} />
        <Button type="submit" disabled={p.busy} variant="studio" size="studio" className="w-fit rounded-sm">{p.busy ? "Saving…" : "Save profile"}</Button>
      </form>
    </Card>
    <Card icon={KeyRound} title="Password" text="Choose a new password for signing in.">
      <form onSubmit={savePassword} className="grid gap-5">
        <div className="grid gap-2"><label htmlFor="s-pw" className={label}>New password</label><input id="s-pw" name="pw" type="password" minLength={8} required autoComplete="new-password" className={inputClass} /></div>
        <div className="grid gap-2"><label htmlFor="s-pw2" className={label}>Repeat new password</label><input id="s-pw2" name="pw2" type="password" minLength={8} required autoComplete="new-password" className={inputClass} /></div>
        <Status {...pw} />
        <Button type="submit" disabled={pw.busy} variant="studio" size="studio" className="w-fit rounded-sm">{pw.busy ? "Updating…" : "Update password"}</Button>
      </form>
    </Card>
    <div className="flex items-start gap-4 rounded-sm bg-[var(--portal-navy)] p-6 text-pitch-foreground lg:col-span-2">
      <ShieldCheck aria-hidden className="h-6 w-6 shrink-0 text-medal-gold" />
      <p className="text-sm text-pitch-foreground/85">Your account is private to you{created ? `, member since ${created}` : ""}. For email changes, account closure or project cancellation questions, <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-4">contact Mou at {SUPPORT_EMAIL}</a>.</p>
    </div>
  </div>;
}
