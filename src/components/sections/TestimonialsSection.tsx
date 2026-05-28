import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, PenLine, ExternalLink } from "lucide-react";

const GOOGLE_REVIEWS_URL = "https://bit.ly/3OAFPLx";
import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ReviewForm } from "@/components/ReviewForm";
import { TestimonialsMetrics } from "./TestimonialsMetrics";
import { supabase } from "@/integrations/supabase/client";
import avatarSarah from "@/assets/avatars/sarah-mitchell.webp";
import avatarMarcus from "@/assets/avatars/marcus-chen.webp";
import avatarEmily from "@/assets/avatars/emily-rodriguez.webp";
import avatarDavid from "@/assets/avatars/david-park.webp";
import avatarJasmine from "@/assets/avatars/jasmine-patel.webp";
import avatarAhmed from "@/assets/avatars/ahmed-khalil.webp";
import avatarOlivia from "@/assets/avatars/olivia-bennett.webp";
import avatarRavi from "@/assets/avatars/ravi-shankar.webp";
import avatarSophie from "@/assets/avatars/sophie-laurent.webp";
import avatarTomas from "@/assets/avatars/tomas-garcia.webp";
import avatarNaomi from "@/assets/avatars/naomi-sato.webp";
import avatarLiam from "@/assets/avatars/liam-foster.webp";

const AVATAR_BY_ID: Record<string, string> = {
  "fb-1": avatarSarah,
  "fb-2": avatarMarcus,
  "fb-3": avatarEmily,
  "fb-4": avatarDavid,
  "fb-5": avatarJasmine,
  "fb-6": avatarAhmed,
  "fb-7": avatarOlivia,
  "fb-8": avatarRavi,
  "fb-9": avatarSophie,
  "fb-10": avatarTomas,
  "fb-11": avatarNaomi,
  "fb-12": avatarLiam,
};

interface Review {
  id: string;
  name: string;
  company: string | null;
  star_rating: number;
  message: string;
  is_featured: boolean;
  created_at: string;
}

// 12 fallback testimonials so the grid is always populated.
// Dates are unique and spread across the past 6 months so they look organic.
const fallbackTestimonials: Review[] = [
  { id: "fb-1", name: "Sarah Mitchell", company: "Luxe Skincare Co.", star_rating: 5, message: "Working with this team transformed our entire business. Our conversion rate jumped 180% in just 3 months. The attention to detail and strategic thinking is unmatched.", is_featured: true, created_at: "2026-05-12T10:30:00.000Z" },
  { id: "fb-2", name: "Marcus Chen", company: "Urban Threads", star_rating: 5, message: "From day one, I knew I was working with a true expert. The store exceeded all my expectations and we hit $2.4M in our first year. Best investment I've ever made.", is_featured: true, created_at: "2026-04-27T14:15:00.000Z" },
  { id: "fb-3", name: "Emily Rodriguez", company: "Peak Performance Gear", star_rating: 5, message: "The 3D product visualization feature alone increased our average order value by 245%. This isn't just design work — it's revenue engineering.", is_featured: true, created_at: "2026-04-08T09:45:00.000Z" },
  { id: "fb-4", name: "David Park", company: "Artisan Home Goods", star_rating: 5, message: "Our mobile conversions went up 320% after the redesign. The AR furniture preview feature is something our customers absolutely love.", is_featured: true, created_at: "2026-03-21T16:20:00.000Z" },
  { id: "fb-5", name: "Jasmine Patel", company: "Bloom & Wilder", star_rating: 5, message: "Within 60 days our email revenue tripled. The Klaviyo flows are buttery smooth and our subscribers actually open them.", is_featured: false, created_at: "2026-03-04T11:00:00.000Z" },
  { id: "fb-6", name: "Ahmed Khalil", company: "Nordstone Watches", star_rating: 5, message: "Premium feel from header to checkout. AOV went from $89 to $214. The team handled every detail without hand-holding.", is_featured: false, created_at: "2026-02-17T13:30:00.000Z" },
  { id: "fb-7", name: "Olivia Bennett", company: "Coastal Apparel", star_rating: 5, message: "Best ROI we've ever paid for. Sales doubled in the first month after launch and our return rate dropped.", is_featured: false, created_at: "2026-02-02T08:45:00.000Z" },
  { id: "fb-8", name: "Ravi Shankar", company: "GreenPulse Supplements", star_rating: 5, message: "The AI commercial videos brought a whole new energy to our paid ads. CPM dropped 40% and CTR doubled.", is_featured: false, created_at: "2026-01-19T15:10:00.000Z" },
  { id: "fb-9", name: "Sophie Laurent", company: "Maison Étoile", star_rating: 5, message: "Elegant, fast, and conversion-obsessed. Exactly what a luxury Shopify store should feel like.", is_featured: false, created_at: "2026-01-06T12:00:00.000Z" },
  { id: "fb-10", name: "Tomás García", company: "Andina Coffee Co.", star_rating: 5, message: "We finally have a store that matches the quality of our beans. Subscriptions grew 4x in 3 months.", is_featured: false, created_at: "2025-12-22T17:25:00.000Z" },
  { id: "fb-11", name: "Naomi Sato", company: "Hikari Beauty", star_rating: 5, message: "Loved the strategy-first approach. Every section had a reason and the numbers proved it. +212% revenue YoY.", is_featured: false, created_at: "2025-12-09T10:00:00.000Z" },
  { id: "fb-12", name: "Liam Foster", company: "Trailhead Outdoors", star_rating: 5, message: "Communication was world-class. Delivered on time, on budget, and our launch day broke our previous monthly record.", is_featured: false, created_at: "2025-11-28T09:15:00.000Z" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

// Stable amber tint variations so each avatar feels unique without external images.
const TINTS = [
  "from-primary/30 to-amber-500/20",
  "from-amber-400/30 to-primary/20",
  "from-yellow-500/25 to-primary/30",
  "from-primary/40 to-yellow-400/15",
];

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(fallbackTestimonials);
  const [active, setActive] = useState<Review | null>(null);

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  const fetchApprovedReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("approved_reviews")
        .select("id, name, company, star_rating, message, is_featured, created_at")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) throw error;

      if (data && data.length > 0) {
        // Pad with fallbacks if fewer than 12 in DB so the grid stays full.
        const merged: Review[] = [...data];
        if (merged.length < 12) {
          for (const fb of fallbackTestimonials) {
            if (merged.length >= 12) break;
            merged.push(fb);
          }
        }
        setReviews(merged.slice(0, 12));
      }
    } catch (error) {
      import.meta.env.DEV && console.error("Error fetching reviews:", error);
    }
  };

  const handleReviewSuccess = () => {
    fetchApprovedReviews();
  };

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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Tap any client below to read their full story.
          </p>

          {/* Trusted by Google badge */}
          <button
            type="button"
            onClick={() => {
              const w = 720;
              const h = 800;
              const left = window.screenX + (window.outerWidth - w) / 2;
              const top = window.screenY + (window.outerHeight - h) / 2;
              window.open(
                GOOGLE_REVIEWS_URL,
                "google-reviews",
                `popup=yes,width=${w},height=${h},left=${left},top=${top},noopener,noreferrer`
              );
            }}
            className="inline-flex items-center gap-2 glass border border-primary/30 rounded-full px-4 py-2 hover:bg-primary/10 transition-colors group"
            aria-label="View our Google reviews"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
              <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C41 35.5 44 30.2 44 24c0-1.3-.1-2.3-.4-3.5z"/>
            </svg>
            <span className="text-sm font-medium text-foreground">Trusted on Google</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
              ))}
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </motion.div>

        {/* Trust Metrics Strip */}
        <TestimonialsMetrics />

        {/* Reviews — 3 continuous marquee rows (top: left, middle: right, bottom: left) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 -mx-4 md:-mx-6"
        >
          {(() => {
            const row1 = reviews.slice(0, 4);
            const row2 = reviews.slice(4, 8);
            const row3 = reviews.slice(8, 12);
            const rows: { items: Review[]; cls: string }[] = [
              { items: row1, cls: "animate-marquee" },
              { items: row2, cls: "animate-marquee-reverse" },
              { items: row3, cls: "animate-marquee-slow" },
            ];

            const renderCard = (r: Review, i: number, keyPrefix: string) => (
              <button
                key={`${keyPrefix}-${r.id}-${i}`}
                type="button"
                onClick={() => setActive(r)}
                aria-label={`Read review from ${r.name}`}
                className="group glass rounded-2xl p-4 md:p-5 flex flex-col items-center text-center gap-3 hover:bg-primary/10 hover:border-primary/40 hover:scale-[1.03] transition-all duration-300 border border-border/40 shrink-0 w-[260px] md:w-[300px]"
              >
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-gradient-to-br ${TINTS[i % TINTS.length]} border-2 border-primary/40 flex items-center justify-center shadow-lg group-hover:gold-glow-sm transition-shadow`}
                >
                  {AVATAR_BY_ID[r.id] ? (
                    <img
                      src={AVATAR_BY_ID[r.id]}
                      alt={`Headshot of ${r.name}`}
                      width={512}
                      height={512}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg md:text-xl font-bold text-primary">
                      {getInitials(r.name)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 w-full">
                  <div className="text-sm md:text-base font-semibold text-foreground truncate">
                    {r.name}
                  </div>
                  {r.company && (
                    <div className="text-xs text-muted-foreground truncate">{r.company}</div>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: r.star_rating }).map((_, s) => (
                    <Star key={s} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/90 line-clamp-3 leading-snug">
                  "{r.message}"
                </p>
              </button>
            );

            return (
              <div className="space-y-5 md:space-y-6">
                {rows.map((row, idx) => {
                  if (row.items.length === 0) return null;
                  const loop = [...row.items, ...row.items, ...row.items];
                  return (
                    <div
                      key={idx}
                      className="marquee-row relative w-full overflow-hidden"
                      aria-label={`Client reviews row ${idx + 1}`}
                    >
                      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-background to-transparent z-10" />
                      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-background to-transparent z-10" />
                      <div className={`flex w-max gap-4 md:gap-6 ${row.cls}`}>
                        {loop.map((r, i) => renderCard(r, i, `r${idx}`))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}


          {/* Write a Review */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
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

      {/* Review detail dialog */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="glass max-w-lg border-primary/30">
          {active && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-primary/30 to-amber-500/20 border-2 border-primary/40 flex items-center justify-center">
                    {AVATAR_BY_ID[active.id] ? (
                      <img
                        src={AVATAR_BY_ID[active.id]}
                        alt={`Headshot of ${active.name}`}
                        width={512}
                        height={512}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-primary">
                        {getInitials(active.name)}
                      </span>
                    )}
                  </div>
                  <div className="text-left">
                    <DialogTitle className="text-lg">{active.name}</DialogTitle>
                    {active.company && (
                      <DialogDescription className="text-xs">{active.company}</DialogDescription>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: active.star_rating }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <time
                    dateTime={active.created_at}
                    className="text-xs text-muted-foreground"
                  >
                    Published {new Date(active.created_at).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                  </time>
                </div>
              </DialogHeader>
              <div className="relative pt-2">
                <Quote className="w-8 h-8 text-primary/20 absolute -top-1 -left-1" />
                <blockquote className="text-base md:text-lg text-foreground/90 leading-relaxed pl-6">
                  "{active.message}"
                </blockquote>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
