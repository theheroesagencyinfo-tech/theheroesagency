import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface PictureSource {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
}

interface ResponsiveImageProps {
  picture: PictureSource;
  alt: string;
  sizes?: string;
  className?: string;
  wrapperClassName?: string;
  /** Force eager loading (above the fold). */
  eager?: boolean;
  /** Style aspect ratio override; defaults to intrinsic image ratio. */
  aspectRatio?: string;
  rootMargin?: string;
}

/**
 * Renders an AVIF/WebP <picture> with responsive srcset.
 * Below-the-fold images are deferred via IntersectionObserver until near the viewport.
 */
export function ResponsiveImage({
  picture,
  alt,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className,
  wrapperClassName,
  eager = false,
  aspectRatio,
  rootMargin = "300px",
}: ResponsiveImageProps) {
  const [inView, setInView] = useState(eager);
  const [loaded, setLoaded] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eager || inView) return;
    const node = wrapRef.current;
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
    <div
      ref={wrapRef}
      className={cn("relative w-full overflow-hidden bg-muted/40", wrapperClassName)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/60 via-muted/30 to-muted/60"
        />
      )}
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/60 via-muted/30 to-muted/60"
        />
      )}
      {inView && (
        <picture>
          {Object.entries(picture.sources).map(([type, srcset]) => (
            <source key={type} type={`image/${type}`} srcSet={srcset} sizes={sizes} />
          ))}
          <img
            src={picture.img.src}
            alt={alt}
            width={picture.img.w}
            height={picture.img.h}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={eager ? "high" : "low"}
            sizes={sizes}
            onLoad={() => setLoaded(true)}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-500",
              loaded ? "opacity-100" : "opacity-0",
              className,
            )}
          />
        </picture>
      )}
    </div>
  );
}
