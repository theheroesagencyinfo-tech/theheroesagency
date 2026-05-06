import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Root margin for the IntersectionObserver. Defaults to 200px ahead of viewport. */
  rootMargin?: string;
  /** Optional wrapper className for the placeholder shell (controls aspect/size). */
  wrapperClassName?: string;
  /** When true, skip lazy logic and load immediately (above-the-fold). */
  eager?: boolean;
}

/**
 * IntersectionObserver-driven lazy image with a lightweight skeleton placeholder.
 * Falls back to native loading="lazy" on browsers without IO.
 */
export function LazyImage({
  src,
  alt,
  className,
  wrapperClassName,
  rootMargin = "200px",
  eager = false,
  width,
  height,
  sizes,
  ...rest
}: LazyImageProps) {
  const [inView, setInView] = useState(eager);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (eager || inView) return;
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { rootMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [eager, inView, rootMargin]);

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-muted/40", wrapperClassName)}>
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/60 via-muted/30 to-muted/60"
        />
      )}
      <img
        ref={ref}
        src={inView ? src : undefined}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "low"}
        width={width}
        height={height}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        className={cn(
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        {...rest}
      />
    </div>
  );
}
