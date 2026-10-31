export type LoyaltyLevel = {
  level: number; title: string; badge: string; min: number; perk: string;
  discount: number; teaser: boolean; priority: "none" | "priority" | "vip"; strategy: boolean;
};

/** Seven tiers, unlocked by converted referrals (referred author paid a deposit or first invoice). */
export const LEVELS: LoyaltyLevel[] = [
  { level: 1, title: "Author Advocate", badge: "The Quilled Nib", min: 0, discount: 0, teaser: false, priority: "none", strategy: false, perk: "Your personal referral link and live dashboard tracker." },
  { level: 2, title: "Studio Patron", badge: "The Bound Folio", min: 1, discount: 100, teaser: false, priority: "none", strategy: false, perk: "$100 off every eligible project." },
  { level: 3, title: "Literary Circle", badge: "The Golden Laurel", min: 2, discount: 200, teaser: false, priority: "none", strategy: false, perk: "$200 off every eligible project." },
  { level: 4, title: "Studio Ambassador", badge: "The Wax Seal", min: 3, discount: 300, teaser: true, priority: "none", strategy: false, perk: "$300 off every eligible project and a free 30-second teaser for every new book." },
  { level: 5, title: "Distinguished Fellow", badge: "The Sapphire Crest", min: 5, discount: 400, teaser: true, priority: "priority", strategy: false, perk: "$400 off every eligible project, a free book teaser per new book and priority support." },
  { level: 6, title: "Master Bibliophile", badge: "The Crowned Quill", min: 7, discount: 500, teaser: true, priority: "priority", strategy: false, perk: "$500 off every eligible project, a free book teaser per new book and priority support." },
  { level: 7, title: "TheHeroes Luminary", badge: "The Obsidian Star", min: 10, discount: 750, teaser: true, priority: "vip", strategy: true, perk: "$750 off every eligible project, a free book teaser per new book, VIP priority support and an annual strategy session." },
];

export function levelFor(referrals: number): LoyaltyLevel {
  let current = LEVELS[0]!;
  for (const l of LEVELS) if (referrals >= l.min) current = l;
  return current;
}

export function nextLevel(referrals: number): LoyaltyLevel | null {
  return LEVELS.find(l => l.min > referrals) ?? null;
}

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export type TierState = { level: LoyaltyLevel; earnedAt: Date | null; expiresAt: Date | null; converted: number; overridden: boolean };

/**
 * A tier stays active for 12 months from the date it was earned. After that the client keeps it
 * only while they hold the required number of conversions within the last 12 months.
 */
export function tierFrom(convertedAt: (string | Date)[], now: Date = new Date(), override?: number | null): TierState {
  const dates = convertedAt.map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
  const rolling = dates.filter(d => now.getTime() - d.getTime() < YEAR_MS).length;
  let best: TierState = { level: LEVELS[0]!, earnedAt: null, expiresAt: null, converted: dates.length, overridden: false };
  for (const l of LEVELS.slice(1)) {
    const earned = dates[l.min - 1];
    if (!earned) break;
    const expires = new Date(earned.getTime() + YEAR_MS);
    if (now < expires || rolling >= l.min) best = { level: l, earnedAt: earned, expiresAt: now < expires ? expires : null, converted: dates.length, overridden: false };
  }
  if (override) best = { ...best, level: LEVELS[override - 1] ?? best.level, overridden: true };
  return best;
}

export function referralLink(origin: string, code: string) {
  return `${origin}/?ref=${encodeURIComponent(code)}`;
}

export const REFERRAL_STATUSES = ["pending", "contacted", "booked", "converted", "rejected"] as const;
export const TEASER_STATUSES = ["requested", "in_production", "delivered", "rejected"] as const;
export const statusText = (s: string) => (s.charAt(0).toUpperCase() + s.slice(1)).replace("_", " ");

export const REF_STORAGE_KEY = "theheroes_ref";
export const isReferralCode = (c: string) => /^HERO-[A-Z0-9]{6}$/.test(c);
