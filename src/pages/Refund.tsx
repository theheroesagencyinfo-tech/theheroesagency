import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";

const Refund = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="Refund Policy — TheHeroes Agency"
      description="Refund terms for TheHeroes Agency's Shopify design, optimization, and consulting services."
      canonical="https://www.theheroesagency.org/refund"
    />
    <Navigation />
    <main className="pt-32 pb-24">
      <article className="container px-4 md:px-6 max-w-5xl mx-auto prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Refund Policy</h1>
        <p className="text-sm text-muted-foreground">Effective Date: July 22, 2026</p>

        <p>
          At TheHeroes Agency, we strive to provide high-quality digital services and an
          exceptional client experience. Because our services involve customized work,
          strategy, and time-based expertise, please review our refund policy before
          purchasing.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">1. Payments & Deposits</h2>
        <p>
          All project payments and deposits are used to reserve time and resources for
          your project.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Deposits are non-refundable once work has commenced.</li>
          <li>
            For projects paid in full upfront, the same refund terms outlined below
            apply.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">2. Before Work Begins</h2>
        <p>
          If you choose to cancel your project before any work has started, you may
          request a refund. Any applicable payment processing or administrative fees may
          be deducted from the refunded amount.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">3. After Work Has Started</h2>
        <p>
          Once work has begun, payments become non-refundable. This is because our
          services involve customized planning, research, design, development,
          optimization, and consulting that cannot be returned.
        </p>
        <p>
          If a project is canceled after work has started, you will receive any
          completed work that has been paid for up to the cancellation date.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">4. Revisions</h2>
        <p>
          Your project includes the number of revisions specified in your proposal or
          service package. We are committed to working with you during those revision
          rounds to ensure the final deliverables align with the agreed project scope.
        </p>
        <p>Requests outside the original scope may require additional fees.</p>

        <h2 className="text-2xl font-bold mt-10 mb-3">5. Performance Disclaimer</h2>
        <p>
          While we use industry best practices and proven strategies, we cannot
          guarantee specific business outcomes such as increased sales, search rankings,
          website traffic, leads, or revenue. As such, refunds are not provided based on
          performance expectations alone.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">6. Client Responsibilities</h2>
        <p>
          Clients are responsible for providing all required content, information,
          approvals, and feedback in a timely manner.
        </p>
        <p>
          If a project remains inactive due to a lack of client response for more than
          30 days, it may be placed on hold. Projects inactive for more than 60 days may
          be considered closed. Any restart may be subject to a reactivation fee.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">7. Exceptional Circumstances</h2>
        <p>
          If TheHeroes Agency is unable to deliver the agreed service due to
          circumstances within our control, we may offer a partial refund, service
          credit, or an alternative solution at our sole discretion.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">8. Chargebacks</h2>
        <p>
          If you have any concerns regarding your project or payment, please contact us
          first so we can work toward a fair resolution.
        </p>
        <p>
          Initiating a chargeback without first attempting to resolve the matter
          directly may result in suspension of services while the dispute is being
          reviewed.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">9. Contact</h2>
        <p>
          If you have any questions about this Refund Policy, please contact{" "}
          <a className="text-primary" href="mailto:theheroesagency.info@gmail.com">
            theheroesagency.info@gmail.com
          </a>{" "}
          before purchasing any of our services. By placing an order, you acknowledge
          that you have read and agreed to this policy.
        </p>
      </article>
    </main>
    <Footer />
  </div>
);

export default Refund;
