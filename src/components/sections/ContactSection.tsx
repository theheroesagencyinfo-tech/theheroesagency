import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useMouseGlow } from "@/hooks/useMouseGlow";
import { ContactForm } from "@/components/ContactForm";

export function ContactSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const sectionRef = useMouseGlow<HTMLElement>();

  return (
    <section id="contact" ref={sectionRef} className="py-24 relative cursor-glow">
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Let's <span className="text-gradient">Start Your Project</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your Shopify store? Fill out the form below and 
            we'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a 
                      href="mailto:info@theheroesagency.org" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      info@theheroesagency.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <a 
                      href="tel:+1 (315) 454- 1290" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +1 (315) 454- 1290
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">
                      Remote-first, Worldwide
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Response Time</h3>
              <p className="text-muted-foreground">
                We typically respond within <span className="text-primary font-semibold">24 hours</span>. 
                For urgent inquiries, please mention it in your message.
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="glass rounded-2xl p-6 md:p-8">
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
