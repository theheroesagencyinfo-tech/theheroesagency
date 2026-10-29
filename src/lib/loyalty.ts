export type LoyaltyLevel = { level: number; title: string; badge: string; min: number; perk: string };

/** Seven loyalty levels, unlocked by the number of authors a client refers who create an account. */
export const LEVELS: LoyaltyLevel[] = [
  { level: 1, title: "Author Advocate", badge: "The Quilled Nib", min: 0, perk: "Your personal referral code, share link and live tracking." },
  { level: 2, title: "Studio Patron", badge: "The Bound Folio", min: 1, perk: "$100 studio credit toward revisions, maintenance or add-ons." },
  { level: 3, title: "Literary Circle", badge: "The Golden Laurel", min: 2, perk: "A free 45-minute conversion review of your site." },
  { level: 4, title: "Studio Ambassador", badge: "The Wax Seal", min: 3, perk: "Priority scheduling on every future project and update." },
  { level: 5, title: "Distinguished Fellow", badge: "The Sapphire Crest", min: 5, perk: "A free book launch announcement kit for your next release." },
  { level: 6, title: "Master Bibliophile", badge: "The Crowned Quill", min: 8, perk: "A lifetime 15% discount on packages, add-ons and retainers." },
  { level: 7, title: "TheHeroes Luminary", badge: "The Obsidian Star", min: 12, perk: "A featured spotlight on our site and a private advisory line with Mou." },
];

export function levelFor(referrals: number): LoyaltyLevel {
  let current = LEVELS[0]!;
  for (const l of LEVELS) if (referrals >= l.min) current = l;
  return current;
}

export function nextLevel(referrals: number): LoyaltyLevel | null {
  return LEVELS.find(l => l.min > referrals) ?? null;
}

export function referralLink(origin: string, code: string) {
  return `${origin}/?ref=${encodeURIComponent(code)}`;
}

export const REF_STORAGE_KEY = "theheroes_ref";
export const isReferralCode = (c: string) => /^HERO-[A-Z0-9]{6}$/.test(c);
