import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/sections/Footer";
import { SEO } from "@/components/SEO";

const Privacy = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="Privacy Policy — TheHeroes Agency"
      description="How TheHeroes Agency collects, uses and protects information you share via our website, forms and live chat."
      canonical="https://theheroesagency.lovable.app/privacy"
    />
    <Navigation />
    <main className="pt-32 pb-24">
      <article className="container px-4 md:px-6 max-w-3xl mx-auto prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Who we are</h2>
        <p>
          The Heroes Agency ("we", "us") provides eCommerce design, marketing and
          automation services. This policy explains how we handle information you
          share with us through this website.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Information we collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Contact details you submit via forms (name, email, phone, company).</li>
          <li>Project information you choose to share when requesting a quote.</li>
          <li>Live chat messages you send us, along with your name and email if provided.</li>
          <li>Basic technical data (IP address, browser, referring URL) for security and analytics.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">How we use it</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To respond to your enquiry and deliver requested services.</li>
          <li>To improve our website, content and offerings.</li>
          <li>To comply with legal obligations.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Sharing</h2>
        <p>
          We do not sell your personal information. We share data only with
          processors that help us run the site (hosting, email, analytics) and
          when required by law.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Your rights</h2>
        <p>
          You may request access, correction or deletion of your personal data
          at any time by emailing{" "}
          <a className="text-primary" href="mailto:theheroesagency.info@gmail.com">
            theheroesagency.info@gmail.com
          </a>
          .
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Contact</h2>
        <p>
          Questions about this policy? Reach us at{" "}
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

export default Privacy;
