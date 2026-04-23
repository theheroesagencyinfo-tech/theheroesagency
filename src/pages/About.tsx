import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Megaphone,
  Video,
  Workflow,
  Target,
  Layers,
  Rocket,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { SystemAuditForm } from "@/components/SystemAuditForm";
import founderImg from "@/assets/founder-mou-barrac.jpeg";

const services = [
  {
    icon: ShoppingBag,
    title: "Shopify Design & Development",
    desc: "High-performance eCommerce experiences engineered for conversion, speed, and scalability.",
  },
  {
    icon: Megaphone,
    title: "Marketing Systems",
    desc: "Structured funnels and campaigns designed to turn attention into measurable revenue.",
  },
  {
    icon: Video,
    title: "AI Video Production",
    desc: "Content pipelines powered by AI—built for consistency, volume, and impact.",
  },
  {
    icon: Workflow,
    title: "Automation Infrastructure",
    desc: "Workflows that eliminate manual processes and enable efficient scaling.",
  },
];

const process = [
  { num: "01", icon: Target, title: "Map the System", desc: "We analyse your current setup and define a scalable architecture." },
  { num: "02", icon: Layers, title: "Build the Assets", desc: "Web, content, and automation—developed as a unified system." },
  { num: "03", icon: Rocket, title: "Deploy & Integrate", desc: "Everything is connected, tested, and aligned for performance." },
  { num: "04", icon: TrendingUp, title: "Optimise & Scale", desc: "We refine based on data and expand what works." },
];

const principles = ["Precision over noise", "Systems over shortcuts", "Performance over aesthetics alone"];
const outcomes = ["Converts more efficiently", "Operates with less friction", "Scales without breaking"];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />
      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="container px-4 md:px-6 mb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">About</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                We build systems that <span className="text-gradient">drive growth.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                TheHeroes Agency operates at the intersection of design, marketing, and automation—delivering structured digital
                solutions for brands that want to scale with precision.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Founded by <span className="text-foreground font-semibold">Mou Barrac</span>, the agency was built on a simple
                principle: most businesses don't need more tools—they need better systems.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 via-primary/10 to-transparent rounded-3xl blur-2xl" />
              <div className="relative glass rounded-3xl p-3 gold-glow-sm">
                <img
                  src={founderImg}
                  alt="Mou Barrac, Founder of TheHeroes Agency"
                  className="w-full h-auto rounded-2xl object-cover aspect-[4/5]"
                />
                <div className="absolute bottom-6 left-6 right-6 glass rounded-xl px-4 py-3 border border-primary/20">
                  <p className="text-sm font-semibold text-foreground">Mou Barrac</p>
                  <p className="text-xs text-muted-foreground">Founder & Lead Strategist</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What We Do */}
        <section className="container px-4 md:px-6 mb-24">
          <motion.div {...fadeUp} className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What We Do</h2>
            <p className="text-muted-foreground text-lg">
              We don't offer disconnected services. We design integrated ecosystems where every component works together.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="glass rounded-2xl p-8 border border-white/5 hover:border-primary/30 transition-all duration-500 group"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* How We Work */}
        <section className="container px-4 md:px-6 mb-24">
          <motion.div {...fadeUp} className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How We Work</h2>
            <p className="text-muted-foreground text-lg">Every project is approached with clarity and structure.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative glass rounded-2xl p-6 border border-white/5 hover:border-primary/30 transition-all duration-500"
                >
                  <span className="text-5xl font-bold text-gradient opacity-30 absolute top-4 right-4">{p.num}</span>
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Philosophy */}
        <section className="container px-4 md:px-6 mb-24">
          <motion.div {...fadeUp} className="glass rounded-3xl p-10 md:p-16 border border-primary/10 gold-glow-sm">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Philosophy</h2>
                <p className="text-muted-foreground text-lg mb-6">We prioritise:</p>
                <ul className="space-y-3">
                  {principles.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4 md:border-l md:border-white/10 md:pl-12 flex flex-col justify-center">
                <p className="text-2xl md:text-3xl font-bold leading-snug">Design is not decoration.</p>
                <p className="text-2xl md:text-3xl font-bold leading-snug">Marketing is not guesswork.</p>
                <p className="text-2xl md:text-3xl font-bold leading-snug text-gradient">Automation is not optional.</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Outcome */}
        <section className="container px-4 md:px-6 mb-24">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Outcome</h2>
            <p className="text-muted-foreground text-lg mb-10">The result is a business that:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {outcomes.map((o, i) => (
                <motion.div
                  key={o}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-xl p-6 border border-white/5"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-3" />
                  <p className="font-semibold">{o}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* System Audit Form */}
        <section className="container px-4 md:px-6 mb-24">
          <div className="max-w-4xl mx-auto">
            <SystemAuditForm />
          </div>
        </section>

        {/* CTA */}
        <section className="container px-4 md:px-6">
          <motion.div {...fadeUp} className="relative overflow-hidden rounded-3xl glass border border-primary/20 p-10 md:p-16 text-center gold-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Work With Us</h2>
              <p className="text-muted-foreground text-lg mb-2 max-w-2xl mx-auto">
                If you're building for growth and need structure behind your brand, we can help.
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gradient mb-8">Build a system. Not just a brand.</p>
              <Link to="/#contact">
                <Button size="lg" className="gradient-gold text-primary-foreground font-semibold hover:scale-105 transition-transform duration-300">
                  Start a Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
