import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useMouseGlow } from "@/hooks/useMouseGlow";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_name: string;
  published_at: string | null;
  created_at: string;
}

function BlogCard({ post, index, isVisible }: { post: BlogPost; index: number; isVisible: boolean }) {
  const cardRef = useMouseGlow<HTMLElement>();
  return (
    <motion.article
      ref={cardRef as any}
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="card-spotlight glass rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-500"
    >
      {post.cover_image_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(post.published_at || post.created_at).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {post.author_name}
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-gradient transition-all duration-300">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-muted-foreground line-clamp-2 mb-4">
            {post.excerpt}
          </p>
        )}
        <Link to={`/blog/${post.slug}`}>
          <Button variant="ghost" className="p-0 hover:bg-transparent group/btn">
            Read More
            <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </motion.article>
  );
}

export function BlogSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const sectionRef = useMouseGlow<HTMLElement>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      import.meta.env.DEV && console.error("Error fetching blog posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || posts.length === 0) return null;

  return (
    <section id="blog" ref={sectionRef} className="py-24 relative cursor-glow">
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">
            Blog
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Latest <span className="text-gradient">Insights</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tips, strategies, and insights to help you grow your eCommerce business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto">
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} isVisible={isVisible} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Link to="/blog">
            <Button variant="outline" className="glass">
              View All Posts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
