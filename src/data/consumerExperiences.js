import { MOVIE_EXPERIENCES } from "./movieExperiences.js";
import { STORIES } from "./stories.js";
import { GENERATED_IMAGE_MANIFEST } from "./generatedImageManifest.js";
import { mapGeneratedAssetsToExperiences } from "../lib/imagePipeline/mapper.js";

const MOVIE_IMAGE = "/images/movies/";
const STORY_IMAGE = "/images/stories/";
const MUSIC_IMAGE = "/images/music/";
const CREATOR_IMAGE = "/images/creators/";

const STORY_ACCENTS = {
  1: "#7f1d1d",
  2: "#334155",
  3: "#991b1b",
};

const STORY_IMAGES = {
  1: `${STORY_IMAGE}frankenstein.jpg`,
  2: `${STORY_IMAGE}the-choice.jpg`,
  3: `${STORY_IMAGE}ten-seconds.jpg`,
};

const MOVIE_IMAGES = {
  "night-of-the-living-dead": `${MOVIE_IMAGE}night-of-the-living-dead.jpg`,
  nosferatu: `${MOVIE_IMAGE}nosferatu.jpg`,
  "cabinet-of-dr-caligari": `${MOVIE_IMAGE}cabinet-of-dr-caligari.jpg`,
  "a-trip-to-the-moon": `${MOVIE_IMAGE}a-trip-to-the-moon.jpg`,
  "the-general": `${MOVIE_IMAGE}the-general.jpg`,
  "house-on-haunted-hill": `${MOVIE_IMAGE}house-on-haunted-hill.jpg`,
  "creator-proof-film": `${MOVIE_IMAGE}midnight-signal.jpg`,
  "the-phantom-carriage": `${MOVIE_IMAGE}the-phantom-carriage.jpg`,
  "the-lost-world": `${MOVIE_IMAGE}the-lost-world.jpg`,
};

export const MUSIC_EXPERIENCES = [
  {
    id: "music-echoes-in-orbit",
    title: "Echoes in Orbit",
    creator: "Movianx Sound Lab",
    teamLabel: "Spatial music experience",
    year: "Preview",
    rights: "Movianx original visual media",
    sourceType: "Spatial music release",
    synopsis: "A spatial audio release for cinematic listening, shaped around memory, distance, and orbiting signal.",
    hook: "A slow-blooming sci-fi sound world that feels like drifting through signal and memory.",
    genre: "Music Experience",
    runtime: "7 min",
    rating: "All ages",
    language: "Instrumental",
    mediaType: "Music Experience",
    contentFormat: "music_experience",
    seriesType: "standalone_music",
    series: null,
    immersiveReady: true,
    aiEnhanced: true,
    featured: false,
    accent: "#0f766e",
    image: `${MUSIC_IMAGE}echoes-in-orbit.jpg`,
    tags: ["Spatial Audio", "Ambient", "Sci-Fi"],
    discoveryTags: ["music", "spatial audio", "ambient", "sci-fi", "cinematic"],
    moodTags: ["wonder", "calm", "mystery"],
    styleTags: ["electronic", "immersive", "minimal"],
    merchCollections: [
      {
        title: "Echoes Listener Collection",
        description: "A limited fan-support release for the artist's sound world.",
        label: "Support the artist",
      },
    ],
    enhancements: ["Spatial audio staging", "Mood-reactive visuals", "Adaptive ambience", "Immersive listening mode"],
    href: "/watch/music-echoes-in-orbit",
    launchHref: "/watch/music-echoes-in-orbit#player",
  },
  {
    id: "music-velvet-static",
    title: "Velvet Static",
    creator: "Movianx Sound Lab",
    teamLabel: "Experimental audio team",
    year: "Preview",
    rights: "Movianx original visual media",
    sourceType: "Immersive music release",
    synopsis: "A dark, tactile audio-visual mood piece built for immersive listening.",
    hook: "A quiet storm of texture, bass, and flickering light.",
    genre: "Music Experience",
    runtime: "5 min",
    rating: "All ages",
    language: "Instrumental",
    mediaType: "Music Experience",
    contentFormat: "music_experience",
    seriesType: "standalone_music",
    series: null,
    immersiveReady: true,
    aiEnhanced: true,
    featured: false,
    accent: "#7c3aed",
    image: `${MUSIC_IMAGE}velvet-static.jpg`,
    tags: ["Experimental", "Ambient", "Mood"],
    discoveryTags: ["music", "experimental", "ambient", "dark", "cinematic"],
    moodTags: ["intimate", "mysterious", "nocturnal"],
    styleTags: ["electronic", "art-house", "minimal"],
    merchCollections: [
      {
        title: "Velvet Static Drop",
        description: "A release collection shaped around the artist's visual world.",
        label: "Limited fan release",
      },
    ],
    enhancements: ["Mood-reactive visuals", "Spatial audio staging", "Adaptive low-frequency motion"],
    href: "/watch/music-velvet-static",
    launchHref: "/watch/music-velvet-static#player",
  },
];

export const CREATOR_SPOTLIGHTS = [
  {
    id: "creator-director-noir",
    title: "Director Noir",
    creator: "Movianx Creator Program",
    teamLabel: "Creator spotlight",
    year: "Creator",
    rights: "Movianx original creator media",
    sourceType: "Creator spotlight",
    synopsis: "A curated director profile for creator worlds and release collections.",
    hook: "A filmmaker building quiet dread, shadow, and emotionally precise cinema.",
    genre: "Creator Spotlight",
    runtime: "Profile",
    rating: "All ages",
    language: "English",
    mediaType: "Creator World",
    contentFormat: "creator_spotlight",
    seriesType: "creator_universe",
    series: null,
    immersiveReady: true,
    aiEnhanced: true,
    featured: false,
    accent: "#b51f2a",
    image: `${CREATOR_IMAGE}director-noir.jpg`,
    tags: ["Creator", "Cinema", "Noir"],
    discoveryTags: ["creator", "film", "noir", "cinematic"],
    moodTags: ["focused", "dark", "artistic"],
    styleTags: ["premium", "creator-first", "director"],
    merchCollections: [{ title: "Director Collection", description: "A fan-support release for the creator's world.", label: "Support the creator" }],
    enhancements: ["Creator world profile", "Audience discovery", "Release collection"],
    href: "/watch/creator-director-noir",
    launchHref: "/dashboard/welcome",
  },
  {
    id: "creator-sound-architect",
    title: "Sound Architect",
    creator: "Movianx Creator Program",
    teamLabel: "Creator spotlight",
    year: "Creator",
    rights: "Movianx original creator media",
    sourceType: "Creator spotlight",
    synopsis: "A creator profile for spatial sound artists and immersive audio directors.",
    hook: "An artist shaping space, silence, and pressure into cinematic presence.",
    genre: "Creator Spotlight",
    runtime: "Profile",
    rating: "All ages",
    language: "English",
    mediaType: "Creator World",
    contentFormat: "creator_spotlight",
    seriesType: "creator_universe",
    series: null,
    immersiveReady: true,
    aiEnhanced: true,
    featured: false,
    accent: "#0f766e",
    image: `${CREATOR_IMAGE}sound-architect.jpg`,
    tags: ["Creator", "Music", "Spatial Audio"],
    discoveryTags: ["creator", "music", "spatial audio", "cinematic"],
    moodTags: ["immersive", "precise", "atmospheric"],
    styleTags: ["premium", "sound design", "artist"],
    merchCollections: [{ title: "Sound World Collection", description: "A limited release connected to the artist's sound world.", label: "Support the artist" }],
    enhancements: ["Spatial audio profile", "Creator discovery", "Release collection"],
    href: "/watch/creator-sound-architect",
    launchHref: "/dashboard/welcome",
  },
  {
    id: "creator-visual-poet",
    title: "Visual Poet",
    creator: "Movianx Creator Program",
    teamLabel: "Creator spotlight",
    year: "Creator",
    rights: "Movianx original creator media",
    sourceType: "Creator spotlight",
    synopsis: "A creator profile for visually driven storytellers and experimental media artists.",
    hook: "A visual artist turning memory, movement, and atmosphere into cinematic worlds.",
    genre: "Creator Spotlight",
    runtime: "Profile",
    rating: "All ages",
    language: "English",
    mediaType: "Creator World",
    contentFormat: "creator_spotlight",
    seriesType: "creator_universe",
    series: null,
    immersiveReady: true,
    aiEnhanced: true,
    featured: false,
    accent: "#d6a33a",
    image: `${CREATOR_IMAGE}visual-poet.jpg`,
    tags: ["Creator", "Experimental", "Visual Art"],
    discoveryTags: ["creator", "experimental", "visual", "artistic"],
    moodTags: ["dreamlike", "emotional", "curated"],
    styleTags: ["premium", "visual artist", "cinematic"],
    merchCollections: [{ title: "Visual World Collection", description: "A fan-support release for the creator's visual universe.", label: "From the creator collection" }],
    enhancements: ["Visual creator profile", "Audience discovery", "Release collection"],
    href: "/watch/creator-visual-poet",
    launchHref: "/dashboard/welcome",
  },
  {
    id: "creator-spotlight-lab",
    title: "Creator Spotlight",
    creator: "Movianx Creator Program",
    teamLabel: "Creator spotlight",
    year: "Creator",
    rights: "Movianx original creator media",
    sourceType: "Creator spotlight",
    synopsis: "A curated look at artists building immersive films, stories, music, and release worlds.",
    hook: "A curated look at the artists building the next generation of immersive media.",
    genre: "Creator Spotlight",
    runtime: "Profile",
    rating: "All ages",
    language: "English",
    mediaType: "Creator World",
    contentFormat: "creator_spotlight",
    seriesType: "creator_universe",
    series: null,
    immersiveReady: true,
    aiEnhanced: true,
    featured: false,
    accent: "#7c3aed",
    image: `${CREATOR_IMAGE}spotlight-lab.jpg`,
    tags: ["Creator", "Studio", "Immersive"],
    discoveryTags: ["creator", "studio", "immersive", "cinematic"],
    moodTags: ["premium", "curated", "cinematic"],
    styleTags: ["creator-first", "media platform", "premium"],
    merchCollections: [{ title: "Creator World Collection", description: "A limited fan-support release connected to the creator ecosystem.", label: "Support the creator" }],
    enhancements: ["Creator universe profile", "Audience discovery", "Release collection"],
    href: "/watch/creator-spotlight-lab",
    launchHref: "/dashboard/welcome",
  },
];

export const STORY_EXPERIENCES = STORIES.map((story) => ({
  id: `story-${story.id}`,
  storyId: story.id,
  title: story.title.replace(" [Sample]", ""),
  creator: story.isClassic ? "Movianx Classics Lab" : "Movianx Originals",
  teamLabel: story.isClassic ? "Classic adaptation team" : "Interactive story team",
  year: story.isClassic ? "Classic" : story.isTimed ? "Original" : "Preview",
  rights: story.isClassic ? "Public-domain literary source" : "Movianx original story experience",
  sourceType: story.isClassic ? "Classic interactive story" : "Creator-owned story",
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
        continueWatching: "Chapter resume",
        bingeSupport: "Timed-story playlist support",
      }
    : null,
  immersiveReady: story.immersions.includes("Immersive"),
  aiEnhanced: true,
  featured: story.isTimed,
  accent: STORY_ACCENTS[story.id] || "#8b1a1a",
  image: STORY_IMAGES[story.id] || `${CREATOR_IMAGE}spotlight-lab.jpg`,
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
        description: "A fan-support collection for people who want to support the creator's world.",
      label: "Support the creator",
    },
  ],
  href: `/watch/story-${story.id}`,
  launchHref: `/?story=${story.id}&mode=Immersive`,
}));

const BASE_CONSUMER_EXPERIENCES = [
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
      movie.aiEnhanced ? "ai enhanced cinema" : "curated cinema",
      movie.immersiveReady ? "immersive audio" : "coming soon",
    ],
    moodTags: movie.moodTags || ["cinematic", "atmospheric"],
    styleTags: movie.styleTags || [movie.posterTone, "premium", "film"],
    merchCollections: movie.merchCollections || [
      {
        title: `${movie.title} World Collection`,
        description: "A limited fan-support release connected to the creator or restoration world.",
        label: "From the creator collection",
      },
    ],
    image: movie.image || MOVIE_IMAGES[movie.id] || `${MOVIE_IMAGE}night-of-the-living-dead.jpg`,
    mediaType: "Film Experience",
    href: `/watch/${movie.id}`,
    launchHref: `/watch/${movie.id}#player`,
  })),
  ...STORY_EXPERIENCES,
  ...MUSIC_EXPERIENCES,
  ...CREATOR_SPOTLIGHTS,
];

export const CONSUMER_EXPERIENCES = mapGeneratedAssetsToExperiences(BASE_CONSUMER_EXPERIENCES, GENERATED_IMAGE_MANIFEST);

export const CONSUMER_RAILS = [
  {
    title: "Late Night Viewing",
    slug: "featured-worlds",
    description: "A small, high-signal row for worlds that feel best after dark.",
    mood: "After midnight",
    accent: "#b51f2a",
    ids: ["story-3", "night-of-the-living-dead", "creator-proof-film", "music-echoes-in-orbit", "a-trip-to-the-moon"],
  },
  {
    title: "Psychological Horror",
    slug: "trending-cinema",
    description: "Dread, silence, pressure, and films that live in the nervous system.",
    mood: "Dread-built",
    accent: "#991b1b",
    ids: ["story-3", "night-of-the-living-dead", "nosferatu", "house-on-haunted-hill", "cabinet-of-dr-caligari"],
  },
  {
    title: "Immersive Stories",
    slug: "immersive-stories",
    description: "Story-first experiences shaped around emotion, timing, and presence.",
    mood: "Choice-aware",
    accent: "#7c3aed",
    ids: ["story-3", "story-1", "story-2", "cabinet-of-dr-caligari"],
  },
  {
    title: "Emotional Soundscapes",
    slug: "music-experiences",
    description: "Spatial listening releases for artist worlds, memory, and cinematic atmosphere.",
    mood: "Spatial audio",
    accent: "#0f766e",
    ids: ["music-echoes-in-orbit", "music-velvet-static", "the-phantom-carriage", "a-trip-to-the-moon"],
  },
  {
    title: "Creator Spotlight",
    slug: "creator-spotlights",
    description: "Creator universes and artistic worlds presented with respect and breathing room.",
    mood: "Artist-first",
    accent: "#d6a33a",
    ids: ["creator-director-noir", "creator-sound-architect", "creator-visual-poet", "creator-spotlight-lab", "creator-proof-film"],
  },
  {
    title: "Anime-Inspired Universes",
    slug: "anime-worlds",
    description: "Stylized worlds, heightened emotion, and creator-led visual language.",
    mood: "Stylized worlds",
    accent: "#7c3aed",
    ids: ["the-lost-world", "creator-proof-film", "music-echoes-in-orbit", "story-2"],
  },
  {
    title: "Atmospheric Storytelling",
    slug: "emotional-journeys",
    description: "Quiet, haunted, intimate experiences with lasting atmosphere.",
    mood: "Slow burn",
    accent: "#334155",
    ids: ["the-phantom-carriage", "story-1", "music-velvet-static", "a-trip-to-the-moon"],
  },
  {
    title: "Dark Sci-Fi Worlds",
    slug: "dark-sci-fi",
    description: "Signals, systems, strange worlds, and cinematic unease.",
    mood: "Signal-driven",
    accent: "#2563eb",
    ids: ["creator-proof-film", "music-echoes-in-orbit", "the-lost-world", "story-3", "a-trip-to-the-moon"],
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
