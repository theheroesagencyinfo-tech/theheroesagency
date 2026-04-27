import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Linkedin, Instagram, Facebook, Mail, MapPin, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { notifyAdmin } from "@/lib/notifyAdmin";
const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters")
});
type ContactFormData = z.infer<typeof contactSchema>;
// Inline TikTok and X (Twitter) marks since lucide-react doesn't ship them as standard icons here
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.45a8.16 8.16 0 0 0 4.77 1.52V6.55a4.85 4.85 0 0 1-1.84-.14z"/>
  </svg>
);
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const socialLinks = [{
  icon: Linkedin,
  href: "https://www.linkedin.com/in/theheroes-agency",
  label: "LinkedIn"
}, {
  icon: Instagram,
  href: "https://www.instagram.com/theheroes_agency",
  label: "Instagram"
}, {
  icon: TikTokIcon,
  href: "https://www.tiktok.com/@theheroesagency",
  label: "TikTok"
}, {
  icon: Facebook,
  href: "https://www.facebook.com/share/18Hjqf3KRJ/?mibextid=wwXIfr",
  label: "Facebook"
}, {
  icon: XIcon,
  href: "https://x.com/moubarrac",
  label: "X (Twitter)"
}];
const navLinks = [{
  label: "Services",
  href: "#services",
  type: "section" as const,
}, {
  label: "Process",
  href: "#process",
  type: "section" as const,
}, {
  label: "Portfolio",
  href: "/portfolio",
  type: "route" as const,
}, {
  label: "Testimonials",
  href: "#testimonials",
  type: "section" as const,
}];
export function Footer() {
  const {
    ref,
    isVisible
  } = useScrollAnimation(0.1);
  const {
    toast
  } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });
  const onSubmit = async (data: ContactFormData) => {
    const { error } = await supabase.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      service: "Website inquiry",
      message: data.message,
      lead_type: "footer_contact",
    });

    if (error) {
      toast({
        title: "Couldn't send",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    notifyAdmin({
      type: "contact",
      name: data.name,
      email: data.email,
      message: data.message,
      meta: { source: "footer" },
    });

    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I'll get back to you within 24 hours."
    });
    reset();
  };
  const scrollToSection = (href: string) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };
  return <footer id="contact" className="pt-24 pb-8 relative">
      <div className="absolute inset-0 bg-glow opacity-20" />
      
      <div ref={ref} className="container px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            {/* Left Side - Contact Info & Social */}
            <motion.div initial={{
            opacity: 0,
            x: -40
          }} animate={isVisible ? {
            opacity: 1,
            x: 0
          } : {}} transition={{
            duration: 0.6
          }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Let's Create Something
                <br />
                <span className="text-gradient">Extraordinary</span>
              </h2>
              
              <p className="text-muted-foreground mb-8 max-w-md">
                Ready to transform your Shopify store? Get in touch and let's discuss 
                how we can work together to achieve your goals.
              </p>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <a className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors" href="mailto:info@theheroesagency.org">
                  <Mail className="w-5 h-5 text-primary" />
                  info@theheroesagency.org

                </a>
                <div className="flex items-center gap-3 text-foreground/80">
                  <MapPin className="w-5 h-5 text-primary" />
                  Available Worldwide (Remote)
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 flex-wrap">
                {socialLinks.map(social => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="w-11 h-11 rounded-xl glass flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all duration-300">
                    <social.icon className="w-5 h-5 text-foreground/80" />
                  </a>)}
              </div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div initial={{
            opacity: 0,
            x: 40
          }} animate={isVisible ? {
            opacity: 1,
            x: 0
          } : {}} transition={{
            duration: 0.6,
            delay: 0.2
          }}>
              <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground/80">Name</Label>
                  <Input id="name" placeholder="Your name" {...register("name")} className="bg-background/50 border-border/50 focus:border-primary/50" />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/80">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" {...register("email")} className="bg-background/50 border-border/50 focus:border-primary/50" />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground/80">Message</Label>
                  <Textarea id="message" placeholder="Tell me about your project..." rows={4} {...register("message")} className="bg-background/50 border-border/50 focus:border-primary/50 resize-none" />
                  {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full gradient-gold text-primary-foreground font-semibold py-6 hover:scale-[1.02] transition-transform duration-300">
                  {isSubmitting ? "Sending..." : <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>}
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border/50 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Logo / Brand */}
              <div className="text-xl font-bold text-gradient">
                THE HEROES AGENCY
              </div>

              {/* Navigation */}
              <nav className="flex items-center gap-6 flex-wrap justify-center">
                {navLinks.map(link => link.type === "route" ? (
                  <Link key={link.label} to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                ) : (
                  <button key={link.label} onClick={() => scrollToSection(link.href)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </button>
                ))}
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
                <Link 
                  to="/admin" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" />
                  Admin
                </Link>
              </nav>

              {/* Copyright */}
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>;
}