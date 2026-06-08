import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { RelatedLinks } from "@/components/RelatedLinks";
import { BlogCoverFallback } from "@/components/BlogCoverFallback";
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
  updated_at?: string | null;
  focus_keyword?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string[] | null;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        navigate("/blog");
        return;
      }
      setPost(data as BlogPost);
    } catch (error) {
      import.meta.env.DEV && console.error("Error fetching blog post:", error);
      navigate("/blog");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!post) return null;

  const sanitizedContent = DOMPurify.sanitize(post.content, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur", "onchange", "onsubmit"],
  });

  const postUrl = `https://www.theheroesagency.org/blog/${post.slug}`;
  const plainText = post.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const fallbackExcerpt = (post.excerpt || plainText).trim();
  const description = (post.meta_description?.trim()) ||
    (fallbackExcerpt.length > 155 ? `${fallbackExcerpt.slice(0, 152)}...` : fallbackExcerpt);
  const title = (post.meta_title?.trim()) ||
    (post.title.length > 58 ? `${post.title.slice(0, 55)}...` : post.title);
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  const titleKeywords = post.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const focusKw = post.focus_keyword?.trim().toLowerCase();
  const keywords = Array.from(
    new Set([
      ...(focusKw ? [focusKw] : []),
      ...((post.keywords || []).map((k) => k.toLowerCase())),
      ...titleKeywords,
    ]),
  ).slice(0, 10);
  const datePublished = post.published_at || post.created_at;
  const dateModified = post.updated_at || datePublished;

  const articleSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: post.author_name,
      url: "https://www.theheroesagency.org/about",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    publisher: {
      "@type": "Organization",
      name: "The Heroes Agency",
      url: "https://www.theheroesagency.org/",
      logo: {
        "@type": "ImageObject",
        url: "https://www.theheroesagency.org/placeholder.svg",
      },
    },
    wordCount,
    keywords: keywords.join(", "),
    inLanguage: "en-US",
    articleSection: "eCommerce & Shopify",
    url: postUrl,
  };
  if (post.cover_image_url) {
    articleSchema.image = {
      "@type": "ImageObject",
      url: post.cover_image_url,
      width: 1600,
      height: 900,
    };
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.theheroesagency.org/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.theheroesagency.org/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={title}
        description={description}
        canonical={postUrl}
        image={post.cover_image_url || undefined}
        type="article"
        jsonLd={[articleSchema, breadcrumbSchema]}
      />

      <Navigation />
      <main className="pt-24 pb-16">
        <article className="container px-4 md:px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/blog">
              <Button variant="ghost" className="mb-8 -ml-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            <div className="aspect-video rounded-2xl overflow-hidden mb-8 border border-white/10">
              {post.cover_image_url ? (
                <img
                  src={post.cover_image_url}
                  alt={`${post.title} — illustration for The Heroes Agency blog post`}
                  width={1600}
                  height={900}
                  decoding="async"
                  className="w-full h-full object-cover"
                  {...({ fetchpriority: "high" } as Record<string, string>)}
                />
              ) : (
                <BlogCoverFallback title={post.title} />
              )}
            </div>


            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author_name}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div
              className="prose prose-lg prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-14 prose-h2:mb-5
                prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                prose-p:text-foreground/85 prose-p:leading-[1.85] prose-p:my-6
                prose-strong:text-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-ul:my-6 prose-ol:my-6 prose-li:my-2 prose-li:leading-[1.8]
                prose-blockquote:border-l-primary prose-blockquote:text-foreground/90 prose-blockquote:not-italic
                prose-hr:my-12 prose-hr:border-border/40"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            <RelatedLinks />
          </motion.div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
