import SiteShell, { CallToAction } from "../_site/SiteChrome.jsx";
import { pageMeta } from "../../lib/seo.js";

export const metadata = pageMeta({
  path: "/news",
  title: "News",
  description:
    "Announcements and updates from across the Movianx ecosystem — including an introduction to Movianx Nexus, the immersive gateway into Movianx.",
});

export default function NewsPage() {
  return (
    <SiteShell>
      <header className="mx-hero">
        <div className="mx-eyebrow">News</div>
        <h1>Movianx News</h1>
        <p className="mx-lede">
          Announcements and updates from across the Movianx ecosystem — what we&rsquo;re building, and
          what it means for creators and audiences.
        </p>
      </header>

      <section className="mx-section">
        <div className="mx-eyebrow" style={{ marginBottom: "10px" }}>Movianx Nexus</div>
        <h2>The gateway into Movianx.</h2>
        <div className="mx-note">
          <p>
            Movianx Nexus is the immersive entry layer of the Movianx ecosystem — the place where
            stories, creators, live experiences, music, and cinematic worlds open into one another.
            It&rsquo;s the connective experience between discovery, entertainment, and the immersive
            interaction still to come.
          </p>
        </div>
        <p>
          Step through Nexus and the lines between formats fall away. A film leads to its soundtrack;
          the soundtrack leads to the artist; the artist leads to a live moment — one continuous
          journey instead of a row of separate doors. It&rsquo;s how everything in Movianx comes together,
          and a first glimpse of where the experience is going.
        </p>
      </section>

      <section className="mx-section">
        <h2>Announcements</h2>

        <div className="mx-announce">
          <span className="mx-tag">Ecosystem</span>
          <h3>The Movianx ecosystem takes shape</h3>
          <p>
            Streaming, creator tools, intelligent discovery, and live engagement are coming together
            under one premium destination — a unified home for films, series, music, stories, and
            immersive media.
          </p>
        </div>

        <div className="mx-announce">
          <span className="mx-tag">Creators</span>
          <h3>A premium stage for original work</h3>
          <p>
            Movianx is built creator-first: a place to publish, present, and grow original work with
            craft front and center, supported by intelligent, AI-assisted tools.
          </p>
        </div>

        <div className="mx-announce">
          <span className="mx-tag">Experience</span>
          <h3>Discovery that respects your time</h3>
          <p>
            Intelligent discovery surfaces what&rsquo;s worth experiencing and brings audiences together
            around the work — the foundation the Nexus layer is built on.
          </p>
        </div>
      </section>

      <CallToAction
        title="Be there as Movianx opens up."
        body="Learn what we're building, or reach out about creating with us."
        primary={{ href: "/about", label: "About Movianx" }}
        secondary={{ href: "/contact", label: "Get in touch" }}
      />
    </SiteShell>
  );
}
