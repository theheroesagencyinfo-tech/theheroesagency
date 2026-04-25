import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CALENDLY_URL } from "@/lib/links";
import { notifyAdmin } from "@/lib/notifyAdmin";

const quoteSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(50),
  last_name: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Please enter a valid email").max(255),
  whatsapp: z.string().trim().max(50).optional().or(z.literal("")),
  project_type: z.string().trim().min(2, "Project type is required").max(150),
  description: z
    .string()
    .trim()
    .min(10, "Please describe your project (10+ chars)")
    .max(2000),
  schedule_call: z.enum(["yes", "no"], {
    required_error: "Please choose an option",
  }),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

interface QuoteRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segment?: string;
}

export function QuoteRequestDialog({
  open,
  onOpenChange,
  segment,
}: QuoteRequestDialogProps) {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { schedule_call: "no" },
  });

  const scheduleCall = watch("schedule_call");

  const onSubmit = async (data: QuoteFormData) => {
    try {
      const message = `Project type: ${data.project_type}\n\nDescription:\n${data.description}\n\nWhatsApp: ${data.whatsapp || "—"}\nWants a call: ${data.schedule_call}`;

      const { error } = await supabase.from("contact_submissions").insert({
        name: `${data.first_name} ${data.last_name}`.trim(),
        email: data.email,
        phone: data.whatsapp || null,
        service: segment || data.project_type,
        message,
        lead_type: "quote_request",
        landing_page: typeof window !== "undefined" ? window.location.pathname : null,
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
      });

      if (error) throw error;

      notifyAdmin({
        type: "quote_request",
        name: `${data.first_name} ${data.last_name}`.trim(),
        email: data.email,
        phone: data.whatsapp || undefined,
        message,
        meta: {
          segment: segment || "—",
          project_type: data.project_type,
          wants_call: data.schedule_call,
        },
      });

      setIsSubmitted(true);

      if (data.schedule_call === "yes") {
        // Brief delay so the user sees the confirmation before redirect.
        setTimeout(() => {
          window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
        }, 600);
      }
    } catch (err) {
      toast({
        title: "Submission failed",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  const handleClose = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      // Reset on close so the form is clean next time.
      setTimeout(() => {
        reset({ schedule_call: "no" });
        setIsSubmitted(false);
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg glass border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isSubmitted ? "Thanks!" : "Request a Quote"}
          </DialogTitle>
          <DialogDescription>
            {isSubmitted
              ? scheduleCall === "yes"
                ? "Opening your calendar booking page now…"
                : "Thanks — we'll contact you shortly."
              : segment
                ? `Tell us about your ${segment.toLowerCase()} project.`
                : "Tell us about your project and we'll be in touch."}
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              {scheduleCall === "yes"
                ? "If your calendar didn't open automatically, click below."
                : "We'll review your request and reach out by email shortly."}
            </p>
            {scheduleCall === "yes" && (
              <Button
                asChild
                className="w-full gradient-gold text-primary-foreground"
              >
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                  Open Calendar
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleClose(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">First name *</Label>
                <Input id="first_name" {...register("first_name")} />
                {errors.first_name && (
                  <p className="text-xs text-destructive">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Last name *</Label>
                <Input id="last_name" {...register("last_name")} />
                {errors.last_name && (
                  <p className="text-xs text-destructive">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Active email *</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="whatsapp">WhatsApp number (optional)</Label>
              <Input id="whatsapp" {...register("whatsapp")} placeholder="+1 555 000 0000" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="project_type">Project type *</Label>
              <Input
                id="project_type"
                {...register("project_type")}
                placeholder="e.g. Shopify redesign, AI commercial video"
              />
              {errors.project_type && (
                <p className="text-xs text-destructive">
                  {errors.project_type.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Brief project description *</Label>
              <Textarea
                id="description"
                rows={4}
                {...register("description")}
                placeholder="What are you trying to achieve?"
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Would you like to schedule a call first?</Label>
              <RadioGroup
                defaultValue="no"
                onValueChange={(v) =>
                  setValue("schedule_call", v as "yes" | "no", {
                    shouldValidate: true,
                  })
                }
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="call-yes" />
                  <Label htmlFor="call-yes" className="font-normal cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="call-no" />
                  <Label htmlFor="call-no" className="font-normal cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
              {errors.schedule_call && (
                <p className="text-xs text-destructive">
                  {errors.schedule_call.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gradient-gold text-primary-foreground font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
