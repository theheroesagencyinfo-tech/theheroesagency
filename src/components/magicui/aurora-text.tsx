import { cn } from "@/lib/utils";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * AuroraText — animated multi-stop gradient text in the brand sky palette.
 */
export function AuroraText({
  children,
  className,
  as: Tag = "span",
}: AuroraTextProps) {
  return (
    <Tag
      className={cn(
        "inline-block bg-clip-text text-transparent animate-aurora",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(110deg, hsl(var(--sky-deep)) 0%, hsl(var(--sky)) 25%, hsl(var(--sky-glow)) 50%, hsl(var(--sky)) 75%, hsl(var(--sky-deep)) 100%)",
        backgroundSize: "200% 200%",
      }}
    >
      {children}
    </Tag>
  );
}
