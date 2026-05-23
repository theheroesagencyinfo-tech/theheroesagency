import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Send,
  Linkedin,
  Instagram,
  Facebook,
  Mail,
  MapPin,
  Shield,
  Youtube,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notifyAdmin } from "@/lib/notifyAdmin";
import { trackEvent, CONVERSION_EVENTS } from "@/lib/analytics";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});
type ContactFormData = z.infer<typeof contactSchema>;

const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(255),
});
type NewsletterFormData = z.infer<typeof newsletterSchema>;

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.45a8.16 8.16 0 0 0 4.77 1.52V6.55a4.85 4.85 0 0 1-1.84-.14z" />
  </svg>
);
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/theheroes-agency", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/theheroes_agency", label: "Instagram" },
  { icon: TikTokIcon, href: "https://www.tiktok.com/@theheroesagency", label: "TikTok" },
  { icon: Facebook, href: "https://www.facebook.com/share/18Hjqf3KRJ/?mibextid=wwXIfr", label: "Facebook" },
  { icon: XIcon, href: "https://x.com/moubarrac", label: "X (Twitter)" },
  { icon: Youtube, href: "https://www.youtube.com/@TheHeroesAgencyorg", label: "YouTube" },
  { icon: MessageCircle, href: "https://wa.me/13154541290", label: "WhatsApp" },
];

type FooterLink =
  | { label: string; href: string; type: "section" }
  | { label: string; href: string; type: "route" }
  | { label: string; href: string; type: "route"; icon?: React.ElementType };

const exploreLinks: FooterLink[] = [
  { label: "Services", href: "#services", type: "section" },
  { label: "Process", href: "#process", type: "section" },
  { label: "Portfolio", href: "/portfolio", type: "route" },
  { label: "Testimonials", href: "#testimonials", type: "section" },
];

const shopifyServiceLinks: FooterLink[] = [
  { label: "Shopify Expert", href: "/shopify-expert", type: "route" },
  { label: "Shopify Store Design", href: "/shopify-store-design", type: "route" },
  { label: "Shopify Optimization", href: "/shopify-optimization", type: "route" },
  { label: "Shopify Website Fix", href: "/shopify-website-fix", type: "route" },
  { label: "Shopify Marketing Agency", href: "/shopify-marketing-agency", type: "route" },
];

const resourceLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy", type: "route" },
  { label: "Terms of Service", href: "/terms", type: "route" },
  { label: "FAQ", href: "/about#faq", type: "route" },
  { label: "Admin", href: "/admin", type: "route" },
];

function FooterLinkGroup({
  title,
  links,
  onSection,
}: {
  title: string;
  links: FooterLink[];
  onSection: (href: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/40 md:border-0 py-4 md:py-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="md:cursor-default md:pointer-events-none w-full flex items-center justify-between text-left"
        aria-expanded={open}
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h3>
        <ChevronDown
          className={`md:hidden w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <ul
        className={`mt-3 space-y-2 md:!block md:!opacity-100 md:!max-h-none overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 md:opacity-100"
        }`}
      >
        {links.map((link) =>
          link.type === "route" ? (
            <li key={link.label}>
              <Link
                to={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                {link.label === "Admin" && <Shield className="w-3 h-3" />}
                {link.label}
              </Link>
            </li>
          ) : (
            <li key={link.label}>
              <button
                onClick={() => onSection(link.href)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
              >
                {link.label}
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

export function Footer() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const {
    register: registerNl,
    handleSubmit: handleNlSubmit,
    reset: resetNl,
    formState: { errors: nlErrors, isSubmitting: nlSubmitting },
  } = useForm<NewsletterFormData>({ resolver: zodResolver(newsletterSchema) });

  const onSubmit = async (data: ContactFormData) => {
    const { error } = await supabase.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      service: "Website inquiry",
      message: data.message,
      lead_type: "footer_contact",
    });
    if (error) {
      toast({ title: "Couldn't send", description: "Please try again in a moment.", variant: "destructive" });
      return;
    }
    notifyAdmin({
      type: "contact",
      name: data.name,
      email: data.email,
      message: data.message,
      meta: { source: "footer" },
    });
    trackEvent(CONVERSION_EVENTS.CONTACT_SUBMIT, { label: "footer" });
    toast({ title: "Message sent!", description: "Thank you for reaching out. I'll get back to you within 24 hours." });
    reset();
  };

  const onNewsletter = async (data: NewsletterFormData) => {
    const { error } = await supabase.from("contact_submissions").insert({
      name: "Newsletter subscriber",
      email: data.email,
      service: "Newsletter",
      message: "Newsletter subscription from footer",
      lead_type: "newsletter",
    });
    if (error) {
      toast({ title: "Couldn't subscribe", description: "Please try again in a moment.", variant: "destructive" });
      return;
    }
    trackEvent(CONVERSION_EVENTS.NEWSLETTER_SUBSCRIBE, { label: "footer" });
    toast({ title: "Subscribed!", description: "You're on the list. Watch your inbox for growth playbooks." });
    resetNl();
  };

  const scrollToSection = (href: string) => {
    const id = href.replace("#", "");
    if (location.pathname !== "/") {
      navigate(`/${href}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer id="contact" className="pt-24 pb-8 relative">
      <div className="absolute inset-0 bg-glow opacity-20" />

      <div ref={ref} className="container px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            {/* Left Side - Contact Info & Social */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Let's Create Something
                <br />
                <span className="text-gradient">Extraordinary</span>
              </h2>

              <p className="text-muted-foreground mb-8 max-w-md">
                Ready to transform your Shopify store? Get in touch and let's discuss how we can work together to
                achieve your goals.
              </p>

              <div className="space-y-4 mb-8">
                <a
                  className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors"
                  href="mailto:info@theheroesagency.org"
                  onClick={() => trackEvent(CONVERSION_EVENTS.EMAIL_CLICK, { label: "footer" })}
                >
                  <Mail className="w-5 h-5 text-primary" />
                  info@theheroesagency.org
                </a>
                <div className="flex items-center gap-3 text-foreground/80">
                  <MapPin className="w-5 h-5 text-primary" />
                  Available Worldwide (Remote)
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    onClick={() => {
                      if (social.label === "WhatsApp") {
                        trackEvent(CONVERSION_EVENTS.WHATSAPP_CLICK, { label: "footer" });
                      }
                    }}
                    className="w-11 h-11 rounded-xl glass flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5 text-foreground/80" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground/80">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    {...register("name")}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/80">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                    className="bg-background/50 border-border/50 focus:border-primary/50"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground/80">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project..."
                    rows={4}
                    {...register("message")}
                    className="bg-background/50 border-border/50 focus:border-primary/50 resize-none"
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-gold text-primary-foreground font-semibold py-6 hover:scale-[1.02] transition-transform duration-300"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Grouped link columns + newsletter */}
          <div className="border-t border-border/50 pt-12 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <FooterLinkGroup title="Explore" links={exploreLinks} onSection={scrollToSection} />
              <FooterLinkGroup title="Shopify Services" links={shopifyServiceLinks} onSection={scrollToSection} />
              <FooterLinkGroup title="Resources" links={resourceLinks} onSection={scrollToSection} />

              {/* Newsletter */}
              <div className="border-b border-border/40 md:border-0 py-4 md:py-0">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-3">Newsletter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Growth playbooks, Shopify teardowns and AI commercial drops — straight to your inbox.
                </p>
                <form onSubmit={handleNlSubmit(onNewsletter)} className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="you@brand.com"
                      {...registerNl("email")}
                      className="bg-background/50 border-border/50 focus:border-primary/50 flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={nlSubmitting}
                      className="gradient-gold text-primary-foreground font-semibold"
                    >
                      {nlSubmitting ? "..." : "Join"}
                    </Button>
                  </div>
                  {nlErrors.email && <p className="text-sm text-destructive">{nlErrors.email.message}</p>}
                </form>
              </div>
            </div>
          </div>

          {/* Bottom Bar — Big shimmering brand */}
          <div className="border-t border-border/50 pt-10">
            <div className="text-center mb-6">
              <Link to="/" className="inline-block">
                <span
                  className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent animate-shimmer"
                  style={{
                    backgroundImage:
                      "linear-gradient(110deg, hsl(var(--primary)) 0%, hsl(var(--foreground)) 25%, hsl(var(--primary)) 50%, hsl(var(--foreground)) 75%, hsl(var(--primary)) 100%)",
                    backgroundSize: "200% 100%",
                  }}
                >
                  THE HEROES AGENCY
                </span>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} The Heroes Agency. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
