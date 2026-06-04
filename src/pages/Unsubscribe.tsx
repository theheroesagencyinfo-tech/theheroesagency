import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

type Status = "loading" | "ready" | "already" | "invalid" | "success" | "error";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const FN = `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe`;

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    fetch(`${FN}?token=${encodeURIComponent(token)}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (r.ok && data.valid) {
          setEmail(data.email ?? null);
          setStatus("ready");
        } else if (data.already_unsubscribed) {
          setStatus("already");
        } else {
          setStatus("invalid");
        }
      })
      .catch(() => setStatus("error"));
  }, [token]);

  const confirm = async () => {
    setStatus("loading");
    try {
      const r = await fetch(FN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ token }),
      });
      setStatus(r.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-20">
      <SEO
        title="Unsubscribe — The Heroes Agency"
        description="Manage your email preferences."
        canonical="https://www.theheroesagency.org/unsubscribe"
        noindex
      />
      <div className="max-w-md w-full glass-card p-8 rounded-2xl text-center space-y-5">
        <h1 className="text-2xl font-bold">Email preferences</h1>

        {status === "loading" && (
          <p className="text-muted-foreground">Checking your link…</p>
        )}

        {status === "ready" && (
          <>
            <p className="text-muted-foreground">
              Unsubscribe {email ? <strong>{email}</strong> : "this address"} from
              all emails from The Heroes Agency?
            </p>
            <Button onClick={confirm} className="w-full">
              Confirm unsubscribe
            </Button>
          </>
        )}

        {status === "success" && (
          <p className="text-muted-foreground">
            You've been unsubscribed. You won't receive further emails from us.
          </p>
        )}

        {status === "already" && (
          <p className="text-muted-foreground">
            This address is already unsubscribed.
          </p>
        )}

        {status === "invalid" && (
          <p className="text-muted-foreground">
            This unsubscribe link is invalid or has expired.
          </p>
        )}

        {status === "error" && (
          <p className="text-destructive">
            Something went wrong. Please try again later.
          </p>
        )}
      </div>
    </main>
  );
}
