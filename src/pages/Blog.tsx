import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_name: string;
  published_at: string | null;
  created_at: string;
}

export default function Blog() {
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
        .order("published_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Blog — Shopify & eCommerce Growth Insights"
        description="Strategies, frameworks and lessons on Shopify design, marketing automation, AI commercials and conversion for ambitious DTC brands."
        canonical="https://www.theheroesagency.org/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "TheHeroes Agency Blog",
          url: "https://www.theheroesagency.org/blog",
          description:
            "Insights on Shopify design, marketing automation, AI commercials and eCommerce growth.",
          isPartOf: {
            "@type": "WebSite",
            name: "The Heroes Agency",
            url: "https://www.theheroesagency.org/",
          },
          hasPart: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `https://www.theheroesagency.org/blog/${p.slug}`,
            datePublished: p.published_at || p.created_at,
            author: { "@type": "Person", name: p.author_name },
          })),
        }}
      />
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">
              Blog
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Insights & <span className="text-gradient">Resources</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expert tips, strategies, and industry insights to help your eCommerce business thrive.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center max-w-2xl mx-auto">
              <p className="text-muted-foreground mb-4">No blog posts yet.</p>
              <Link to="/">
                <Button variant="outline" className="glass">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1500px] mx-auto">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="glass rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-500"
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
                    <h2 className="text-xl font-bold mb-2 group-hover:text-gradient transition-all duration-300">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground line-clamp-3 mb-4">
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
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
