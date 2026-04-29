import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { notifyAdmin } from "@/lib/notifyAdmin";
import { trackEvent, CONVERSION_EVENTS } from "@/lib/analytics";

const services = [
  "Shopify Design",
  "Conversion Optimization",
  "Automation & Growth",
  "Marketing",
  "Custom Development",
  "Consulting",
];

const budgetRanges = [
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000+",
  "Custom / Not Sure",
];

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(255),
  phone: z.string().max(30).optional(),
  company: z.string().max(100).optional(),
  service: z.string().min(1, "Please select a service"),
  budget_range: z.string().optional(),
  custom_budget: z.string().max(100).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCustomBudget, setShowCustomBudget] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const selectedBudget = watch("budget_range");

  const handleBudgetChange = (value: string) => {
    setValue("budget_range", value);
    setShowCustomBudget(value === "Custom / Not Sure");
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        service: data.service,
        budget_range: data.budget_range || null,
        custom_budget: data.custom_budget || null,
        message: data.message,
      });

      if (error) throw error;

      // Notify admin inbox (non-blocking)
      notifyAdmin({
        type: "contact",
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        message: data.message,
        meta: {
          service: data.service,
          company: data.company || "—",
          budget: data.custom_budget || data.budget_range || "—",
        },
      });

      trackEvent(CONVERSION_EVENTS.CONTACT_SUBMIT, {
        label: data.service,
        metadata: { budget: data.custom_budget || data.budget_range || null },
      });

      setIsSubmitted(true);
      reset();
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
    } catch (error) {
      import.meta.env.DEV && console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-6">
          Your message has been received. We'll get back to you within 24 hours.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          className="glass"
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="John Doe"
            className="glass border-white/10"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="john@company.com"
            className="glass border-white/10"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="+1 (555) 000-0000"
            className="glass border-white/10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company (Optional)</Label>
          <Input
            id="company"
            {...register("company")}
            placeholder="Your Company"
            className="glass border-white/10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Service Needed *</Label>
          <Select onValueChange={(value) => setValue("service", value)}>
            <SelectTrigger className="glass border-white/10">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent className="glass border-white/10">
              {services.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.service && (
            <p className="text-sm text-destructive">{errors.service.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Budget Range</Label>
          <Select onValueChange={handleBudgetChange}>
            <SelectTrigger className="glass border-white/10">
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent className="glass border-white/10">
              {budgetRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {showCustomBudget && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-2"
        >
          <Label htmlFor="custom_budget">Your Budget (Optional)</Label>
          <Input
            id="custom_budget"
            {...register("custom_budget")}
            placeholder="Enter your budget or describe your needs"
            className="glass border-white/10"
          />
        </motion.div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Tell us about your project..."
          rows={5}
          className="glass border-white/10 resize-none"
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full gradient-gold text-primary-foreground font-bold py-6 gold-glow hover:scale-[1.02] transition-transform duration-300"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
