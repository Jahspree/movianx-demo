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
    // Ch0: Groggy → alert → scared → panicked
    // KEY: Real people don't monologue when terrified. They stop. Listen. Freeze. Breathe. Then speak in short bursts.
    0: {
      text: "[groggy, confused] Hmm... what... [3 second pause] [suddenly alert] Wait. [2 second pause] Did you hear that? [long pause] [whispering] That was glass. [pause] Downstairs. [long pause - listening] [faster, scared] There's someone in the house. [pause] [breathing] Oh god. [pause] I think... [pause] I think there's more than one. [pause] I can hear footsteps. [3 second pause - listening to the sounds below] [desperate whisper] What do we do? [long pause] The bat... [pause] it's in the closet. [pause] My phone is almost dead. [pause] The alarm is downstairs. [pause] Where they are. [long shaky breath] [3 second pause] The kids are down the hall. [pause] [voice cracking] We have ten seconds. [pause] Tell me what to do.",
      choicePrompt: "[terrified whisper, voice trembling] Please... [pause] tell me. [pause] Do we grab the bat and go down there? [pause] Do we lock the door and call 911? [pause] Do we get the kids and go out the window? [pause] Or do we barricade in the bathroom? [long shaky breath] [pause] Ten seconds. [pause] What do we do?",
    },
    // Ch1: Terrified, trying to stay quiet. Freezing between every sentence.
    1: {
      text: "[trembling whisper] They're coming up. [3 second pause - listening] [swallows] I can hear them on the stairs. [long pause] [breathing through teeth] One step... [pause] two... [pause] three... [3 second pause] They stopped. [long pause - silence] [barely audible] No wait. [pause] They're moving again. [long pause] [voice breaking] The kids... [pause] the kids are right there. [pause] Three doors down. [3 second pause] [sharp inhale] He just said... [pause] he said he knows someone's up here. [long pause] [crying quietly, muffled] He's on the landing. [pause] Same floor as us. [pause] Same air. [3 second pause] [barely breathing] I can't... [pause] I can't think. [long pause] What do we do? [pause] Please. [choking back tears]",
      choicePrompt: "[muffled whisper, almost inaudible, shaking] Do we rush them on the stairs? [long pause] Do we yell that police are coming? [pause] Do we stay silent and let them take what they want? [pause] Or do you go to the kids while I distract them? [long pause] [suppressed sob] Ten seconds. [pause] What do we do?",
    },
    // Ch2: Absolute panic. Hyperventilating. Long silences of pure dread.
    2: {
      text: "[hyperventilating whisper] He has a gun. [long pause] I can see it. [3 second pause] [long shaking breath] [sobbing silently] Our baby is crying. [pause] She can hear everything. [pause] She's calling for us. [3 second pause - listening to daughter cry] [desperate, barely controlled] He said last chance. [long pause] Come out now. [3 second pause] [gripping so tight it hurts] [voice cracks completely] Whatever happens... [long pause] whatever you decide... [pause] [gasping] protect the kids. [pause] Promise me. [pause] Promise me right now. [3 second pause] [almost inaudible, shattered] The handle. [long pause] It's turning. [pause] Right now. [3 second pause - silence] Tell me what to do. [pause] Right now. [pause] Please. [long pause] I can't... [pause] I can't decide this alone.",
      choicePrompt: "[final whisper, voice destroyed] Do we swing the bat when the door opens? [long pause] Do we surrender and beg them not to hurt anyone? [long pause] Or do we push everyone into the bathroom and face them alone? [3 second pause] [long trembling silence] Now. [pause] Tell me now.",
    },
    // Ch3: Hollow. Distant. Long silences between every thought.
    3: {
      text: "[hollow, distant] It's done. [5 second pause] [flat, disconnected] There was no right answer. [long pause] There never was. [3 second pause] [quiet, empty] I keep hearing it. [long pause] Over and over. [pause] The sound. [pause] The choices. [pause] The ten seconds. [5 second pause] [barely audible, numb] What did we become? [3 second pause] What did we become... [long pause] in ten seconds?",
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
