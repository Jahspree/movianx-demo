import SiteShell, { CallToAction } from "../_site/SiteChrome.jsx";
import { CONTACT_EMAILS } from "../../lib/socialLinks.js";
import { pageMeta } from "../../lib/seo.js";

export const metadata = pageMeta({
  path: "/contact",
  title: "Contact",
  description:
    "Reach Movianx — direct lines for general, creator, partnership, press, and support inquiries.",
});

const CHANNELS = [
  {
    title: "General inquiries",
    blurb: "Questions about Movianx, the ecosystem, or anything that doesn't fit elsewhere.",
    email: CONTACT_EMAILS.general,
  },
  {
    title: "Creator inquiries",
    blurb: "Filmmakers, musicians, writers, and artists looking to publish and grow on Movianx.",
    email: CONTACT_EMAILS.creators,
  },
  {
    title: "Partnership inquiries",
    blurb: "Brands, studios, and platforms interested in building with the Movianx ecosystem.",
    email: CONTACT_EMAILS.partnerships,
  },
  {
    title: "Press inquiries",
    blurb: "Media, interviews, and requests for assets or comment.",
    email: CONTACT_EMAILS.press,
  },
  {
    title: "Support inquiries",
    blurb: "Help with your account, playback, or anything on the platform.",
    email: CONTACT_EMAILS.support,
  },
];

export default function ContactPage() {
  return (
    <SiteShell>
      <header className="mx-hero">
        <div className="mx-eyebrow">Contact</div>
        <h1>Let&rsquo;s talk.</h1>
        <p className="mx-lede">
          Whether you&rsquo;re a creator, a partner, a member of the press, or just curious — there&rsquo;s a
          direct line to the right place below.
        </p>
      </header>

      <section className="mx-section">
        <div className="mx-cards">
          {CHANNELS.map((c) => (
            <div className="mx-card" key={c.email}>
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
              <a href={`mailto:${c.email}`}>{c.email}</a>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-section">
        <h2>Prefer one address?</h2>
        <p>
          You can always reach us at <a href={`mailto:${CONTACT_EMAILS.general}`}>{CONTACT_EMAILS.general}</a>{" "}
          and we&rsquo;ll route your message to the right team.
        </p>
      </section>

      <CallToAction
        title="While you're here."
        body="Get to know Movianx, or step into the experience."
        primary={{ href: "/explore", label: "Explore content" }}
        secondary={{ href: "/about", label: "About Movianx" }}
      />
    </SiteShell>
  );
}
