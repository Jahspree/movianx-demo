// ===========================================================================
// MOVIANX AUDIO MANIFEST - Frankenstein
// ===========================================================================
// This is the single source of truth for all immersive audio.
// Claude owns the narrative intelligence. Codex implements against this.
// Generate once. Cache forever. Zero AI calls during reading.
// ===========================================================================

const FRANKENSTEIN_AUDIO = {
  storyId: 1,
  title: "Frankenstein",
  narrator: {
    voiceQuery: "male dramatic dark narrator British",
    model: "eleven_multilingual_v2",
    settings: { stability: 0.5, similarity_boost: 0.8, style: 0.3 },
  },
  characterDialogue: {
    0: { speaker: "Walton", line: { text: "Sister, tell me honestly: do I confess the full fire of my ambition, or spare you the worst of it?", breathLevel: 0.16, tremble: 0.12, whisper: false, pacing: "stable" } },
    1: { speaker: "Walton", line: { text: "He is nearly frozen, but his eyes are full of warning. Do I ask for the truth now, or give him silence?", breathLevel: 0.24, tremble: 0.28, whisper: true, pacing: "hesitant" } },
    2: { speaker: "Victor", line: { text: "If this hunger for knowledge is already inside me, should I feed it or learn to master it?", breathLevel: 0.18, tremble: 0.2, whisper: false, pacing: "stable" } },
    3: { speaker: "Victor", line: { text: "The eye is open. It is breathing. Do I face what I made, or run before it knows my name?", breathLevel: 0.72, tremble: 0.86, whisper: true, pacing: "broken" } },
    4: { speaker: "Creature", line: { text: "You made me alone. Will you answer for me, or will you deny me again?", breathLevel: 0.35, tremble: 0.48, whisper: false, pacing: "broken" } },
  },

  chapters: [
    // =====================================================================
    // CHAPTER 0 - ARCTIC VOYAGE
    // Mood: Anticipation, cold isolation, the edge of the known world
    // Emotional arc: Wonder -> unease -> foreboding
    // =====================================================================
    {
      id: 0,
      title: "Letter I - To Mrs. Saville, England",
      narration: "/audio/frankenstein/ch0.mp3",
      emotion: "calm",
      sceneAnalysis: { mood: "dark", tension: 0.28, environment: "forest" },
      tension: 0.28,

      ambient: [
        { file: "/audio/sfx/wind_loop.mp3", volume: 0.2, loop: true, fadeIn: 3 },
      ],
      environmentEvents: [
        { sound: "/audio/sfx/wind_loop.mp3", position: [-4, 0, 2], movement: "leftToRight", duration: 9000, delay: 0, volume: 0.12, loop: true, label: "arctic wind crossing the deck" },
      ],

      spatial: [
        // Wind sweeps across the listener continuously
        {
          file: "/audio/sfx/wind_loop.mp3",
          volume: 0.15,
          loop: true,
          movement: { type: "sweep", axis: "x", from: -5, to: 5, duration: 10, repeat: true },
        },
        // Ship creaks below - random intervals
        {
          file: "/audio/sfx/ice_crack.mp3",
          volume: 0.1,
          position: { x: 0, y: -1, z: -1 },
          trigger: { type: "random", minDelay: 8000, maxDelay: 12000 },
        },
        // Ice cracking in the distance
        {
          file: "/audio/sfx/ice_crack.mp3",
          volume: 0.08,
          position: { x: 0, y: 0, z: -8 },
          trigger: { type: "random", minDelay: 15000, maxDelay: 25000, randomX: true },
        },
        // Wolf howl - far distance, once
        {
          file: "/audio/sfx/wolf_howl.mp3",
          volume: 0.12,
          position: { x: 3, y: 0, z: -10 },
          trigger: { type: "timed", delay: 15000 },
        },
      ],

      silenceMoments: [],
    },

    // =====================================================================
    // CHAPTER 1 - THE STRANGER
    // Mood: Mystery, tension building, something wrong in the ice
    // Emotional arc: Curiosity -> dread -> compassion
    // =====================================================================
    {
      id: 1,
      title: "Letter IV - The Stranger",
      narration: "/audio/frankenstein/ch1.mp3",
      emotion: "tense",
      sceneAnalysis: { mood: "suspense", tension: 0.54, environment: "forest" },
      tension: 0.54,

      ambient: [
        { file: "/audio/sfx/wind_loop.mp3", volume: 0.4, loop: true, fadeIn: 2 },
      ],
      environmentEvents: [
        { sound: "/audio/sfx/footsteps_dirt.mp3", startPosition: [0, 0, -12], endPosition: [0, 0, -3], movement: "approaching", duration: 9000, delay: 4500, volume: 0.18, triggerTension: 0.16, unsourced: true, label: "sled steps approaching over ice" },
      ],

      spatial: [
        // Dog sled approaching from far distance
        {
          file: "/audio/sfx/footsteps_dirt.mp3",
          volume: 0.2,
          movement: { type: "approach", from: { x: 0, y: 0, z: -15 }, to: { x: 0, y: 0, z: -3 }, duration: 8 },
          trigger: { type: "timed", delay: 5000 },
        },
        // Stranger's labored breathing - fades in from the right
        {
          file: "/audio/sfx/breathing_raspy.mp3",
          volume: 0.3,
          loop: true,
          position: { x: 1, y: 0, z: -2 },
          trigger: { type: "timed", delay: 10000, fadeIn: 5 },
        },
        // Ice cracking beneath
        {
          file: "/audio/sfx/ice_crack.mp3",
          volume: 0.15,
          position: { x: 0, y: -2, z: 0 },
          trigger: { type: "random", minDelay: 12000, maxDelay: 20000 },
        },
      ],

      silenceMoments: [],
    },

    // =====================================================================
    // CHAPTER 2 - VICTOR'S CHILDHOOD
    // Mood: Warmth, nostalgia, innocence with shadow underneath
    // Emotional arc: Peace -> tenderness -> subtle unease
    // This should feel like a memory - slightly distant, golden
    // =====================================================================
    {
      id: 2,
      title: "Chapter I - Victor's Childhood",
      narration: "/audio/frankenstein/ch2.mp3",
      emotion: "reflective",
      sceneAnalysis: { mood: "calm", tension: 0.18, environment: "forest" },
      tension: 0.18,

      ambient: [
        { file: "/audio/sfx/water_lapping.mp3", volume: 0.15, loop: true, fadeIn: 4 },
      ],
      environmentEvents: [
        { sound: "/audio/sfx/leaves_rustle.mp3", position: [-2, 1, -3], movement: "fixed", duration: 14000, delay: 0, volume: 0.08, loop: true, label: "memory leaves at the lake" },
      ],

      spatial: [
        // Gentle leaves - soft, surrounding
        {
          file: "/audio/sfx/leaves_rustle.mp3",
          volume: 0.1,
          loop: true,
          position: { x: -2, y: 1, z: -3 },
        },
        // Birdsong - procedural, use oscillator pings above
        {
          type: "procedural",
          sound: "birdsong",
          volume: 0.06,
          position: { x: 0, y: 2, z: -2 },
          trigger: { type: "random", minDelay: 3000, maxDelay: 6000, randomX: true },
        },
        // Distant church bells - very faint, single moment
        {
          type: "procedural",
          sound: "bells",
          volume: 0.04,
          position: { x: 5, y: 3, z: -10 },
          trigger: { type: "timed", delay: 30000 },
        },
      ],

      silenceMoments: [],
    },

    // =====================================================================
    // CHAPTER 3 - THE CREATION
    // Mood: Horror, catastrophe, the moment everything changes
    // THIS IS THE MOST IMPORTANT SCENE IN THE DEMO
    // The silence at 7-8s is the emotional peak
    // Every sound decision serves that one second of nothing
    // =====================================================================
    {
      id: 3,
      title: "Chapter IV - The Secret of Life",
      narration: "/audio/frankenstein/ch3.mp3",
      emotion: "terrified",
      sceneAnalysis: { mood: "horror", tension: 0.92, environment: "indoor" },
      tension: 0.92,

      ambient: [
        // Deep oppressive sub-bass drone
        {
          type: "procedural",
          sound: "drone",
          frequency: 40,
          waveform: "square",
          volume: 0.08,
          fadeIn: 3,
        },
      ],
      environmentEvents: [
        { sound: "/audio/sfx/rain_loop.mp3", position: [3, 1, 4], movement: "fixed", duration: 30000, delay: 0, volume: 0.18, loop: true, label: "rain high on the laboratory window" },
        { sound: "/audio/sfx/breathing_raspy.mp3", startPosition: [0.6, 0, -0.9], movement: "fixed", duration: 5000, delay: 8500, volume: 0.22, triggerTension: 0.2, silenceAfter: { duration: 1200 }, voiceReaction: "No. No, what have I done?", label: "creature first breath in front of you" },
      ],

      // This chapter uses a TIMED SEQUENCE instead of random triggers
      // Every cue is precisely choreographed
      timedSequence: [
        // 0-3s: Scene establishes - rain on window, building dread
        {
          time: 0,
          action: "play",
          file: "/audio/sfx/rain_loop.mp3",
          volume: 0.25,
          loop: true,
          position: { x: 2, y: 1, z: -1 },
          label: "rain on window",
        },
        {
          time: 0,
          action: "play",
          file: "/audio/sfx/electrical_hum.mp3",
          volume: 0.1,
          loop: true,
          position: { x: -2, y: 0, z: -2 },
          label: "equipment warming up",
        },

        // 3-5s: Equipment grows louder - something is happening
        {
          time: 3000,
          action: "fadeGain",
          target: "equipment warming up",
          toVolume: 0.4,
          duration: 2,
          label: "equipment intensifies",
        },

        // 5-6s: Electrical crackling - random bursts
        {
          time: 5000,
          action: "play",
          file: "/audio/sfx/ice_crack.mp3",
          volume: 0.3,
          position: { x: -1, y: 1, z: -2 },
          label: "electrical crack 1",
        },
        {
          time: 5500,
          action: "play",
          file: "/audio/sfx/ice_crack.mp3",
          volume: 0.2,
          position: { x: 2, y: 0, z: -3 },
          label: "electrical crack 2",
        },

        // 6-7s: LIGHTNING STRIKE - the climax before silence
        {
          time: 6000,
          action: "play",
          file: "/audio/sfx/thunder.mp3",
          volume: 0.9,
          position: { x: 0, y: 3, z: -5 },
          label: "lightning strike",
        },
        // Immediately drop all ambient to 5%
        {
          time: 6200,
          action: "fadeAllAmbient",
          toVolume: 0.05,
          duration: 0.5,
          label: "world goes quiet",
        },

        // =============================================================
        // 7-8s: THE SILENCE
        // This is the most powerful moment in the entire demo.
        // One full second where EVERYTHING stops.
        // The listener holds their breath.
        // The creature is about to live.
        // =============================================================
        {
          time: 7000,
          action: "silence",
          duration: 1000,
          label: "COMPLETE SILENCE - the eye is about to open",
        },

        // 8s: THE EYE OPENS - heartbeat directly in front
        {
          time: 8000,
          action: "play",
          file: "/audio/sfx/heartbeat.mp3",
          volume: 0.6,
          loop: true,
          position: { x: 0, y: 0, z: -1 },
          label: "creature heartbeat - it lives",
        },

        // 8.5s: First breath - the creature is alive
        {
          time: 8500,
          action: "play",
          file: "/audio/sfx/breathing_raspy.mp3",
          volume: 0.3,
          position: { x: 0, y: 0, z: -1 },
          label: "creature first breath",
        },

        // 10s: Heartbeat grows
        {
          time: 10000,
          action: "fadeGain",
          target: "creature heartbeat - it lives",
          toVolume: 0.8,
          duration: 2,
          label: "heartbeat intensifies",
        },

        // 12-15s: Victor stumbles backward in horror
        {
          time: 12000,
          action: "play",
          file: "/audio/sfx/footsteps_stone.mp3",
          volume: 0.4,
          movement: {
            type: "retreat",
            from: { x: 0, y: 0, z: 0 },
            to: { x: -3, y: 0, z: 2 },
            duration: 3,
          },
          label: "Victor stumbling backward",
        },

        // 15s+: Tension holds - ambient slowly returns
        {
          time: 15000,
          action: "fadeAllAmbient",
          toVolume: 0.06,
          duration: 5,
          label: "world slowly returns",
        },
      ],

      spatial: [],

      silenceMoments: [
        { time: 7000, duration: 1000, reason: "The creature's eye opens. Everything stops." },
      ],
    },

    // =====================================================================
    // CHAPTER 4 - THE CREATURE SPEAKS
    // Mood: Anguish, confrontation, moral reckoning
    // The creature should feel LARGE and CLOSE
    // Victor should feel small and retreating
    // =====================================================================
    {
      id: 4,
      title: "The Creature Speaks",
      narration: "/audio/frankenstein/ch4.mp3",
      emotion: "anguished",
      sceneAnalysis: { mood: "horror", tension: 0.78, environment: "forest" },
      tension: 0.78,

      ambient: [
        { file: "/audio/sfx/wind_loop.mp3", volume: 0.25, loop: true, fadeIn: 3 },
      ],
      environmentEvents: [
        { sound: "/audio/sfx/footsteps_stone.mp3", position: [0, 0, -10], movement: "approaching", duration: 10000, delay: 2500, volume: 0.28, label: "creature mass moving toward you" },
      ],

      spatial: [
        // Heavy footsteps approaching - the creature comes
        {
          file: "/audio/sfx/footsteps_stone.mp3",
          volume: 0.5,
          movement: {
            type: "approach",
            from: { x: 0, y: 0, z: -8 },
            to: { x: 0, y: 0, z: -2 },
            duration: 10,
          },
          trigger: { type: "timed", delay: 3000 },
          label: "creature approaching",
        },
        // Wind gusts when creature gestures
        {
          file: "/audio/sfx/wind_loop.mp3",
          volume: 0.3,
          trigger: { type: "random", minDelay: 8000, maxDelay: 15000, randomX: true },
          duration: 2,
          label: "wind gust",
        },
      ],

      silenceMoments: [],
    },

    // =====================================================================
    // CHAPTER 5 - EPILOGUE
    // Mood: Desolation, grief, the weight of consequence
    // The creature walks away into nothing
    // This should feel like the end of everything
    // The final silence is permanent
    // =====================================================================
    {
      id: 5,
      title: "Epilogue - The Cost of Ambition",
      narration: "/audio/frankenstein/ch5.mp3",
      emotion: "devastated",
      sceneAnalysis: { mood: "dark", tension: 0.22, environment: "forest" },
      tension: 0.22,

      ambient: [
        // Near silence - vast emptiness
        { file: "/audio/sfx/wind_loop.mp3", volume: 0.04, loop: true, fadeIn: 5 },
      ],
      environmentEvents: [
        { sound: "/audio/sfx/footsteps_dirt.mp3", position: [0, 0, -2], movement: "retreating", duration: 24000, delay: 5000, volume: 0.2, label: "creature disappearing into the ice" },
      ],

      spatial: [
        // Single footsteps fading into infinite distance
        // This is the emotional core of the epilogue
        // Each step quieter than the last
        // The creature vanishes
        {
          file: "/audio/sfx/footsteps_dirt.mp3",
          volume: 0.3,
          movement: {
            type: "recede",
            from: { x: 0, y: 0, z: -2 },
            to: { x: 0, y: 0, z: -20 },
            duration: 30,
            fadeWithDistance: true,
          },
          trigger: { type: "timed", delay: 5000 },
          label: "creature walks away forever",
        },
        // Occasional ice crack - barely there
        {
          file: "/audio/sfx/ice_crack.mp3",
          volume: 0.04,
          position: { x: 0, y: 0, z: -15 },
          trigger: { type: "random", minDelay: 20000, maxDelay: 35000, randomX: true },
        },
      ],

      // Final 5 seconds: everything stops
      // The creature has vanished into darkness
      // The story is over
      silenceMoments: [
        { time: -5000, duration: 5000, reason: "Final silence. The creature is gone. The story ends in emptiness." },
      ],
    },
  ],
};

// Sound effect file manifest - what needs to exist in /public/audio/sfx/
const REQUIRED_SFX = [
  { file: "wind_loop.mp3", description: "arctic wind howling, continuous loop" },
  { file: "rain_loop.mp3", description: "heavy rain hitting glass window, continuous" },
  { file: "thunder.mp3", description: "single loud thunder crack" },
  { file: "heartbeat.mp3", description: "slow human heartbeat, rhythmic" },
  { file: "footsteps_stone.mp3", description: "footsteps on stone floor, single steps" },
  { file: "footsteps_dirt.mp3", description: "footsteps on dirt path, walking" },
  { file: "wolf_howl.mp3", description: "distant wolf howling at night" },
  { file: "door_creak.mp3", description: "old wooden door creaking open slowly" },
  { file: "fire_crackle.mp3", description: "fire crackling in fireplace" },
  { file: "ice_crack.mp3", description: "ice cracking and breaking" },
  { file: "electrical_hum.mp3", description: "electrical equipment humming and buzzing" },
  { file: "breathing_raspy.mp3", description: "raspy heavy breathing, monster-like" },
  { file: "water_lapping.mp3", description: "gentle water lapping on lakeshore" },
  { file: "leaves_rustle.mp3", description: "leaves rustling in gentle breeze" },
];

export { FRANKENSTEIN_AUDIO, REQUIRED_SFX };
