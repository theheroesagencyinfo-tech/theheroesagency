import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { z } from "zod";
import {
  Loader2,
  ClipboardCheck,
  ArrowRight,
  CalendarCheck,
  Mail,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { notifyAdmin } from "@/lib/notifyAdmin";

const auditSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  websiteUrl: z
    .string()
    .trim()
    .min(1, "Website URL is required")
    .max(255)
    .regex(/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i, "Enter a valid URL"),
  storeType: z.string().min(1, "Select a store type"),
  monthlyRevenue: z.string().optional(),
  goals: z.string().trim().min(10, "Tell us a bit more (min 10 chars)").max(1000),
});

const storeTypes = [
  "Shopify",
  "Shopify Plus",
  "WooCommerce",
  "BigCommerce",
  "Custom Build",
  "Not launched yet",
  "Other",
];

const revenueRanges = [
  "Pre-launch",
  "$0 – $10k / month",
  "$10k – $50k / month",
  "$50k – $250k / month",
  "$250k+ / month",
];

const BOOKING_URL = "https://calendly.com";

type UtmData = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  landing_page: string | null;
};

function readUtm(): UtmData {
  if (typeof window === "undefined") {
    return {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
      referrer: null,
      landing_page: null,
    };
  }
  const params = new URLSearchParams(window.location.search);
  const get = (k: string) => params.get(k) || null;
  return {
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_term: get("utm_term"),
    utm_content: get("utm_content"),
    referrer: document.referrer || null,
    landing_page: window.location.href,
  };
}

export function SystemAuditForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [renderedAt] = useState(() => Date.now());
  const [form, setForm] = useState({
    name: "",
    email: "",
    websiteUrl: "",
    storeType: "",
    monthlyRevenue: "",
    goals: "",
    // honeypot — must remain empty
    company_website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const utm = useMemo(readUtm, []);

  // Persist UTM in session so reviewers see it even if user navigates within site
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem("audit_utm");
    if (!stored && (utm.utm_source || utm.referrer)) {
      sessionStorage.setItem("audit_utm", JSON.stringify(utm));
    }
  }, [utm]);

  const update = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot: bots fill hidden fields. Silently succeed without saving.
    if (form.company_website.trim() !== "") {
      setSubmitted(true);
      return;
    }

    // Time-trap: real users take >1.5s to fill the form
    if (Date.now() - renderedAt < 1500) {
      setSubmitted(true);
      return;
    }

    const parsed = auditSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const compiledMessage = [
      `Website: ${parsed.data.websiteUrl}`,
      `Store Type: ${parsed.data.storeType}`,
      parsed.data.monthlyRevenue ? `Revenue: ${parsed.data.monthlyRevenue}` : null,
      ``,
      `Goals:`,
      parsed.data.goals,
    ]
      .filter(Boolean)
      .join("\n");

    const storedUtm = (() => {
      try {
        const s = sessionStorage.getItem("audit_utm");
        return s ? (JSON.parse(s) as UtmData) : utm;
      } catch {
        return utm;
      }
    })();

    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      service: "System Audit Request",
      budget_range: parsed.data.monthlyRevenue || null,
      message: compiledMessage,
      lead_type: "system_audit",
      website_url: parsed.data.websiteUrl,
      store_type: parsed.data.storeType,
      goals: parsed.data.goals,
      utm_source: storedUtm.utm_source,
      utm_medium: storedUtm.utm_medium,
      utm_campaign: storedUtm.utm_campaign,
      utm_term: storedUtm.utm_term,
      utm_content: storedUtm.utm_content,
      referrer: storedUtm.referrer,
      landing_page: storedUtm.landing_page,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Submission failed",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    notifyAdmin({
      type: "system_audit",
      name: parsed.data.name,
      email: parsed.data.email,
      message: compiledMessage,
      meta: {
        website: parsed.data.websiteUrl,
        store_type: parsed.data.storeType,
        revenue: parsed.data.monthlyRevenue || "—",
      },
    });

    setSubmittedName(parsed.data.name.split(" ")[0]);
    setSubmitted(true);
    toast({
      title: "Audit request received",
      description: "We'll review your store and reach out within 24 hours.",
    });
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-10 md:p-14 border border-primary/20 gold-glow-sm"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 mb-5"
          >
            <ClipboardCheck className="w-8 h-8 text-primary" />
          </motion.div>
          <h3 className="text-2xl md:text-4xl font-bold mb-3">
            {submittedName ? `Thank you, ${submittedName}!` : "Audit request received"}
          </h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Your System Audit request is in. Here's exactly what happens next.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: ClipboardCheck,
              step: "Step 1 — Today",
              title: "Audit assigned",
              desc: "A reviewer is assigned to your store within 1 business hour.",
            },
            {
              icon: Sparkles,
              step: "Step 2 — Within 24h",
              title: "Personalised audit sent",
              desc: "You'll receive a written audit covering design, conversion gaps, and growth levers.",
            },
            {
              icon: CalendarCheck,
              step: "Step 3 — Your call",
              title: "Strategy session",
              desc: "Book a 30-min call to walk through findings and next steps.",
            },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-5"
              >
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 mb-3">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-[11px] font-semibold tracking-widest uppercase text-primary mb-1">
                  {s.step}
                </p>
                <h4 className="font-semibold mb-1">{s.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="gradient-gold text-primary-foreground font-semibold w-full sm:w-auto hover:scale-[1.02] transition-transform"
            >
              <CalendarCheck className="w-4 h-4 mr-2" />
              Book Your Strategy Call
            </Button>
          </a>
          <Link to="/">
            <Button size="lg" variant="outline" className="glass w-full sm:w-auto">
              Back to Home
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6 flex items-center justify-center gap-2">
          <Mail className="w-3 h-3" /> A confirmation email is on its way to your inbox.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-3xl p-8 md:p-12 border border-primary/15 gold-glow-sm"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
          <ClipboardCheck className="w-5 h-5 text-primary" />
        </div>
        <span className="text-xs font-semibold tracking-widest uppercase text-primary">
          Free System Audit
        </span>
      </div>
      <h3 className="text-3xl md:text-4xl font-bold mb-3">
        Get a <span className="text-gradient">free audit</span> before you book.
      </h3>
      <p className="text-muted-foreground mb-8 max-w-xl">
        Share your store and goals. We'll send a tailored audit covering design, conversion gaps, and growth opportunities.
      </p>

      {/* Honeypot — hidden from users, visible to bots */}
      <div
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden"
      >
        <Label htmlFor="company_website">Company Website (leave blank)</Label>
        <Input
          id="company_website"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          value={form.company_website}
          onChange={(e) => update("company_website", e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="audit-name">Full Name *</Label>
          <Input
            id="audit-name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Jane Cooper"
            className="mt-2"
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="audit-email">Email *</Label>
          <Input
            id="audit-email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@brand.com"
            className="mt-2"
          />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="audit-url">Website URL *</Label>
          <Input
            id="audit-url"
            value={form.websiteUrl}
            onChange={(e) => update("websiteUrl", e.target.value)}
            placeholder="https://yourstore.com"
            className="mt-2"
          />
          {errors.websiteUrl && (
            <p className="text-xs text-destructive mt-1">{errors.websiteUrl}</p>
          )}
        </div>
        <div>
          <Label>Store Type *</Label>
          <Select value={form.storeType} onValueChange={(v) => update("storeType", v)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {storeTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.storeType && (
            <p className="text-xs text-destructive mt-1">{errors.storeType}</p>
          )}
        </div>
        <div>
          <Label>Monthly Revenue</Label>
          <Select
            value={form.monthlyRevenue}
            onValueChange={(v) => update("monthlyRevenue", v)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Optional" />
            </SelectTrigger>
            <SelectContent>
              {revenueRanges.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="audit-goals">Your Goals *</Label>
          <Textarea
            id="audit-goals"
            value={form.goals}
            onChange={(e) => update("goals", e.target.value)}
            placeholder="What do you want to achieve? (e.g. higher conversion rate, redesign, scale ads, automate ops)"
            rows={5}
            className="mt-2 resize-none"
          />
          {errors.goals && <p className="text-xs text-destructive mt-1">{errors.goals}</p>}
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className="mt-8 w-full md:w-auto gradient-gold text-primary-foreground font-semibold hover:scale-[1.02] transition-transform duration-300"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
          </>
        ) : (
          <>
            Request My Free Audit <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </motion.form>
  );
}
