import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";

export interface PortfolioProject {
  title: string;
  category: string;
  description: string;
  metric: string;
  metricLabel: string;
  image: string;
  url: string;
}

interface ProjectCardProps {
  project: PortfolioProject;
  index: number;
  isVisible: boolean;
  eager?: boolean;
}

export function ProjectCard({ project, index, isVisible, eager = false }: ProjectCardProps) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group block rounded-xl overflow-hidden border border-border/50 bg-card/40 hover:border-primary/40 transition-colors duration-500"
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-muted">
        <LazyImage
          src={project.image}
          alt={`${project.title} — Shopify store screenshot`}
          eager={eager}
          width={1280}
          height={880}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          wrapperClassName="absolute inset-0"
          className="w-full h-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur border border-border/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <ArrowUpRight className="w-4 h-4 text-primary" />
        </div>
      </div>

      <div className="px-5 pt-4 pb-5">
        <div className="flex items-baseline justify-between gap-3 border-b border-border/50 pb-3">
          <span className="font-sans-ui text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">
            {project.category}
          </span>
          <span className="font-sans-ui text-[11px] font-semibold text-primary tabular-nums whitespace-nowrap">
            {project.metric}
          </span>
        </div>
        <h3 className="mt-3 font-serif-display text-2xl leading-[1.15] text-foreground group-hover:text-primary transition-colors duration-300">
          {project.title}
        </h3>
        <p className="mt-2 font-sans-ui text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {project.description}
        </p>
      </div>
    </motion.a>
  );
}
