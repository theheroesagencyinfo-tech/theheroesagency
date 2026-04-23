import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Loader2, ClipboardCheck, ArrowRight } from "lucide-react";
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

export function SystemAuditForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    websiteUrl: "",
    storeType: "",
    monthlyRevenue: "",
    goals: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      service: "System Audit Request",
      budget_range: parsed.data.monthlyRevenue || null,
      message: compiledMessage,
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
        className="glass rounded-3xl p-10 md:p-14 border border-primary/20 gold-glow-sm text-center"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 mb-5">
          <ClipboardCheck className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold mb-3">Audit request received</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We'll review your store and send a personalised audit + strategy call invite within 24 hours.
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
