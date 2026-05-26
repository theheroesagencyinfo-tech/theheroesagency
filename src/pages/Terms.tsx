import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";

const Terms = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="Terms of Service — TheHeroes Agency"
      description="The terms that govern your use of TheHeroes Agency website, content and contact channels."
      canonical="https://theheroesagency.lovable.app/terms"
    />
    <Navigation />
    <main className="pt-32 pb-24">
      <article className="container px-4 md:px-6 max-w-3xl mx-auto prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Acceptance</h2>
        <p>
          By using this website you agree to these Terms. If you do not agree,
          please do not use the site.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Services</h2>
        <p>
          Project work is governed by a separate written agreement (proposal,
          statement of work or order form) signed between you and The Heroes
          Agency. Nothing on this site is a binding offer to provide services.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Acceptable use</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Do not attempt to disrupt, reverse-engineer or attack the site.</li>
          <li>Do not submit unlawful, harmful or infringing content via forms or chat.</li>
          <li>Do not impersonate another person or organisation.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Intellectual property</h2>
        <p>
          All content on this site (text, images, design, code) is owned by or
          licensed to The Heroes Agency and is protected by intellectual
          property law. You may not reuse it without written permission.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Disclaimer & liability</h2>
        <p>
          The site is provided "as is" without warranties. To the maximum extent
          permitted by law we are not liable for any indirect, incidental or
          consequential damages arising from your use of the site.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Changes</h2>
        <p>
          We may update these Terms from time to time. Continued use of the site
          after changes constitutes acceptance of the updated Terms.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Contact</h2>
        <p>
          Questions? Email{" "}
          <a className="text-primary" href="mailto:theheroesagency.info@gmail.com">
            theheroesagency.info@gmail.com
          </a>
          .
        </p>
      </article>
    </main>
    <Footer />
  </div>
);

export default Terms;
