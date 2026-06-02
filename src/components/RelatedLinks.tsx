import { Link } from "react-router-dom";

const services = [
  { label: "Shopify Expert", href: "/shopify-expert" },
  { label: "Shopify Store Design", href: "/shopify-store-design" },
  { label: "Shopify Optimization (Speed & CRO)", href: "/shopify-optimization" },
  { label: "Shopify Website Fix", href: "/shopify-website-fix" },
  { label: "Shopify Marketing Agency", href: "/shopify-marketing-agency" },
];

const caseStudies = [
  { label: "Portfolio — shipped DTC brands", href: "/portfolio" },
  { label: "About The Heroes Agency", href: "/about" },
  { label: "Book a free strategy call", href: "/#contact" },
];

export function RelatedLinks() {
  return (
    <aside
      aria-label="Related services and case studies"
      className="mt-16 pt-10 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
          Related Shopify services
        </h2>
        <ul className="space-y-2">
          {services.map((s) => (
            <li key={s.href}>
              <Link
                to={s.href}
                className="text-foreground hover:text-primary transition-colors"
              >
                → {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
          Case studies & next steps
        </h2>
        <ul className="space-y-2">
          {caseStudies.map((s) => (
            <li key={s.href}>
              <Link
                to={s.href}
                className="text-foreground hover:text-primary transition-colors"
              >
                → {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default RelatedLinks;
