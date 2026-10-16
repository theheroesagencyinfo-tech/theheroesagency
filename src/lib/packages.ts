import { z } from "zod";

export const packageSlugs = ["book-presence", "reader-to-client", "book-launch"] as const;
export type PackageSlug = (typeof packageSlugs)[number];

export const packages: { slug: PackageSlug; name: string; price: string; time: string; popular?: boolean; best: string; outcome: string; cta: string; items: string[] }[] = [
  { slug: "book-presence", name: "Book presence", price: "$1,500", time: "2 weeks", best: "Authors who need a professional home for their book and a way to capture readers.", outcome: "Give readers a clear place to learn about the book, buy it, and join your email list.", cta: "Start with book presence", items: ["Strategy call to define audience, reader journey, and primary next step", "One-page author and book landing page", "Book description, author bio, and testimonials section", "Retailer or preorder links", "Email signup form", "Connection to your email platform", "Mobile optimization", "One round of revisions", "Handover walkthrough"] },
  { slug: "reader-to-client", name: "Reader-to-client system", price: "$3,000", time: "3 weeks", popular: true, best: "Authors who want to build an email list and create inquiries beyond book sales.", outcome: "Turn readers into subscribers, and subscribers into conversations, clients, or speaking opportunities.", cta: "Build my reader-to-client system", items: ["Everything in book presence", "Up to 5-page author website", "Reader-magnet strategy: checklist, workbook, template, excerpt, or short guide", "Reader-magnet landing page", "Email platform setup and tagging structure", "Automated 5-email welcome sequence", "3–5 email post-book nurture sequence", "Clear “work with me,” booking, or speaking inquiry path", "Basic analytics setup", "Two rounds of revisions", "Handover documentation and training"] },
  { slug: "book-launch", name: "Book launch platform", price: "$5,500", time: "4 weeks", best: "Authors preparing for a major launch or building long-term authority.", outcome: "Launch your book with a coordinated website, email, and video campaign.", cta: "Plan my book launch", items: ["Everything in reader-to-client system", "Launch strategy session and roadmap", "Pre-launch page with waitlist or preorder capture", "5–7 email launch sequence", "3 post-launch follow-up emails", "ARC and reviewer outreach page or form", "8–12 social launch graphics", "2–3 AI-powered short vertical video ads", "Ad-ready copy for Meta, Instagram, YouTube, or LinkedIn", "Launch-week support", "Post-launch review call with recommendations"] },
];

export const addons = [
  { id: "extra-page", name: "Additional book or program page", price: "from $350" },
  { id: "email-sequence", name: "Additional 5-email sequence", price: "from $500" },
  { id: "video-ad", name: "Extra AI video ad", price: "from $250" },
  { id: "speaker-page", name: "Speaker page or media kit", price: "from $400" },
  { id: "magnet-copy", name: "Lead-magnet copywriting only", price: "from $400" },
  { id: "email-management", name: "Monthly email management, 2 emails a month", price: "from $500/month" },
  { id: "maintenance", name: "Website maintenance", price: "from $150/month" },
  { id: "ads-management", name: "Paid ads management, excluding ad spend", price: "from $750/month" },
] as const;
export const addonIds = addons.map(a => a.id) as [string, ...string[]];
export const RUSH = { name: "Rush delivery, subject to availability", price: "+$150" };

export const orderStatuses = ["new", "invoice sent", "in progress", "in review", "launched"] as const;

export const orderSchema = z.object({
  package: z.enum(packageSlugs),
  addons: z.array(z.enum(addonIds)).max(addons.length).default([]),
  rush: z.boolean().default(false),
  wants_call: z.boolean().default(false),
  name: z.string().trim().min(1, "Please add your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  book: z.string().trim().min(1, "Tell me your book title or topic").max(200),
  message: z.string().trim().max(3000).default(""),
});
export type OrderInput = z.infer<typeof orderSchema>;
