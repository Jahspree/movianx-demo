import { MOVIE_EXPERIENCES } from "./movieExperiences.js";
import { STORIES } from "./stories.js";

const STORY_ACCENTS = {
  1: "#7f1d1d",
  2: "#334155",
  3: "#991b1b",
};

export const STORY_EXPERIENCES = STORIES.map((story) => ({
  id: `story-${story.id}`,
  storyId: story.id,
  title: story.title.replace(" [Sample]", ""),
  year: story.isClassic ? "Classic" : story.isTimed ? "Original" : "Demo",
  rights: story.isClassic ? "Public-domain literary source" : "Movianx demo experience",
  sourceType: story.isClassic ? "Classic interactive story" : "Creator-owned demo story",
  synopsis: story.desc,
  genre: story.genre,
  runtime: story.isTimed ? "4 chapters" : `${story.chapters} chapters`,
  rating: String(story.rating),
  language: "English",
  mediaType: story.isTimed ? "Timed Interactive Story" : "Interactive Story",
  immersiveReady: story.immersions.includes("Immersive"),
  aiEnhanced: true,
  featured: story.isTimed,
  accent: STORY_ACCENTS[story.id] || "#8b1a1a",
  tags: [
    story.isTimed ? "Timed Choices" : "Branching Story",
    "Immersive Audio",
    story.genre.split("/")[0].trim(),
  ],
  href: "/",
}));

export const CONSUMER_EXPERIENCES = [
  ...MOVIE_EXPERIENCES.map((movie) => ({
    ...movie,
    mediaType: "Film Experience",
    href: `/watch/${movie.id}`,
  })),
  ...STORY_EXPERIENCES,
];

export const CONSUMER_RAILS = [
  {
    title: "Featured Immersive Experiences",
    description: "Films and stories staged for AI-enhanced cinematic immersion.",
    ids: ["night-of-the-living-dead", "story-3", "creator-proof-film", "a-trip-to-the-moon"],
  },
  {
    title: "AI Enhanced Films",
    description: "Demo-safe cinema entries with immersive enhancement indicators.",
    ids: ["night-of-the-living-dead", "nosferatu", "the-general", "the-lost-world", "the-phantom-carriage"],
  },
  {
    title: "Interactive Stories",
    description: "Branching narrative experiences built for cinematic sound and choice.",
    ids: ["story-3", "story-1", "story-2"],
  },
  {
    title: "Public Domain Horror",
    description: "Classic horror metadata only, presented with demo-safe enhancement layers.",
    ids: ["night-of-the-living-dead", "nosferatu", "cabinet-of-dr-caligari", "house-on-haunted-hill"],
  },
  {
    title: "Experimental Immersive",
    description: "Shorts, silent cinema, and interactive formats for new media language.",
    ids: ["a-trip-to-the-moon", "the-lost-world", "story-3", "cabinet-of-dr-caligari"],
  },
  {
    title: "Recently Added",
    description: "Fresh placeholders and public-domain-safe entries for the demo library.",
    ids: ["house-on-haunted-hill", "the-phantom-carriage", "creator-proof-film", "story-2"],
  },
];

export function getConsumerExperience(id) {
  return CONSUMER_EXPERIENCES.find((experience) => experience.id === id);
}

export function getConsumerRailItems(ids) {
  return ids.map(getConsumerExperience).filter(Boolean);
}
