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
  creator: story.isClassic ? "Movianx Classics Lab" : "Movianx Originals",
  teamLabel: story.isClassic ? "Classic adaptation team" : "Interactive story team",
  year: story.isClassic ? "Classic" : story.isTimed ? "Original" : "Demo",
  rights: story.isClassic ? "Public-domain literary source" : "Movianx demo experience",
  sourceType: story.isClassic ? "Classic interactive story" : "Creator-owned demo story",
  synopsis: story.desc,
  hook: story.isTimed
    ? "A timed survival experience built around pressure, sound, and instinct."
    : "A cinematic interactive story shaped for intimate, choice-aware immersion.",
  genre: story.genre,
  runtime: story.isTimed ? "4 chapters" : `${story.chapters} chapters`,
  rating: String(story.rating),
  language: "English",
  mediaType: story.isTimed ? "Timed Interactive Story" : "Interactive Story",
  contentFormat: "interactive_story",
  seriesType: story.isTimed ? "limited_series" : "standalone_story",
  series: story.isTimed
    ? {
        title: "10 Seconds",
        type: "Limited timed story",
        seasons: [{ number: 1, title: "The First Countdown", episodes: 4 }],
        continueWatching: "Chapter resume foundation",
        bingeSupport: "Future timed-story playlist support",
      }
    : null,
  immersiveReady: story.immersions.includes("Immersive"),
  aiEnhanced: true,
  featured: story.isTimed,
  accent: STORY_ACCENTS[story.id] || "#8b1a1a",
  tags: [
    story.isTimed ? "Timed Choices" : "Branching Story",
    "Immersive Audio",
    story.genre.split("/")[0].trim(),
  ],
  discoveryTags: [
    story.genre.toLowerCase(),
    story.isTimed ? "psychological thriller" : "cinematic story",
    story.isClassic ? "classic literature" : "indie",
    "immersive audio",
    "story-first",
  ],
  moodTags: story.isTimed ? ["fear", "pressure", "suspense"] : ["curious", "dramatic", "intimate"],
  styleTags: story.isClassic ? ["gothic", "literary", "classic"] : ["interactive", "cinematic", "experimental"],
  merchCollections: [
    {
      title: story.isTimed ? "Countdown Collection" : "Story World Collection",
      description: "A future fan-support collection for people who want to support the creator's world.",
      label: "Support the creator",
    },
  ],
  href: `/watch/story-${story.id}`,
  launchHref: "/",
}));

export const CONSUMER_EXPERIENCES = [
  ...MOVIE_EXPERIENCES.map((movie) => ({
    ...movie,
    creator: movie.creator || "Movianx Curation",
    teamLabel: movie.teamLabel || "Restoration and enhancement team",
    hook: movie.hook || "A cinematic experience prepared for immersive AI-enhanced viewing.",
    contentFormat: movie.contentFormat || "film",
    seriesType: movie.seriesType || "standalone_film",
    series: movie.series || null,
    discoveryTags: [
      movie.genre.toLowerCase(),
      ...movie.tags.map(tag => tag.toLowerCase()),
      movie.aiEnhanced ? "ai enhanced cinema" : "processing",
      movie.immersiveReady ? "immersive audio" : "coming soon",
    ],
    moodTags: movie.moodTags || ["cinematic", "atmospheric"],
    styleTags: movie.styleTags || [movie.posterTone, "premium", "film"],
    merchCollections: movie.merchCollections || [
      {
        title: `${movie.title} World Collection`,
        description: "A future limited fan-support release connected to the creator or restoration world.",
        label: "From the creator collection",
      },
    ],
    mediaType: "Film Experience",
    href: `/watch/${movie.id}`,
    launchHref: `/watch/${movie.id}#player`,
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

function scoreSimilarity(target, candidate) {
  if (!target || !candidate || target.id === candidate.id) return 0;
  const targetTags = new Set([
    target.genre,
    ...(target.discoveryTags || []),
    ...(target.moodTags || []),
    ...(target.styleTags || []),
  ].map(tag => String(tag).toLowerCase()));

  return [
    candidate.genre,
    ...(candidate.discoveryTags || []),
    ...(candidate.moodTags || []),
    ...(candidate.styleTags || []),
  ].reduce((score, tag) => score + (targetTags.has(String(tag).toLowerCase()) ? 1 : 0), 0);
}

export function getMoreFromCreator(experience, limit = 4) {
  return CONSUMER_EXPERIENCES
    .filter(item => (
      item.id !== experience?.id &&
      (item.creator === experience?.creator || item.teamLabel === experience?.teamLabel)
    ))
    .slice(0, limit);
}

export function getMoreLikeThis(experience, limit = 4) {
  return CONSUMER_EXPERIENCES
    .filter(item => item.id !== experience?.id)
    .map(item => ({ item, score: scoreSimilarity(experience, item) }))
    .sort((a, b) => b.score - a.score)
    .filter(({ score }) => score > 0)
    .map(({ item }) => item)
    .slice(0, limit);
}

export function getFallbackRecommendations(experience, limit = 4) {
  const preferred = getMoreLikeThis(experience, limit);
  if (preferred.length >= limit) return preferred;
  return [
    ...preferred,
    ...CONSUMER_EXPERIENCES.filter(item => item.id !== experience?.id && !preferred.includes(item)),
  ].slice(0, limit);
}
