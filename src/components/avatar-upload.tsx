import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export async function signedAvatar(path: string | null | undefined) {
  if (!path) return "";
  const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? "";
}

export function useMyAvatar() {
  const [url, setUrl] = useState("");
  const load = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data } = await supabase.from("profiles").select("avatar_url").eq("user_id", u.user.id).maybeSingle();
    setUrl(await signedAvatar(data?.avatar_url));
  };
  useEffect(() => { load(); const h = () => load(); window.addEventListener("avatar-updated", h); return () => window.removeEventListener("avatar-updated", h); }, []);
  return url;
}

export function Avatar({ url, name, className = "h-16 w-16 text-xl" }: { url: string; name: string; className?: string }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join("") || "A";
  return url ? <img src={url} alt={name ? `${name}'s photo` : "Your photo"} className={`shrink-0 rounded-full object-cover ring-2 ring-pitch-accent/60 ${className}`} />
    : <span aria-hidden className={`flex shrink-0 items-center justify-center rounded-full bg-primary font-serif text-primary-foreground ring-2 ring-pitch-accent/60 ${className}`}>{initials}</span>;
}

async function resize(file: File): Promise<Blob> {
  const img = await createImageBitmap(file);
  const s = Math.min(img.width, img.height), c = document.createElement("canvas");
  c.width = c.height = 512;
  c.getContext("2d")!.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 512, 512);
  return new Promise((res, rej) => c.toBlob(b => b ? res(b) : rej(new Error("Could not read image")), "image/webp", 0.85));
}

export function AvatarUpload({ name }: { name: string }) {
  const url = useMyAvatar();
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState({ busy: false, msg: "", err: "" });
  async function onFile(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("image/")) return setState({ busy: false, msg: "", err: "Please choose an image file." });
    setState({ busy: true, msg: "", err: "" });
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Please sign in again.");
      const path = `${u.user.id}/avatar-${Date.now()}.webp`;
      const { error } = await supabase.storage.from("avatars").upload(path, await resize(f), { contentType: "image/webp", upsert: true });
      if (error) throw error;
      const { error: e2 } = await supabase.from("profiles").update({ avatar_url: path }).eq("user_id", u.user.id);
      if (e2) throw e2;
      window.dispatchEvent(new Event("avatar-updated"));
      setState({ busy: false, msg: "Photo updated.", err: "" });
    } catch (e) { setState({ busy: false, msg: "", err: e instanceof Error ? e.message : "Upload failed." }); }
  }
  return <div className="flex flex-wrap items-center gap-6">
    <Avatar url={url} name={name} className="h-24 w-24 text-3xl" />
    <div className="grid gap-2">
      <input ref={input} type="file" accept="image/*" className="sr-only" aria-label="Upload a profile photo" onChange={e => onFile(e.target.files?.[0])} />
      <Button type="button" variant="studioOutline" size="studio" disabled={state.busy} onClick={() => input.current?.click()} className="w-fit"><Camera className="h-4 w-4" />{state.busy ? "Uploading…" : url ? "Change photo" : "Upload photo"}</Button>
      <p className="text-xs text-muted-foreground">A headshot or author photo. JPG, PNG or WebP, up to 5 MB.</p>
      {state.err && <p role="alert" className="text-sm text-destructive">{state.err}</p>}
      {state.msg && <p role="status" className="text-sm text-primary">{state.msg}</p>}
    </div>
  </div>;
}
