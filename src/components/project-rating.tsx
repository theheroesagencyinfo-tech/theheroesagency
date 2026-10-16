import { useQuery } from "@tanstack/react-query";
import { getProjectRatings } from "@/lib/project-reviews.functions";

export function ProjectRating({ project }: { project: string }) {
  const { data } = useQuery({
    queryKey: ["project-ratings"],
    queryFn: () => getProjectRatings(),
    staleTime: 5 * 60 * 1000,
  });
  const rating = data?.[project];
  if (!rating || rating.count < 1) return null;
  const filled = Math.round(rating.avg);
  return (
    <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
      <span aria-hidden="true" className="tracking-[0.15em]">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < filled ? "text-primary" : "text-ring/30"}>★</span>
        ))}
      </span>
      <span className="text-muted-foreground">
        {rating.avg.toFixed(1)} out of 5 ({rating.count} {rating.count === 1 ? "review" : "reviews"})
      </span>
    </p>
  );
}
