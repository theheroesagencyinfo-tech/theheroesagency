import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const projects = [
  {
    title: "Luxe Skincare Co.",
    category: "Beauty & Cosmetics",
    description: "Complete Shopify Plus migration with custom theme development and subscription integration.",
    results: "+180% Conversion Rate",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop",
  },
  {
    title: "Urban Threads",
    category: "Fashion & Apparel",
    description: "High-fashion streetwear brand with advanced filtering, lookbook features, and international shipping.",
    results: "$2.4M First Year Revenue",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
  },
  {
    title: "Peak Performance Gear",
    category: "Sports & Outdoors",
    description: "Adventure sports equipment store with 3D product visualization and comparison tools.",
    results: "+245% Average Order Value",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop",
  },
  {
    title: "Artisan Home Goods",
    category: "Home & Living",
    description: "Handcrafted furniture marketplace with AR preview, custom configurator, and white-glove delivery.",
    results: "+320% Mobile Conversions",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
  },
];

function ProjectCard({ 
  title, 
  category, 
  description, 
  results, 
  image,
  isVisible,
  index 
}: { 
  title: string; 
  category: string; 
  description: string; 
  results: string;
  image: string;
  isVisible: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="group glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* Results badge */}
        <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full gradient-gold">
          <span className="text-sm font-bold text-primary-foreground">{results}</span>
        </div>
        
        {/* Arrow icon */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <ArrowUpRight className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <span className="text-primary text-xs font-semibold uppercase tracking-wider">
          {category}
        </span>
        <h3 className="text-xl font-bold text-foreground mt-2 mb-3 group-hover:text-gradient transition-all duration-300">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export function PortfolioSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="portfolio" className="py-24 relative">
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
            Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of high-performing Shopify stores that showcase 
            the power of strategic design and optimization.
          </p>
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.title} 
              {...project} 
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
