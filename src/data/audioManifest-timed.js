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
  isTimedExperience: true,
  assetVersion: "20260501-launch-audio-1",
  title: "10 Seconds",
  timeline: {
    revealLeadRatio: 0.92,
    minMsPerWord: 200,
    choiceRevealBufferMs: 1200,
    promptToTimerBufferMs: 300,
    cinematicTimedChoiceDelayMs: 2000,
    defaultTimeLimit: 10,
    silenceFloor: 0.025,
  },
  narrator: {
    // Voice should be: whispered, urgent, scared, intimate - like someone
    // hiding next to you in the dark, mouth close to your ear
    voiceQuery: "male whisper urgent scared intimate American",
    model: "eleven_multilingual_v2",
    settings: { stability: 0.4, similarity_boost: 0.85, style: 0.35, speed: 0.95 },
  },

  // Keep generation stable; emotion comes from acting direction and scene context.
  chapterVoiceSettings: {
    0: { stability: 0.4, similarity_boost: 0.85, style: 0.35, speed: 0.95 },
    1: { stability: 0.4, similarity_boost: 0.85, style: 0.35, speed: 0.95 },
    2: { stability: 0.4, similarity_boost: 0.85, style: 0.35, speed: 0.95 },
    3: { stability: 0.4, similarity_boost: 0.85, style: 0.35, speed: 0.95 },
  },

  companionScript: {
    // Ch0: Groggy → confused → terrified. Each line is its own breath.
    0: {
      text: "Hey... wake up... did you hear that?... no... listen... that wasn't nothing... someone's in the house... I heard glass... downstairs... oh god... they're inside... I can hear them moving... more than one... the bat's in the closet... my phone's dead... the kids are down the hall... what do we do?",
      choicePrompt: "Tell me. Bat... or 911... or the window with the kids... or we hide. Ten seconds. Tell me.",
    },
    // Ch1: Terrified. Mostly fragments. Long silences where they're listening.
    1: {
      text: "They're coming up. The stairs. I can hear them. One step. Two. Three. They stopped... No. They're moving again. The kids. Right there. Three doors down. He said something. He knows we're here. He's on the landing now. Same floor. Same air. I can't think. What do we do? Please.",
      choicePrompt: "Do we rush them? Yell that police are coming? Stay silent? Or you go to the kids and I distract them? Ten seconds. What do we do?",
    },
    // Ch2: Breaking. Can barely form words. Lots of pauses. Crying.
    2: {
      text: "He has a gun. I can see it. Our baby... she's crying. She can hear us. He said, last chance. Whatever happens, protect the kids. Promise me. Promise me. The handle... it's turning. Right now. Tell me. Please. I can't do this alone.",
      choicePrompt: "Do we swing when the door opens? Do we surrender? Or do we push them in the bathroom and face this alone? Now. Tell me now.",
    },
    // Ch3: Hollow. Flat. Disconnected. Long gaps between thoughts.
    3: {
      text: "It's done. There was no right answer. There never was. I keep hearing it. Over and over. The sound. The choices. The ten seconds. What did we become? What did we become in ten seconds?",
      choicePrompt: null,
    },
  },
  characterDialogue: {
    0: { speaker: "Sarah", line: { text: "Tell me. Bat... or 911... or the window with the kids... or we hide. Ten seconds. Tell me.", breathLevel: 0.62, tremble: 0.68, whisper: true, pacing: "broken" } },
    1: { speaker: "Sarah", line: { text: "Do we rush them? Yell that police are coming? Stay silent? Or you go to the kids and I distract them? Ten seconds. What do we do?", breathLevel: 0.74, tremble: 0.82, whisper: true, pacing: "rushed" } },
    2: { speaker: "Sarah", line: { text: "Do we swing when the door opens? Do we surrender? Or do we push them in the bathroom and face this alone? Now. Tell me now.", breathLevel: 0.9, tremble: 0.95, whisper: true, pacing: "broken" } },
    3: { speaker: "Internal", line: null },
  },

  chapters: [
    // =====================================================================
    // CHAPTER 0 - 3:47 AM
    // Silence is the tool. No ambient. Let the sound design speak.
    // =====================================================================
    {
      id: 0,
      title: "3:47 AM",
      narration: "/audio/v3/timed/ch0.mp3",
      narrationCompanion: "/audio/v3/timed/ch0_companion.mp3",
      music: { file: "/audio/v3/music/timed_ch0.mp3", volume: 0.22, fadeIn: 3, loop: true },
      emotion: "terrified",
      sceneAnalysis: { mood: "horror", tension: 0.72, environment: "indoor" },
      tension: 0.72,

      // ONE low drone underneath. Cinematic pulse. Clearly present but narrator dominant.
      ambient: [
        { type: "procedural", sound: "drone", volume: 0.06, frequency: 36, waveform: "sine", fadeIn: 3, label: "timed_ch0_drone" },
      ],
      environmentEvents: [
        { sound: "/audio/sfx/footsteps_stone.mp3", startPosition: [0, -1, -6], endPosition: [0, -0.4, -1.2], movement: "approaching", duration: 5200, delay: 11500, volume: 0.18, triggerTension: 0.22, unsourced: true, voiceReaction: "Don't move. Don't even breathe.", label: "intruder footsteps approaching from downstairs" },
        { sound: "/audio/sfx/breathing_raspy.mp3", startPosition: [0.18, 0, -0.12], movement: "fixed", duration: 1400, delay: 22000, volume: 0.075, loop: false, triggerTension: 0.1, label: "Sarah single breath in right ear" },
      ],

      timedSequence: [
        // 6s: Glass break. Late. After the narrator has been whispering.
        // The listener has settled into silence. Then this.
        {
          time: 6000,
          action: "play",
          file: "/audio/sfx/ice_crack.mp3",
          volume: 0.6,
          position: { x: 0, y: -1, z: -4 },
          label: "glass breaking downstairs",
        },

        // 7s: Total silence. Let the glass ring in their ears.
        {
          time: 7000,
          action: "silence",
          duration: 2500,
          label: "frozen — did that just happen",
        },

        // 12s: Single footstep below. Just one.
        {
          time: 12000,
          action: "play",
          file: "/audio/sfx/footsteps_stone.mp3",
          volume: 0.2,
          position: { x: -1, y: -1, z: -3 },
          label: "single footstep below",
        },

        // 15s: Second footstep. Confirming. It's real.
        {
          time: 15000,
          action: "play",
          file: "/audio/sfx/footsteps_stone.mp3",
          volume: 0.25,
          position: { x: 1, y: -1, z: -4 },
          label: "second footstep confirming",
        },

        // 18s: Floor creak directly below. They're moving through the house.
        {
          time: 18000,
          action: "play",
          file: "/audio/sfx/floor_creak.mp3",
          volume: 0.15,
          position: { x: 0, y: -1, z: -2 },
          label: "creak below — they are moving",
        },
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
        { time: 7000, duration: 2500, reason: "Glass just broke. You are frozen. Counting seconds in the dark." },
      ],
    },

    // =====================================================================
    // CHAPTER 1 - THE HALLWAY
    // Footsteps ascending. No ambient tinnitus. Pure tension.
    // =====================================================================
    {
      id: 1,
      title: "The Hallway",
      narration: "/audio/v3/timed/ch1.mp3",
      narrationCompanion: "/audio/v3/timed/ch1_companion.mp3",
      music: { file: "/audio/v3/music/timed_ch1.mp3", volume: 0.20, fadeIn: 2.5, loop: true },
      emotion: "panicked",
      sceneAnalysis: { mood: "horror", tension: 0.84, environment: "indoor" },
      tension: 0.84,

      ambient: [
        { type: "procedural", sound: "room_tone", volume: 0.008, frequency: 42, waveform: "sine", fadeIn: 1.5, label: "timed_ch1_room_tone" },
        { file: "/audio/sfx/electrical_hum.mp3", volume: 0.015, fadeIn: 2, label: "timed_ch1_hall_hum" },
      ],
      environmentEvents: [
        { sound: "/audio/sfx/footsteps_stone.mp3", startPosition: [0, -2, -7], endPosition: [0, -0.3, -1], movement: "approaching", duration: 6500, delay: 2800, volume: 0.34, triggerTension: 0.28, unsourced: true, voiceReaction: "They're on the stairs.", label: "heavy footsteps climbing behind the wall" },
        { sound: "/audio/sfx/door_creak.mp3", startPosition: [-2, 0, 4], movement: "fixed", duration: 1200, delay: 11200, volume: 0.16, triggerTension: 0.12, silenceAfter: { duration: 900 }, label: "distant door below" },
      ],

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
        {
          time: 8500,
          action: "fadeGain",
          target: "timed_ch1_hall_hum",
          toVolume: 0.008,
          duration: 1,
          label: "hall hum thins when they reach the landing",
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

      spatial: [
        {
          file: "/audio/sfx/floor_creak.mp3",
          volume: 0.06,
          position: { x: 1, y: 0, z: -1 },
          trigger: { type: "random", minDelay: 13000, maxDelay: 20000 },
          label: "hall floor settling",
        },
      ],

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
      narration: "/audio/v3/timed/ch2.mp3",
      narrationCompanion: "/audio/v3/timed/ch2_companion.mp3",
      music: { file: "/audio/v3/music/timed_ch2.mp3", volume: 0.25, fadeIn: 1.5, loop: true },
      emotion: "terrified",
      sceneAnalysis: { mood: "horror", tension: 0.96, environment: "indoor" },
      tension: 0.96,

      ambient: [
        { type: "procedural", sound: "room_tone", volume: 0.006, frequency: 38, waveform: "sine", fadeIn: 1, label: "timed_ch2_room_tone" },
      ],
      environmentEvents: [
        { sound: "/audio/sfx/door_creak.mp3", position: [0, 0, -0.7], movement: "fixed", duration: 1200, delay: 2600, volume: 0.55, label: "door handle directly ahead" },
        { sound: "/audio/sfx/breathing_raspy.mp3", position: [1.2, 0, -0.25], movement: "fixed", duration: 1600, delay: 6200, volume: 0.09, loop: false, label: "Sarah single breath breaking in right ear" },
      ],

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
        {
          time: 3000,
          action: "fadeGain",
          target: "timed_ch2_room_tone",
          toVolume: 0.004,
          duration: 1.5,
          label: "room tone drains when the handle turns",
        },
      ],

      spatial: [
        {
          file: "/audio/sfx/floor_creak.mp3",
          volume: 0.05,
          position: { x: 0, y: 0, z: -1 },
          trigger: { type: "timed", delay: 1800 },
          label: "weight shifts outside the door",
        },
      ],

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
      narration: "/audio/v3/timed/ch3.mp3",
      narrationCompanion: "/audio/v3/timed/ch3_companion.mp3",
      music: { file: "/audio/v3/music/timed_ch3.mp3", volume: 0.15, fadeIn: 4, loop: true },
      emotion: "devastated",
      sceneAnalysis: { mood: "dark", tension: 0.35, environment: "indoor" },
      tension: 0.35,

      ambient: [],
      environmentEvents: [
        { sound: "/audio/sfx/electrical_hum.mp3", position: [0, 0, 5], movement: "fixed", duration: 12000, delay: 0, volume: 0.018, loop: true, label: "aftermath room tone ahead" },
      ],

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
