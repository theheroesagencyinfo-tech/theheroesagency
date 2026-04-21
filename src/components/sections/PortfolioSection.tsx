import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useMouseGlow } from "@/hooks/useMouseGlow";

const projects = [
  {
    title: "Retrospec",
    category: "Bikes & Outdoor",
    description: "E-bikes, paddle boards, and outdoor gear with intuitive product quizzes and seamless shopping experience.",
    results: "Adventure Lifestyle Brand",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    url: "https://retrospec.com",
  },
  {
    title: "Darn Tough",
    category: "Premium Socks",
    description: "Vermont-made merino wool socks with lifetime guarantee. Advanced filtering and subscription options.",
    results: "Lifetime Warranty Leader",
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&h=400&fit=crop",
    url: "https://darntough.com",
  },
  {
    title: "TRNDA",
    category: "Luxury Watches",
    description: "Egyptian-inspired timepiece collections with elegant product showcases and global shipping integration.",
    results: "Premium Watch Brand",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=400&fit=crop",
    url: "https://trnda.com",
  },
  {
    title: "Weightlifting House",
    category: "Athletic Apparel",
    description: "Official IWF streaming partner's store featuring champion-endorsed gear with 3-for-2 bundle system.",
    results: "70K+ Orders Shipped",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
    url: "https://ukstore.weightliftinghouse.com",
  },
  {
    title: "Goondiwindi Cotton",
    category: "Australian Fashion",
    description: "Farm-to-fashion Australian cotton brand with seasonal collections and immersive brand storytelling.",
    results: "Heritage Cotton Brand",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop",
    url: "https://goondiwindicotton.com.au",
  },
  {
    title: "Nevuu",
    category: "Tech Accessories",
    description: "Premium tech accessories and lifestyle products with sleek product photography and streamlined checkout.",
    results: "Modern Tech Brand",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
    url: "https://www.nevuu.com",
  },
  {
    title: "HHG Products",
    category: "Home & Garden",
    description: "Quality home and garden products with user-friendly navigation and comprehensive product catalogs.",
    results: "Home Essentials Leader",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    url: "https://hhgproducts.com",
  },
];

function ProjectCard({
  title,
  category,
  description,
  results,
  image,
  url,
  isVisible,
  index,
}: {
  title: string;
  category: string;
  description: string;
  results: string;
  image: string;
  url: string;
  isVisible: boolean;
  index: number;
}) {
  const cardRef = useMouseGlow<HTMLAnchorElement>();
  return (
    <motion.a
      ref={cardRef}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="card-spotlight group glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 cursor-pointer block"
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
          <ExternalLink className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <span className="text-primary text-xs font-semibold uppercase tracking-wider">
          {category}
        </span>
        <h3 className="text-xl font-bold text-foreground mt-2 mb-3 group-hover:text-gradient transition-all duration-300 flex items-center gap-2">
          {title}
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.a>
  );
}

export function PortfolioSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const sectionRef = useMouseGlow<HTMLElement>();

  return (
    <section id="portfolio" ref={sectionRef} className="py-24 relative cursor-glow">
      <div className="container px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
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
