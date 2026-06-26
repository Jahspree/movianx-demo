import SiteShell, { CallToAction } from "../_site/SiteChrome.jsx";
import { pageMeta } from "../../lib/seo.js";

export const metadata = pageMeta({
  path: "/about",
  title: "About",
  description:
    "Movianx is a premium creative entertainment ecosystem where creators publish, present, and grow their work while audiences discover films, series, music, stories, live experiences, and immersive media in one destination.",
});

export default function AboutPage() {
  return (
    <SiteShell>
      <header className="mx-hero">
        <div className="mx-eyebrow">About</div>
        <h1>One destination for everything worth experiencing.</h1>
        <p className="mx-lede">
          Movianx is building a premium creative entertainment ecosystem where creators can publish,
          present, and grow their work while audiences discover films, series, music, stories, live
          experiences, and immersive media in one unified destination.
        </p>
      </header>

      <section className="mx-section">
        <h2>Our mission</h2>
        <p>
          We exist to give original work the home it deserves — and to make discovering it feel
          effortless. Movianx brings creators and audiences into one premium space where great
          stories, sound, and experiences are made, presented, and found without friction.
        </p>
      </section>

      <section className="mx-section">
        <h2>What Movianx is</h2>
        <p>
          Movianx is an AI-first creative entertainment platform that unifies streaming, creator
          tools, intelligent discovery, and live engagement under one premium ecosystem. Films,
          series, music, written stories, and immersive media live side by side, presented with the
          care of a cinema and the openness of a modern platform.
        </p>
      </section>

      <section className="mx-section">
        <h2>Who it&rsquo;s for</h2>
        <div className="mx-cards">
          <div className="mx-card">
            <h3>Creators</h3>
            <p>Filmmakers, musicians, writers, and artists who want a premium stage for original work.</p>
          </div>
          <div className="mx-card">
            <h3>Audiences</h3>
            <p>Viewers and listeners who want curated, high-craft entertainment in one place.</p>
          </div>
          <div className="mx-card">
            <h3>Builders of worlds</h3>
            <p>Storytellers exploring live and immersive formats beyond the traditional screen.</p>
          </div>
        </div>
      </section>

      <section className="mx-section">
        <h2>Creator-first by design</h2>
        <p>
          Everything starts with the people who make the work. Movianx gives creators intelligent
          tools to produce, present, and grow an audience — with their craft front and center and the
          platform working quietly in service of it. Creators keep ownership of what they make; Movianx
          provides the stage, the reach, and the experience around it.
        </p>
      </section>

      <section className="mx-section">
        <h2>The viewer experience</h2>
        <p>
          For audiences, Movianx is a calm, cinematic place to discover and enjoy. Intelligent
          discovery surfaces what&rsquo;s worth your time, live moments bring people together around the
          work, and the experience stays premium from the first frame to the last note.
        </p>
      </section>

      <section className="mx-section">
        <h2>A premium, AI-assisted ecosystem</h2>
        <p>
          Movianx pairs a refined entertainment experience with AI-assisted creative tools — used to
          help creators do their best work and to help audiences find it, never to replace the human
          craft at the center. The result is one ecosystem that spans creation, discovery, streaming,
          live engagement, and the immersive experiences still to come.
        </p>
      </section>

      <section className="mx-section">
        <h2>Where we&rsquo;re headed</h2>
        <p>
          We&rsquo;re building the connective layer between creators and audiences — and the immersive
          formats that will define the next era of entertainment. To follow what&rsquo;s opening up next,
          read <a href="/news">Movianx News</a>.
        </p>
      </section>

      <CallToAction
        title="Start exploring Movianx."
        body="Discover the work, or bring your own to a stage built for it."
        primary={{ href: "/explore", label: "Explore content" }}
        secondary={{ href: "/creators", label: "Become a creator" }}
      />
    </SiteShell>
  );
}
