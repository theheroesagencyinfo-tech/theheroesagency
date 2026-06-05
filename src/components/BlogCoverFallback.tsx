import { Sparkles } from "lucide-react";

/**
 * Branded placeholder shown when a blog post has no cover image yet.
 * Dark sky-blue gradient with subtle pattern + title.
 */
export function BlogCoverFallback({ title, className = "" }: { title: string; className?: string }) {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background:
          "radial-gradient(120% 80% at 20% 0%, hsl(var(--primary) / 0.35), transparent 60%), radial-gradient(100% 80% at 100% 100%, hsl(var(--primary) / 0.25), transparent 60%), linear-gradient(135deg, hsl(220 30% 8%), hsl(220 40% 4%))",
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.4) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative z-10 px-6 py-8 text-center">
        <Sparkles className="w-6 h-6 text-primary mx-auto mb-3 opacity-80" />
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-2">The Heroes Agency</p>
        <h3 className="text-base md:text-lg font-semibold text-white/90 line-clamp-3 max-w-md">
          {title}
        </h3>
      </div>
    </div>
  );
}
