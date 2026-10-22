// Browser-safe price values shared by packages and legal payment terms.
export const packageAmounts = { "book-presence": 1500, "reader-to-client": 3000, "book-launch": 5500 } as const;

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 }).format(amount);
}

export function threePaymentAmounts(total: number) {
  const cents = Math.round(total * 100);
  const first = Math.floor(cents / 3);
  return [first / 100, first / 100, (cents - first * 2) / 100];
}

export function threePaymentDescription(total: number) {
  const amounts = threePaymentAmounts(total).map(formatPrice);
  return `${amounts[0]}, ${amounts[1]}, and ${amounts[2]} (total ${formatPrice(total)})`;
}