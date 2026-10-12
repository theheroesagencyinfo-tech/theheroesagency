import workspace from "@/assets/author-workspace.jpg";
import website from "@/assets/quiet-advantage-concept.jpg";
import email from "@/assets/email-workspace.jpg";
import launch from "@/assets/book-launch.jpg";

export const studioImages = {
  workspace: { src: workspace, alt: "Manuscript, notebook, and navy books on a sunlit writing desk" },
  website: { src: website, alt: "Illustrative concept for The Quiet Advantage fictional author website and book" },
  email: { src: email, alt: "Newsletter planning beside a laptop and manuscript" },
  launch: { src: launch, alt: "Book trailer editing and social launch graphics arranged on a desk" },
};

export function StudioImage({ image, className = "", eager = false }: { image: keyof typeof studioImages; className?: string; eager?: boolean }) {
  const asset = studioImages[image];
  return <img src={asset.src} alt={asset.alt} width={1536} height={1024} loading={eager ? "eager" : "lazy"} className={`aspect-[3/2] w-full object-cover ${className}`} />;
}