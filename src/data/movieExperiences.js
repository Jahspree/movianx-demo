export const MOVIE_EXPERIENCES = [
  {
    id: "night-of-the-living-dead",
    title: "Night of the Living Dead",
    year: "1968",
    rights: "Public domain in the United States",
    sourceType: "Verified public-domain metadata",
    synopsis:
      "A landmark independent horror film reframed here as a demo-safe immersive cinema experience with adaptive atmosphere and scene-aware audio enhancement indicators.",
    genre: "Public Domain Horror",
    runtime: "96 min",
    rating: "Unrated",
    language: "English",
    immersiveReady: true,
    aiEnhanced: true,
    featured: true,
    posterTone: "crimson",
    accent: "#b51f2a",
    tags: ["Survival Horror", "Mono Restoration", "Adaptive Dread"],
    enhancements: [
      "Immersive audio enhancement",
      "AI scene analysis",
      "Dialogue enhancement",
      "Intelligent subtitle generation",
      "Adaptive sound staging",
      "Cinematic enhancement processing",
    ],
  },
  {
    id: "nosferatu",
    title: "Nosferatu",
    year: "1922",
    rights: "Public domain in the United States",
    sourceType: "Verified public-domain metadata",
    synopsis:
      "German expressionist horror staged as a silent-era immersive restoration concept, with atmospheric sound mapping and shadow-driven scene analysis.",
    genre: "Public Domain Horror",
    runtime: "94 min",
    rating: "Unrated",
    language: "Silent",
    immersiveReady: true,
    aiEnhanced: true,
    posterTone: "ash",
    accent: "#9ca3af",
    tags: ["Expressionist", "Silent Cinema", "Shadow Mapping"],
    enhancements: [
      "Adaptive score staging",
      "AI shot rhythm analysis",
      "Atmospheric audio bed mapping",
      "Intertitle subtitle enhancement",
    ],
  },
  {
    id: "cabinet-of-dr-caligari",
    title: "The Cabinet of Dr. Caligari",
    year: "1920",
    rights: "Public domain in the United States",
    sourceType: "Verified public-domain metadata",
    synopsis:
      "A fractured silent classic presented as an AI-enhanced expressionist demo with stylized ambience, visual tone analysis, and cinematic processing states.",
    genre: "Public Domain Horror",
    runtime: "76 min",
    rating: "Unrated",
    language: "Silent",
    immersiveReady: true,
    aiEnhanced: true,
    posterTone: "violet",
    accent: "#7c3aed",
    tags: ["Expressionist Horror", "Dream Logic", "Spatial Score"],
    enhancements: [
      "Scene geometry analysis",
      "Intelligent subtitle generation",
      "Immersive score placement",
      "Cinematic contrast mapping",
    ],
  },
  {
    id: "a-trip-to-the-moon",
    title: "A Trip to the Moon",
    year: "1902",
    rights: "Public domain in the United States",
    sourceType: "Verified public-domain metadata",
    synopsis:
      "A foundational fantasy film imagined as a compact immersive experience with playful sound staging, restoration cues, and AI-assisted scene indexing.",
    genre: "Experimental Immersive",
    runtime: "13 min",
    rating: "Unrated",
    language: "Silent",
    immersiveReady: true,
    aiEnhanced: true,
    posterTone: "gold",
    accent: "#d6a33a",
    tags: ["Fantasy", "Silent Short", "Restoration Demo"],
    enhancements: [
      "Scene beat detection",
      "Adaptive music bed",
      "Intelligent subtitle generation",
      "Cinematic enhancement processing",
    ],
  },
  {
    id: "the-general",
    title: "The General",
    year: "1926",
    rights: "Public domain in the United States",
    sourceType: "Verified public-domain metadata",
    synopsis:
      "A silent action-comedy classic positioned as an AI-enhanced motion and timing study for creator-safe cinematic experimentation.",
    genre: "AI Enhanced Cinema",
    runtime: "75 min",
    rating: "Unrated",
    language: "Silent",
    immersiveReady: true,
    aiEnhanced: true,
    posterTone: "steel",
    accent: "#64748b",
    tags: ["Action Comedy", "Motion Analysis", "Rhythm Mapping"],
    enhancements: [
      "Action beat analysis",
      "Adaptive sound staging",
      "Subtitle timing intelligence",
      "Cinematic motion indexing",
    ],
  },
  {
    id: "house-on-haunted-hill",
    title: "House on Haunted Hill",
    year: "1959",
    rights: "Public domain in the United States",
    sourceType: "Verified public-domain metadata",
    synopsis:
      "A haunted-house horror title framed as a demo-safe AI cinema experience with spatial ambience, dialogue lift, and suspense-aware processing states.",
    genre: "Recently Added",
    runtime: "75 min",
    rating: "Unrated",
    language: "English",
    immersiveReady: true,
    aiEnhanced: true,
    posterTone: "ember",
    accent: "#ea580c",
    tags: ["Haunted House", "Suspense", "Dialogue Lift"],
    enhancements: [
      "Dialogue enhancement",
      "Room tone expansion",
      "Suspense curve analysis",
      "Adaptive sound staging",
    ],
  },
  {
    id: "creator-proof-film",
    title: "Creator Proof Film",
    year: "Demo",
    rights: "Creator-owned demo placeholder",
    sourceType: "No third-party media bundled",
    synopsis:
      "A creator-owned placeholder slot showing how uploaded films can become AI-enhanced cinematic experiences after secure review and analysis.",
    genre: "Featured Experiences",
    runtime: "18 min",
    rating: "Demo",
    language: "English",
    immersiveReady: false,
    aiEnhanced: false,
    posterTone: "midnight",
    accent: "#2563eb",
    tags: ["Creator Demo", "Private Review", "Processing"],
    enhancements: [
      "Upload security scan",
      "AI scene analysis pending",
      "Immersive audio mapping pending",
      "Ad suitability pending",
    ],
  },
];

export const MOVIE_RAILS = [
  { title: "Featured Experiences", ids: ["night-of-the-living-dead", "creator-proof-film", "a-trip-to-the-moon"] },
  { title: "Public Domain Horror", ids: ["night-of-the-living-dead", "nosferatu", "cabinet-of-dr-caligari", "house-on-haunted-hill"] },
  { title: "AI Enhanced Cinema", ids: ["the-general", "a-trip-to-the-moon", "night-of-the-living-dead"] },
  { title: "Experimental Immersive", ids: ["a-trip-to-the-moon", "cabinet-of-dr-caligari", "creator-proof-film"] },
  { title: "Recently Added", ids: ["house-on-haunted-hill", "the-general", "creator-proof-film"] },
];

export function getMovieExperience(id) {
  return MOVIE_EXPERIENCES.find((movie) => movie.id === id);
}

export function getFeaturedMovieExperience() {
  return MOVIE_EXPERIENCES.find((movie) => movie.featured) || MOVIE_EXPERIENCES[0];
}

export function getMovieRailItems(ids) {
  return ids.map(getMovieExperience).filter(Boolean);
}
