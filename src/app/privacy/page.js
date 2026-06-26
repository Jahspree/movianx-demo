import SiteShell from "../_site/SiteChrome.jsx";
import { CONTACT_EMAILS } from "../../lib/socialLinks.js";
import { pageMeta } from "../../lib/seo.js";

export const metadata = pageMeta({
  path: "/privacy",
  title: "Privacy",
  description: "How Movianx collects, uses, and protects information across the platform.",
});

export default function PrivacyPage() {
  return (
    <SiteShell>
      <header className="mx-hero">
        <div className="mx-eyebrow">Legal</div>
        <h1>Privacy Policy</h1>
        <p className="mx-lede">
          This policy explains what information Movianx collects, how we use it, and the choices you
          have. We aim to keep it clear and practical.
        </p>
        <p className="mx-meta">Last updated: June 2026</p>
      </header>

      <section className="mx-section">
        <h2>Information we collect</h2>
        <p>We collect information you provide and information generated as you use Movianx, including:</p>
        <ul>
          <li><strong>Account information</strong> — details you give when you create or manage an account, such as your name, email, and profile information.</li>
          <li><strong>Creator uploads</strong> — content you submit to publish, along with the titles, descriptions, and metadata you attach to it.</li>
          <li><strong>Usage information</strong> — how you interact with the platform, such as what you view, play, or engage with.</li>
          <li><strong>Device and technical data</strong> — basic information like browser type and general location needed to deliver and secure the service.</li>
          <li><strong>Communications</strong> — messages you send us, including support requests and inquiries.</li>
        </ul>
      </section>

      <section className="mx-section">
        <h2>How information is used</h2>
        <ul>
          <li>To operate, maintain, and improve the Movianx platform and experience.</li>
          <li>To deliver content, power discovery, and personalize what you see.</li>
          <li>To support creators in publishing, presenting, and growing their work.</li>
          <li>To communicate with you about your account, updates, and the service.</li>
          <li>To keep the platform safe, secure, and free of abuse.</li>
        </ul>
      </section>

      <section className="mx-section">
        <h2>Creator uploads</h2>
        <p>
          When creators upload content, we process and store it to host, stream, display, and promote
          it within the platform experience. Information associated with uploads — such as titles,
          descriptions, and engagement — may be used to power discovery and present the work to
          audiences. Creators retain ownership of their original content as described in our{" "}
          <a href="/terms">Terms</a>.
        </p>
      </section>

      <section className="mx-section">
        <h2>Account and platform usage</h2>
        <p>
          We use account and usage information to provide the service, remember your preferences, and
          maintain continuity across the platform. This helps us present relevant content and keep your
          experience consistent.
        </p>
      </section>

      <section className="mx-section">
        <h2>Analytics</h2>
        <p>
          We use analytics to understand how the platform is used in aggregate — which features are
          helpful, where the experience can improve, and how content performs. We use this information
          to make Movianx better, and we work to limit analytics to what is reasonably needed.
        </p>
      </section>

      <section className="mx-section">
        <h2>Communications</h2>
        <p>
          We may contact you about your account, important service updates, and, where appropriate,
          news about Movianx. You can opt out of non-essential communications at any time using the
          controls in the message or by contacting us.
        </p>
      </section>

      <section className="mx-section">
        <h2>Data protection</h2>
        <p>
          We take reasonable technical and organizational measures designed to protect information
          against loss, misuse, and unauthorized access. No method of storage or transmission is
          perfectly secure, so while we work hard to safeguard your information, we cannot guarantee
          absolute security.
        </p>
      </section>

      <section className="mx-section">
        <h2>Your choices</h2>
        <ul>
          <li>Access and update your account information from within the platform.</li>
          <li>Manage your communication preferences and opt out of non-essential messages.</li>
          <li>Request information about, or deletion of, your personal data where applicable.</li>
        </ul>
      </section>

      <section className="mx-section">
        <h2>Contact</h2>
        <p>
          Questions about this policy or your information? Reach us at{" "}
          <a href={`mailto:${CONTACT_EMAILS.general}`}>{CONTACT_EMAILS.general}</a> or visit our{" "}
          <a href="/contact">contact page</a>.
        </p>
      </section>
    </SiteShell>
  );
}
