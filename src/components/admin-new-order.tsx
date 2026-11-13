import { useState, type FormEvent } from "react";
import { Plus, Copy, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { packages, addons, orderSchema } from "@/lib/packages";
import { SHARE_ORIGIN } from "@/lib/loyalty";

const field = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

export function inviteText(name: string, book: string, pkg: string) {
  const first = name.trim().split(/\s+/)[0] || "there";
  return `Hi ${first},

I've set up your ${pkg} project for "${book}" in your TheHeroes Agency client space.

Create your account with this email address here: ${SHARE_ORIGIN}/auth

Once you're signed in you'll see the project, its progress, your invoice, and a direct chat with me.

Mou Barrac
TheHeroes Agency · Author Studio`;
}

export function NewOrderButton({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState<{ name: string; email: string; book: string; pkg: string } | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const parsed = orderSchema.safeParse({
      package: f.get("package"), name: f.get("name"), email: f.get("email"), book: f.get("book"),
      message: f.get("message") ?? "", addons: f.getAll("addons"), rush: f.get("rush") === "on", wants_call: false,
    });
    if (!parsed.success) { setErr(parsed.error.issues[0]?.message ?? "Check the form."); return; }
    setBusy(true); setErr("");
    const { error } = await supabase.from("package_orders").insert({ ...parsed.data, email: parsed.data.email.toLowerCase() });
    setBusy(false);
    if (error) { setErr("The order couldn't be saved. Please try again."); return; }
    onCreated();
    setSent({ name: parsed.data.name, email: parsed.data.email, book: parsed.data.book, pkg: packages.find(p => p.slug === parsed.data.package)?.name ?? "" });
  }
  function close(v: boolean) { setOpen(v); if (!v) { setSent(null); setErr(""); } }

  const text = sent ? inviteText(sent.name, sent.book, sent.pkg) : "";
  return <>
    <Button type="button" variant="studio" onClick={() => setOpen(true)} className="h-10 rounded-md px-4 text-sm"><Plus aria-hidden className="mr-1 h-4 w-4" />New order</Button>
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {sent ? <>
          <DialogHeader><DialogTitle>Order created. Now invite {sent.name.split(" ")[0]}.</DialogTitle>
            <DialogDescription>When they create an account with {sent.email} (email or Google), this project appears in their account automatically.</DialogDescription></DialogHeader>
          <pre className="whitespace-pre-wrap break-words rounded-md border bg-secondary p-4 font-sans text-sm">{text}</pre>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="studio" size="sm"><a href={`mailto:${sent.email}?subject=${encodeURIComponent(`Your ${sent.pkg} project is ready to follow`)}&body=${encodeURIComponent(text)}`}><Mail aria-hidden className="mr-2 h-4 w-4" />Open email to send</a></Button>
            <Button type="button" variant="studioOutline" size="sm" onClick={() => navigator.clipboard.writeText(text).then(() => toast.success("Invite copied"))}><Copy aria-hidden className="mr-2 h-4 w-4" />Copy invite</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => close(false)}>Done</Button>
          </div>
        </> : <>
          <DialogHeader><DialogTitle>Create a new order</DialogTitle>
            <DialogDescription>Add the client's details. You can send them an invite right after.</DialogDescription></DialogHeader>
          <form onSubmit={submit} className="grid gap-4">
            <label className="grid gap-1 text-sm">Client name<input name="name" required maxLength={100} className={field} /></label>
            <label className="grid gap-1 text-sm">Client email<input name="email" type="email" required maxLength={255} className={field} /></label>
            <label className="grid gap-1 text-sm">Book title or topic<input name="book" required maxLength={200} className={field} /></label>
            <label className="grid gap-1 text-sm">Package<select name="package" className={field} defaultValue={packages[0]?.slug}>{packages.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}</select></label>
            <fieldset className="grid gap-2 text-sm"><legend className="mb-1">Add-ons</legend>
              {addons.map(a => <label key={a.id} className="flex items-center gap-2"><input type="checkbox" name="addons" value={a.id} />{a.name}</label>)}
              <label className="flex items-center gap-2"><input type="checkbox" name="rush" />Rush delivery</label>
            </fieldset>
            <label className="grid gap-1 text-sm">Notes (optional)<textarea name="message" rows={3} maxLength={3000} className={field} /></label>
            {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
            <Button type="submit" variant="studio" disabled={busy}>{busy ? "Creating…" : "Create order"}</Button>
          </form>
        </>}
      </DialogContent>
    </Dialog>
  </>;
}
