import WatchExperiencePage from "../WatchExperiencePage";

export const revalidate = 3600;

export const metadata = {
  title: "Movies — Movianx",
  description:
    "Original films, public-domain reinterpretations, and cinematic worlds inside Movianx.",
};

export default function MoviesPage() {
  return <WatchExperiencePage zone="movies" />;
}
