import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { reviewSchema, ReviewFormData } from "@/lib/reviewSchema";
import { supabase } from "@/integrations/supabase/client";

interface ReviewFormProps {
  onSuccess?: () => void;
}

export function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      star_rating: 0,
      message: "",
    },
  });

  const currentRating = watch("star_rating");

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const { error } = await supabase.from("reviews").insert({
        name: data.name,
        company: data.company || null,
        email: data.email,
        star_rating: data.star_rating,
        message: data.message,
        status: "pending",
      });

      if (error) throw error;

      setSubmitStatus("success");
      reset();
      onSuccess?.();
    } catch (error: unknown) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (rating: number) => {
    setValue("star_rating", rating, { shouldValidate: true });
  };

  if (submitStatus === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-8 text-center gold-glow-sm"
      >
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-4">
          Your review has been submitted successfully. It will be published after moderation.
        </p>
        <Button
          onClick={() => setSubmitStatus("idle")}
          variant="outline"
          className="glass"
        >
          Submit Another Review
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="glass rounded-2xl p-6 md:p-8 space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Share Your Experience</h3>
        <p className="text-muted-foreground text-sm">
          All reviews are moderated before being published.
        </p>
      </div>

      <AnimatePresence>
        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Star Rating */}
      <div className="space-y-2">
        <Label>Your Rating *</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoveredStar || currentRating)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
        {errors.star_rating && (
          <p className="text-sm text-destructive">{errors.star_rating.message}</p>
        )}
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="John Doe"
          className="glass border-white/10 focus:border-primary/50"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Company */}
      <div className="space-y-2">
        <Label htmlFor="company">Company Name (Optional)</Label>
        <Input
          id="company"
          {...register("company")}
          placeholder="Your Company"
          className="glass border-white/10 focus:border-primary/50"
        />
        {errors.company && (
          <p className="text-sm text-destructive">{errors.company.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <p className="text-xs text-muted-foreground">
          Your email is kept private and used only for verification.
        </p>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="john@example.com"
          className="glass border-white/10 focus:border-primary/50"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Your Review *</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Share your experience working with us..."
          rows={4}
          className="glass border-white/10 focus:border-primary/50 resize-none"
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full gradient-gold text-primary-foreground hover:opacity-90 transition-opacity"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              ⏳
            </motion.span>
            Submitting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Submit Review
          </span>
        )}
      </Button>
    </motion.form>
  );
}
