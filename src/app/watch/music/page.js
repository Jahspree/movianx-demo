import WatchExperiencePage from "../WatchExperiencePage";

export const revalidate = 3600;

export const metadata = {
  title: "Music / Soundscapes — Movianx",
  description:
    "Spatial listening worlds, ambient releases, and emotional audio environments inside Movianx.",
};

export default function MusicPage() {
  return <WatchExperiencePage zone="music" />;
}
