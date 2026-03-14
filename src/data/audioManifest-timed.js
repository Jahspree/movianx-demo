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
    settings: { stability: 0.3, similarity_boost: 0.9, style: 0.6 },
    // Lower stability = more emotional variation
    // Higher similarity = consistent voice identity
    // Higher style = more expressive delivery
  },

  // Narration style instructions for ElevenLabs generation:
  // The narrator speaks AS the character, directly to the user.
  // NOT: "You wake up to glass breaking downstairs."
  // YES: "[whispered] Hey... hey wake up. Did you hear that? 
  //       Something just broke downstairs. What do we do?"
  //
  // This means we need REWRITTEN text for immersive mode.
  // The original text stays for Reader/Cinematic mode.
  // Immersive mode uses the companion script below.

  companionScript: {
    // Rewritten dialogue where narrator speaks TO the user as a companion
    0: {
      text: "[whispered, urgent] Hey... hey, wake up. Did you hear that? Something just broke downstairs. Glass. That was definitely glass. [pause] There's someone in the house. [pause] Oh god, I think there's more than one. I can hear footsteps. [desperate whisper] What do we do? The bat's in the closet. My phone's almost dead. The alarm panel is downstairs where they are. [panicked breathing] We have ten seconds. Tell me what to do.",
      choicePrompt: "[barely audible whisper] Please... tell me. Do we grab the bat and go down there? Do we lock the door and call 911? Do we get the kids and go out the window? Or do we barricade in the bathroom? [shaking] Ten seconds. Please.",
    },
    1: {
      text: "[whispered, trembling] I can hear them. They're tearing the living room apart. Drawers, furniture, everything. [pause] Oh no. [long pause] One of them just said 'check upstairs.' [desperate grab of user's arm] They're coming up the stairs. I can hear them. Heavy. Slow. They know we're here. [voice breaking] The kids are three doors down. [pause] He's on the landing now. He just said 'I know someone's up here.' [barely breathing] What do we do? Ten seconds.",
      choicePrompt: "[muffled whisper, almost inaudible] Do we rush them on the stairs? Do we yell that police are coming? Do we stay silent and let them take what they want? Or do you go to the kids while I distract them? [tears] Ten seconds. Please decide.",
    },
    2: {
      text: "[whispered, shaking violently] He has a gun. I can see it. [long silence] Our daughter is crying. She can hear everything. [pause] He said 'last chance, come out now.' [gripping user] Whatever you decide... protect the kids. That's all that matters. [pause] The door handle is turning. Right now. [voice barely audible] This is it. Tell me.",
      choicePrompt: "[final whisper] Do we swing the bat when the door opens? Do we surrender and beg them not to hurt anyone? Or do we push everyone into the bathroom and face them alone? [silence] Now. Tell me now.",
    },
    3: {
      text: "[quiet, hollow] It's over. [long pause] There was no good choice. Just the one we made in ten seconds. [pause] And the one we live with forever. [silence]",
      choicePrompt: null,
    },
  },

  chapters: [
    // =====================================================================
    // CHAPTER 0 - 3:47 AM
    // The user is in bed. It's pitch dark. Glass breaks downstairs.
    // Sound design: intimate, close, terrifying in its quietness
    // Everything should feel like it's happening in YOUR house
    // =====================================================================
    {
      id: 0,
      title: "3:47 AM",
      narration: "/audio/timed/ch0.mp3",
      narrationCompanion: "/audio/timed/ch0_companion.mp3",
      emotion: "terrified",

      ambient: [
        // Near silence of a house at night - barely perceptible hum
        {
          type: "procedural",
          sound: "room_tone",
          frequency: 50,
          waveform: "sine",
          volume: 0.02,
          label: "house silence",
        },
      ],

      timedSequence: [
        // 0s: Dead quiet. Just room tone. User is being woken up.
        // Let the silence itself be unsettling.

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

        // 8s: Heartbeat starts - yours, not a creature's
        // Positioned at center because it's YOUR heart
        {
          time: 8000,
          action: "play",
          file: "/audio/sfx/heartbeat.mp3",
          volume: 0.4,
          loop: true,
          position: { x: 0, y: 0, z: 0 },
          label: "your heartbeat",
        },

        // When timer starts: heartbeat tempo should increase
        // Volume of heartbeat increases as timer decreases
      ],

      spatial: [],

      // Timer audio behavior
      timerAudio: {
        // As the 10-second timer counts down:
        heartbeatIntensity: {
          10: 0.3,  // calm-ish
          8: 0.4,
          6: 0.5,
          4: 0.65,
          3: 0.75,
          2: 0.85,
          1: 0.95,  // pounding
          0: 1.0,   // maximum
        },
        // At 3 seconds: add rushing blood sound (filtered noise)
        rushAt: 3,
        rushVolume: 0.2,
      },

      silenceMoments: [
        { time: 3000, duration: 1500, reason: "The moment after glass breaks. User processes what just happened." },
      ],
    },

    // =====================================================================
    // CHAPTER 1 - THE HALLWAY
    // Intruders are coming upstairs. Footsteps on stairs.
    // Sound should MOVE from below to the same level as the user.
    // The voice says "check upstairs" - should come from below-left.
    // =====================================================================
    {
      id: 1,
      title: "The Hallway",
      narration: "/audio/timed/ch1.mp3",
      narrationCompanion: "/audio/timed/ch1_companion.mp3",
      emotion: "panicked",

      ambient: [
        // Tense silence with slight ringing (fear response)
        {
          type: "procedural",
          sound: "tinnitus",
          frequency: 4200,
          waveform: "sine",
          volume: 0.015,
          label: "fear tinnitus",
        },
      ],

      timedSequence: [
        // 0s: Distant ransacking sounds - drawers, furniture
        {
          time: 0,
          action: "play",
          file: "/audio/sfx/door_creak.mp3",
          volume: 0.3,
          position: { x: -2, y: -1, z: -4 },
          label: "ransacking",
        },

        // 3s: Voice from below - "check upstairs"
        // This could be a pre-recorded line or just implied by the narration
        // The sound of footsteps shifts from below to the stairs
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

        // 5s: Heartbeat returns
        {
          time: 5000,
          action: "play",
          file: "/audio/sfx/heartbeat.mp3",
          volume: 0.5,
          loop: true,
          position: { x: 0, y: 0, z: 0 },
          label: "your heartbeat",
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
        heartbeatIntensity: {
          10: 0.4, 8: 0.5, 6: 0.6, 4: 0.7, 3: 0.8, 2: 0.9, 1: 0.95, 0: 1.0,
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
    // The door is opening. Armed intruder. Family behind you.
    // This is maximum intensity. Everything compressed.
    // Sound should feel like the walls are closing in.
    // =====================================================================
    {
      id: 2,
      title: "The Choice",
      narration: "/audio/timed/ch2.mp3",
      narrationCompanion: "/audio/timed/ch2_companion.mp3",
      emotion: "terrified",

      ambient: [
        // Heartbeat already running from transition
        {
          file: "/audio/sfx/heartbeat.mp3",
          volume: 0.6,
          loop: true,
          position: { x: 0, y: 0, z: 0 },
        },
      ],

      timedSequence: [
        // 0s: Daughter crying - down the hall to the right
        {
          time: 0,
          action: "play",
          type: "procedural",
          sound: "crying",
          volume: 0.15,
          position: { x: 3, y: 0, z: -2 },
          label: "daughter crying",
        },

        // 3s: Door handle turning - directly in front, close
        {
          time: 3000,
          action: "play",
          file: "/audio/sfx/door_creak.mp3",
          volume: 0.7,
          position: { x: 0, y: 0, z: -1 },
          label: "door handle turning",
        },

        // 4s: Heartbeat maximum
        {
          time: 4000,
          action: "fadeGain",
          target: "heartbeat",
          toVolume: 0.9,
          duration: 1,
          label: "heartbeat pounding",
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
        heartbeatIntensity: {
          10: 0.6, 8: 0.7, 6: 0.8, 4: 0.85, 3: 0.9, 2: 0.95, 1: 1.0, 0: 1.0,
        },
        rushAt: 5,
        rushVolume: 0.4,
      },

      silenceMoments: [
        { time: 5000, duration: 800, reason: "The companion grabs you. Everything stops. They whisper the final question." },
      ],
    },

    // =====================================================================
    // CHAPTER 3 - CONSEQUENCES
    // The aftermath. Whatever happened, it's over.
    // Sound should drain away. Like waking from a nightmare.
    // Except you don't wake up.
    // =====================================================================
    {
      id: 3,
      title: "Consequences",
      narration: "/audio/timed/ch3.mp3",
      narrationCompanion: "/audio/timed/ch3_companion.mp3",
      emotion: "devastated",

      ambient: [
        // Ringing silence - the aftermath
        {
          type: "procedural",
          sound: "tinnitus",
          frequency: 3800,
          waveform: "sine",
          volume: 0.03,
          label: "aftermath ringing",
        },
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
