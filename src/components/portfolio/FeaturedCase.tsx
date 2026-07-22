import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import { MetricCell } from "./MetricCell";
import type { PortfolioProject } from "./ProjectCard";

interface FeaturedCaseProps {
  project: PortfolioProject;
  isVisible: boolean;
  metrics?: Array<{ value: string; label: string }>;
  issueNumber?: string;
}

export function FeaturedCase({ project, isVisible, metrics, issueNumber }: FeaturedCaseProps) {
  const displayMetrics = metrics ?? [
    { value: project.metric, label: project.metricLabel },
    { value: "4.9★", label: "Client rating" },
    { value: "< 12h", label: "First reply" },
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-2xl border border-border/50 bg-card/30 overflow-hidden p-6 md:p-10"
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="lg:col-span-7 group relative block aspect-[16/10] overflow-hidden rounded-xl bg-muted"
        aria-label={`Open ${project.title} live store`}
      >
        <LazyImage
          src={project.image}
          alt={`${project.title} — featured Shopify case study`}
          eager
          width={1600}
          height={1000}
          sizes="(min-width: 1024px) 58vw, 100vw"
          wrapperClassName="absolute inset-0"
          className="w-full h-full object-cover object-top transition-transform duration-[1000ms] ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-background/85 backdrop-blur border border-border/60">
          <span className="font-sans-ui text-[10px] uppercase tracking-[0.22em] text-foreground">
            Featured case
          </span>
        </div>
      </a>

      <div className="lg:col-span-5">
        <div className="flex items-center gap-3 font-sans-ui text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {issueNumber && <span className="text-primary">{issueNumber}</span>}
          <span className="h-px w-6 bg-border" />
          <span>{project.category}</span>
        </div>

        <h3 className="mt-4 font-serif-display text-4xl md:text-5xl leading-[1.05] text-foreground">
          {project.title}
        </h3>

        <p className="mt-5 font-sans-ui text-base md:text-lg text-muted-foreground leading-relaxed">
          {project.description}
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4 py-6 border-y border-border/50">
          {displayMetrics.map((m) => (
            <MetricCell key={m.label} value={m.value} label={m.label} />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans-ui text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            View live store
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <span className="hidden sm:inline text-border">•</span>
          <a
            href="/free-audit"
            className="inline-flex items-center gap-2 font-sans-ui text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Get a build like this →
          </a>
        </div>
      </div>
    </motion.article>
  );
}
