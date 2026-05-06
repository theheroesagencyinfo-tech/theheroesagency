import { useState } from "react";
import { ImageOff } from "lucide-react";
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
}

/**
 * Renders an AVIF/WebP <picture> with responsive srcset.
 * Uses native lazy loading so tiles always stay mounted and visible while scrolling.
 */
export function ResponsiveImage({
  picture,
  alt,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className,
  wrapperClassName,
  eager = false,
  aspectRatio,
}: ResponsiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const ratio = aspectRatio ?? `${picture.img.w} / ${picture.img.h}`;
  return (
    <div
      className={cn("relative w-full overflow-hidden bg-muted/40", wrapperClassName)}
      style={{ aspectRatio: ratio }}
    >
      {!loaded && !errored && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/60 via-muted/30 to-muted/60"
        />
      )}
      {errored ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted/60 via-background/40 to-muted/60 text-muted-foreground p-4 text-center"
        >
          <ImageOff className="h-8 w-8 opacity-70" aria-hidden="true" />
          <span className="text-xs font-medium line-clamp-2 max-w-[90%]">{alt || "Image unavailable"}</span>
        </div>
      ) : (
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
            {...{ fetchpriority: eager ? "high" : "auto" }}
            sizes={sizes}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
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

