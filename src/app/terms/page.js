import SiteShell from "../_site/SiteChrome.jsx";
import { CONTACT_EMAILS } from "../../lib/socialLinks.js";
import { pageMeta } from "../../lib/seo.js";

export const metadata = pageMeta({
  path: "/terms",
  title: "Terms",
  description: "The terms that govern use of the Movianx platform for creators and audiences.",
});

export default function TermsPage() {
  return (
    <SiteShell>
      <header className="mx-hero">
        <div className="mx-eyebrow">Legal</div>
        <h1>Terms of Use</h1>
        <p className="mx-lede">
          These terms govern your use of Movianx. By using the platform, you agree to them. We&rsquo;ve
          kept the language as plain as we can.
        </p>
        <p className="mx-meta">Last updated: June 2026</p>
      </header>

      <section className="mx-section">
        <h2>Platform use</h2>
        <p>
          Movianx provides a premium creative entertainment platform for publishing, discovering, and
          experiencing content. You agree to use the platform lawfully, to respect other users and
          creators, and not to interfere with or misuse the service.
        </p>
      </section>

      <section className="mx-section">
        <h2>Creator content ownership</h2>
        <div className="mx-note">
          <p>
            Creators retain ownership of their original content, while granting Movianx the rights
            necessary to host, stream, display, promote, and operate the content within the platform
            experience.
          </p>
        </div>
        <p>
          This license lets us deliver your work to audiences and present it well across the platform.
          It does not transfer ownership of your content to us.
        </p>
      </section>

      <section className="mx-section">
        <h2>Movianx hosting rights</h2>
        <p>
          To run the service, Movianx may host, encode, store, format, and distribute submitted content
          as needed to make it available across supported experiences and devices, and to promote it
          within the platform.
        </p>
      </section>

      <section className="mx-section">
        <h2>Prohibited content</h2>
        <p>You agree not to upload or share content that:</p>
        <ul>
          <li>Infringes the intellectual property or other rights of anyone else.</li>
          <li>Is unlawful, harmful, harassing, or hateful.</li>
          <li>Is sexually exploitative, especially of minors.</li>
          <li>Contains malware or attempts to compromise the platform or its users.</li>
          <li>Misrepresents its origin or violates applicable laws and regulations.</li>
        </ul>
      </section>

      <section className="mx-section">
        <h2>Subscriptions and payments</h2>
        <p>
          Some features or content may be offered through paid plans or purchases. Where they apply,
          pricing and billing terms will be presented to you before you complete a transaction. Unless
          stated otherwise, fees are charged as described at the point of purchase.
        </p>
      </section>

      <section className="mx-section">
        <h2>In-app playback only</h2>
        <p>
          Content on Movianx is provided for streaming and viewing within the platform experience.
          Unless a feature explicitly allows it, content is intended for in-app playback only.
        </p>
      </section>

      <section className="mx-section">
        <h2>No unauthorized downloading</h2>
        <p>
          You may not copy, download, scrape, redistribute, or otherwise reproduce content from the
          platform except where a feature expressly permits it. Circumventing playback or access
          controls is prohibited.
        </p>
      </section>

      <section className="mx-section">
        <h2>AI-assisted tools</h2>
        <p>
          Movianx offers AI-assisted creative tools to help creators produce and present their work.
          You are responsible for the content you create and publish using these tools, and for
          ensuring you have the rights to the inputs you provide and the outputs you share.
        </p>
      </section>

      <section className="mx-section">
        <h2>Account responsibility</h2>
        <p>
          You are responsible for activity under your account and for keeping your credentials secure.
          Let us know promptly if you believe your account has been compromised.
        </p>
      </section>

      <section className="mx-section">
        <h2>Termination</h2>
        <p>
          You may stop using Movianx at any time. We may suspend or terminate access if these terms are
          violated or where necessary to protect the platform, its creators, or its users. Certain
          provisions, including content licenses needed to operate previously distributed content, may
          survive termination.
        </p>
      </section>

      <section className="mx-section">
        <h2>Contact</h2>
        <p>
          Questions about these terms? Reach us at{" "}
          <a href={`mailto:${CONTACT_EMAILS.general}`}>{CONTACT_EMAILS.general}</a> or visit our{" "}
          <a href="/contact">contact page</a>.
        </p>
      </section>
    </SiteShell>
  );
}
