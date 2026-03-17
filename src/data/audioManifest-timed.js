// ===========================================================================
// MOVIANX AUDIO MANIFEST - 10 Seconds (Timed Horror)
// ===========================================================================
// INTERACTION MODEL: Companion Whisper
// The narrator is NOT a distant storyteller.
// The narrator is a CHARACTER - the husband/wife whispering to the user.
// The user is physically IN the scene. They are being asked for help.
// Choices are whispered urgently. The user responds.
// Timer creates real psychological pressure.
// ===========================================================================

const TIMED_HORROR_AUDIO = {
  storyId: 3,
  title: "10 Seconds",
  narrator: {
    // Voice should be: whispered, urgent, scared, intimate - like someone
    // hiding next to you in the dark, mouth close to your ear
    voiceQuery: "male whisper urgent scared intimate American",
    model: "eleven_multilingual_v2",
    // Default settings - overridden per chapter for emotional progression
    settings: { stability: 0.3, similarity_boost: 0.9, style: 0.6 },
  },

  // Per-chapter voice settings for emotional progression
  chapterVoiceSettings: {
    // Ch0: Starts groggy/confused, ends scared. More unpredictable emotion.
    0: { stability: 0.25, similarity_boost: 0.9, style: 0.7 },
    // Ch1: Full fear, trying to stay quiet. Voice shakes.
    1: { stability: 0.2, similarity_boost: 0.9, style: 0.8 },
    // Ch2: Absolute panic barely contained. Maximum emotional variation.
    2: { stability: 0.15, similarity_boost: 0.9, style: 0.9 },
    // Ch3: Hollow, broken, empty. Numb, flat delivery.
    3: { stability: 0.6, similarity_boost: 0.9, style: 0.3 },
  },

  companionScript: {
    // Ch0: Confused → scared. Sentences get shorter as fear builds.
    0: {
      text: "Hey... hey wake up. [pause] Did you hear that? ... That was glass. Downstairs. [pause] Someone's in the house. [pause] ... I can hear footsteps. More than one person. [pause] Oh god. [pause] The bat's in the closet. My phone... it's almost dead. [pause] The alarm... it's downstairs. Where they are. [pause] The kids are down the hall. [pause] ... What do we do? [pause] We have ten seconds. Tell me.",
      choicePrompt: "Please... tell me. [pause] Do we grab the bat? ... Or call 911? [pause] Do we get the kids... go out the window? [pause] Or barricade in the bathroom? [pause] ... Ten seconds. What do we do?",
    },
    // Ch1: Terrified. Mostly fragments. Long silences where they're listening.
    1: {
      text: "They're coming up. [pause] ... The stairs. I can hear them. [pause] One step. [pause] Two. [pause] ... Three. [pause] They stopped. [pause] [pause] ... No. They're moving again. [pause] The kids. [pause] ... Right there. Three doors down. [pause] He said something. [pause] ... He knows we're here. [pause] He's on the landing now. [pause] Same floor. [pause] ... Same air. [pause] I can't think. [pause] What do we do? ... Please.",
      choicePrompt: "Do we rush them? [pause] ... Yell that police are coming? [pause] Stay silent? [pause] Or... you go to the kids. I'll distract them. [pause] ... Ten seconds. What do we do?",
    },
    // Ch2: Breaking. Can barely form words. Lots of pauses. Crying.
    2: {
      text: "He has a gun. [pause] ... I can see it. [pause] [pause] Our baby. [pause] She's crying. ... She can hear us. [pause] He said... last chance. [pause] [pause] ... Whatever happens. [pause] Protect the kids. [pause] ... Promise me. [pause] Promise me. [pause] [pause] The handle. [pause] ... It's turning. [pause] Right now. [pause] [pause] ... Tell me. [pause] Please. [pause] ... I can't do this alone.",
      choicePrompt: "Do we swing? [pause] ... When the door opens? [pause] Do we surrender? [pause] ... Or push them in the bathroom. Face them alone. [pause] [pause] ... Now. Tell me now.",
    },
    // Ch3: Hollow. Flat. Disconnected. Long gaps between thoughts.
    3: {
      text: "It's done. [pause] [pause] [pause] There was no right answer. [pause] ... There never was. [pause] [pause] I keep hearing it. [pause] ... Over and over. [pause] The sound. The choices. [pause] ... The ten seconds. [pause] [pause] [pause] What did we become? [pause] [pause] ... What did we become in ten seconds?",
      choicePrompt: null,
    },
  },

  chapters: [
    // =====================================================================
    // CHAPTER 0 - 3:47 AM
    // Silence is the tool. No ambient. Let the sound design speak.
    // =====================================================================
    {
      id: 0,
      title: "3:47 AM",
      narration: "/audio/timed/ch0.mp3",
      narrationCompanion: "/audio/timed/ch0_companion.mp3",
      emotion: "terrified",

      ambient: [],

      timedSequence: [
        // 2s: GLASS BREAKING - downstairs, below and in front
        {
          time: 2000,
          action: "play",
          file: "/audio/sfx/ice_crack.mp3",
          volume: 0.7,
          position: { x: 0, y: -1, z: -4 },
          label: "glass breaking downstairs",
        },

        // 3s: Brief silence after the break
        {
          time: 3000,
          action: "silence",
          duration: 1500,
          label: "frozen moment after glass breaks",
        },

        // 4.5s: Second crash - louder, closer
        {
          time: 4500,
          action: "play",
          file: "/audio/sfx/ice_crack.mp3",
          volume: 0.85,
          position: { x: 1, y: -1, z: -3 },
          label: "second crash closer",
        },

        // 5.5s: Footsteps downstairs - multiple people, below
        {
          time: 5500,
          action: "play",
          file: "/audio/sfx/footsteps_stone.mp3",
          volume: 0.3,
          loop: true,
          position: { x: -1, y: -1, z: -3 },
          label: "intruder footsteps below",
        },
        {
          time: 5800,
          action: "play",
          file: "/audio/sfx/footsteps_stone.mp3",
          volume: 0.25,
          loop: true,
          position: { x: 2, y: -1, z: -4 },
          label: "second intruder below",
        },

        // NO heartbeat here - heartbeat starts when timer begins
      ],

      spatial: [],

      timerAudio: {
        heartbeatStartAt: "timerStart",
        heartbeatIntensity: {
          10: 0.1,
          8: 0.15,
          6: 0.25,
          4: 0.4,
          3: 0.6,
          2: 0.8,
          1: 0.95,
          0: 1.0,
        },
        rushAt: 3,
        rushVolume: 0.2,
      },

      silenceMoments: [
        { time: 3000, duration: 1500, reason: "The moment after glass breaks. User processes what just happened." },
      ],
    },

    // =====================================================================
    // CHAPTER 1 - THE HALLWAY
    // Footsteps ascending. No ambient tinnitus. Pure tension.
    // =====================================================================
    {
      id: 1,
      title: "The Hallway",
      narration: "/audio/timed/ch1.mp3",
      narrationCompanion: "/audio/timed/ch1_companion.mp3",
      emotion: "panicked",

      ambient: [],

      timedSequence: [
        // 0s: Distant ransacking sounds
        {
          time: 0,
          action: "play",
          file: "/audio/sfx/door_creak.mp3",
          volume: 0.3,
          position: { x: -2, y: -1, z: -4 },
          label: "ransacking",
        },

        // 3s: Footsteps coming upstairs - ascending movement
        {
          time: 3000,
          action: "play",
          file: "/audio/sfx/footsteps_stone.mp3",
          volume: 0.4,
          movement: {
            type: "ascend",
            from: { x: 0, y: -2, z: -3 },
            to: { x: 0, y: 0, z: -2 },
            duration: 6,
          },
          label: "footsteps coming upstairs",
        },

        // 8s: Footsteps stop - they're on the landing
        {
          time: 8000,
          action: "fadeGain",
          target: "footsteps coming upstairs",
          toVolume: 0,
          duration: 0.5,
          label: "footsteps stop on landing",
        },

        // 8.5s: Silence - they're right outside
        {
          time: 8500,
          action: "silence",
          duration: 1500,
          label: "they stopped moving - they're listening",
        },

        // 10s: Floor creak right outside the door
        {
          time: 10000,
          action: "play",
          file: "/audio/sfx/door_creak.mp3",
          volume: 0.5,
          position: { x: 0, y: 0, z: -1 },
          label: "creak right outside door",
        },
      ],

      spatial: [],

      timerAudio: {
        heartbeatStartAt: "timerStart",
        heartbeatIntensity: {
          10: 0.1, 8: 0.2, 6: 0.35, 4: 0.5, 3: 0.7, 2: 0.85, 1: 0.95, 0: 1.0,
        },
        rushAt: 3,
        rushVolume: 0.3,
      },

      silenceMoments: [
        { time: 8500, duration: 1500, reason: "They stopped on the landing. Listening. You can feel them through the wall." },
      ],
    },

    // =====================================================================
    // CHAPTER 2 - THE CHOICE
    // Maximum intensity. No ambient heartbeat from start.
    // Heartbeat begins with timer.
    // =====================================================================
    {
      id: 2,
      title: "The Choice",
      narration: "/audio/timed/ch2.mp3",
      narrationCompanion: "/audio/timed/ch2_companion.mp3",
      emotion: "terrified",

      ambient: [],

      timedSequence: [
        // 3s: Door handle turning - directly in front, close
        {
          time: 3000,
          action: "play",
          file: "/audio/sfx/door_creak.mp3",
          volume: 0.7,
          position: { x: 0, y: 0, z: -1 },
          label: "door handle turning",
        },

        // 5s: Brief silence before the companion asks
        {
          time: 5000,
          action: "silence",
          duration: 800,
          label: "the moment before the question",
        },
      ],

      spatial: [],

      timerAudio: {
        heartbeatStartAt: "timerStart",
        heartbeatIntensity: {
          10: 0.2, 8: 0.35, 6: 0.5, 4: 0.65, 3: 0.8, 2: 0.9, 1: 1.0, 0: 1.0,
        },
        rushAt: 4,
        rushVolume: 0.4,
      },

      silenceMoments: [
        { time: 5000, duration: 800, reason: "The companion grabs you. Everything stops. They whisper the final question." },
      ],
    },

    // =====================================================================
    // CHAPTER 3 - CONSEQUENCES
    // The aftermath. Sound drains away. No tinnitus.
    // =====================================================================
    {
      id: 3,
      title: "Consequences",
      narration: "/audio/timed/ch3.mp3",
      narrationCompanion: "/audio/timed/ch3_companion.mp3",
      emotion: "devastated",

      ambient: [],

      timedSequence: [
        // 0-5s: Heartbeat slowly fading
        {
          time: 0,
          action: "play",
          file: "/audio/sfx/heartbeat.mp3",
          volume: 0.4,
          loop: true,
          position: { x: 0, y: 0, z: 0 },
          label: "heartbeat fading",
        },
        {
          time: 0,
          action: "fadeGain",
          target: "heartbeat fading",
          toVolume: 0,
          duration: 8,
          label: "heartbeat dies away",
        },

        // 10s onward: pure silence
        {
          time: 10000,
          action: "silence",
          duration: 99999,
          label: "permanent silence - it's over",
        },
      ],

      spatial: [],
      timerAudio: null,

      silenceMoments: [
        { time: 10000, duration: 99999, reason: "There is nothing left to hear. Just the weight of what happened." },
      ],
    },
  ],
};

const TIMED_REQUIRED_SFX = [
  // Most SFX shared with Frankenstein manifest
  // Additional sounds specific to home invasion:
  { file: "glass_break.mp3", description: "glass window breaking, sharp crack" },
  { file: "drawer_opening.mp3", description: "wooden drawer being pulled open roughly" },
  { file: "floor_creak.mp3", description: "old wooden floorboard creaking under weight" },
];

export { TIMED_HORROR_AUDIO, TIMED_REQUIRED_SFX };
