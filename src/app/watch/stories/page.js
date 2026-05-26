import WatchExperiencePage from "../WatchExperiencePage";

export const revalidate = 3600;

export const metadata = {
  title: "Stories — Movianx",
  description:
    "Immersive written worlds, literary cinematic experiences, and narrative-driven environments.",
};

export default function StoriesPage() {
  return <WatchExperiencePage zone="stories" />;
}
