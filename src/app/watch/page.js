import WatchExperiencePage from "./WatchExperiencePage";

export const revalidate = 3600;

export const metadata = {
  title: "Explore — Movianx Immersive Experiences",
  description:
    "Wander the Movianx ecosystem through editorially curated films, stories, soundscapes, and creator worlds.",
};

export default function WatchPage() {
  return <WatchExperiencePage zone="explore" />;
}
