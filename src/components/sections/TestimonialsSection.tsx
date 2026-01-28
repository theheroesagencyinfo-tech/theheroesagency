import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, PenLine } from "lucide-react";
import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "@/components/ReviewForm";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  name: string;
  company: string | null;
  star_rating: number;
  message: string;
  is_featured: boolean;
  created_at: string;
}

// Fallback testimonials for when database is empty
const fallbackTestimonials = [
  {
    id: "fallback-1",
    name: "Sarah Mitchell",
    company: "Luxe Skincare Co.",
    star_rating: 5,
    message: "Working with this team transformed our entire business. Our conversion rate jumped 180% in just 3 months. The attention to detail and strategic thinking is unmatched.",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    name: "Marcus Chen",
    company: "Urban Threads",
    star_rating: 5,
    message: "From day one, I knew I was working with a true expert. The store exceeded all my expectations and we hit $2.4M in our first year. Best investment I've ever made.",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    name: "Emily Rodriguez",
    company: "Peak Performance Gear",
    star_rating: 5,
    message: "The 3D product visualization feature alone increased our average order value by 245%. This isn't just design work—it's revenue engineering.",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-4",
    name: "David Park",
    company: "Artisan Home Goods",
    star_rating: 5,
    message: "Our mobile conversions went up 320% after the redesign. The AR furniture preview feature is something our customers absolutely love.",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
];

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  const fetchApprovedReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, name, company, star_rating, message, is_featured, created_at")
        .eq("status", "approved")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Use fetched reviews if available, otherwise use fallbacks
      setReviews(data && data.length > 0 ? data : fallbackTestimonials);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews(fallbackTestimonials);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAutoPlaying || reviews.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const handleReviewSuccess = () => {
    // Optionally refresh reviews after submission
    fetchApprovedReviews();
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="py-24 relative overflow-hidden">
        <div className="container px-4 md:px-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Trusted by <span className="text-gradient">Industry Leaders</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take my word for it—hear from the brands I've helped transform.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative glass rounded-3xl p-8 md:p-12 gold-glow">
            {/* Quote icon */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
              <Quote className="w-10 h-10 text-primary/20" />
            </div>

            <AnimatePresence mode="wait">
              {reviews.length > 0 && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center pt-8"
                >
                  {/* Stars */}
                  <div className="flex items-center justify-center gap-1 mb-6">
                    {Array.from({ length: reviews[currentIndex].star_rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl lg:text-2xl text-foreground/90 mb-8 leading-relaxed max-w-3xl mx-auto">
                    "{reviews[currentIndex].message}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                      <span className="text-xl font-bold text-primary">
                        {reviews[currentIndex].name.charAt(0)}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">
                        {reviews[currentIndex].name}
                      </div>
                      {reviews[currentIndex].company && (
                        <div className="text-sm text-muted-foreground">
                          {reviews[currentIndex].company}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Arrows */}
            {reviews.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 glass hover:bg-primary/10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 glass hover:bg-primary/10"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>

          {/* Dots */}
          {reviews.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Write a Review Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center mt-12"
          >
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              variant="outline"
              className="glass hover:bg-primary/10 border-primary/30"
            >
              <PenLine className="w-4 h-4 mr-2" />
              {showReviewForm ? "Hide Review Form" : "Write a Review"}
            </Button>
          </motion.div>

          {/* Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 overflow-hidden"
              >
                <ReviewForm onSuccess={handleReviewSuccess} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
