// ===========================================================================
// Beat Manifest — 10 Seconds (storyId = "10seconds")
//
// 18 beats across 4 chapters.
// Tension: 0–100 scale matching EmotionEngine.
// silenceAfter: ms of breath/pause after this beat's narration.
// atmosphere: hints for audio atmosphere layer.
// proximity: "far" | "room" | "close" | "ear" — spatial suggestion.
// events[]: array of action tags future hooks can branch on.
// ===========================================================================

export const BEAT_MANIFEST = {
  "10seconds": {

    // ─── Chapter 0: The Quiet Before ───────────────────────────────────────
    // A family asleep. The first sound breaks everything.
    0: {
      label:    "the quiet before",
      beats: [
        {
          id:          "ch0_sleeping",
          beatIndex:   0,
          label:       "sleeping",
          text:        "A family asleep. The house is still.",
          tension:     12,
          silenceAfter: 1200,
          silenceType: "normal",
          atmosphere:  "ambient_silence",
          proximity:   "far",
          events:      ["atmosphere:fade_in", "heartbeat:dormant"],
        },
        {
          id:          "ch0_first_creak",
          beatIndex:   1,
          label:       "first creak",
          text:        "A sound downstairs. You freeze.",
          tension:     34,
          silenceAfter: 900,
          silenceType: "anticipation",
          atmosphere:  "house_creak",
          proximity:   "room",
          events:      ["sfx:creak", "heartbeat:pulse_slow"],
        },
        {
          id:          "ch0_glass_breaks",
          beatIndex:   2,
          label:       "glass breaks",
          text:        "Glass. Downstairs. Someone is inside.",
          tension:     68,
          silenceAfter: 600,
          silenceType: "fear",
          atmosphere:  "shatter",
          proximity:   "close",
          events:      ["sfx:glass_break", "heartbeat:pulse_fast", "drone:rise"],
        },
        {
          id:          "ch0_realization",
          beatIndex:   3,
          label:       "realization",
          text:        "Your children are in their rooms. You are between them and the stairs.",
          tension:     82,
          silenceAfter: 800,
          silenceType: "anticipation",
          atmosphere:  "dread_drone",
          proximity:   "close",
          events:      ["heartbeat:racing", "atmosphere:swell"],
        },
        {
          id:          "ch0_timer_warning",
          beatIndex:   4,
          label:       "timer warning",
          text:        "Ten seconds. That is all you have.",
          tension:     88,
          silenceAfter: 400,
          silenceType: "anticipation",
          atmosphere:  "dread_drone",
          proximity:   "ear",
          events:      ["timer:prime", "heartbeat:peak"],
        },
      ],
    },

    // ─── Chapter 1: The Threat Advances ────────────────────────────────────
    // You hear them moving. They know you are here.
    1: {
      label:    "the threat advances",
      beats: [
        {
          id:          "ch1_ransacking",
          beatIndex:   0,
          label:       "ransacking",
          text:        "Drawers. Cabinets. They are searching.",
          tension:     72,
          silenceAfter: 700,
          atmosphere:  "ransack_noise",
          proximity:   "room",
          events:      ["sfx:ransack", "atmosphere:noise_layer"],
        },
        {
          id:          "ch1_upstairs",
          beatIndex:   1,
          label:       "footsteps upstairs",
          text:        "Footsteps on the stairs. Slow. Deliberate.",
          tension:     84,
          silenceAfter: 600,
          silenceType: "anticipation",
          atmosphere:  "footsteps_stair",
          proximity:   "close",
          events:      ["sfx:footsteps", "heartbeat:racing"],
        },
        {
          id:          "ch1_landing",
          beatIndex:   2,
          label:       "on the landing",
          text:        "They are on the landing. Inches from your door.",
          tension:     91,
          silenceAfter: 500,
          silenceType: "anticipation",
          atmosphere:  "corridor_silence",
          proximity:   "ear",
          events:      ["heartbeat:peak", "atmosphere:hold_breath"],
        },
        {
          id:          "ch1_come_out",
          beatIndex:   3,
          label:       "come out",
          text:        "\"Come out. I know you're in there.\"",
          tension:     94,
          silenceAfter: 400,
          atmosphere:  "voice_threat",
          proximity:   "ear",
          events:      ["sfx:voice_threat", "timer:start"],
        },
      ],
    },

    // ─── Chapter 2: The Choice ──────────────────────────────────────────────
    // The moment of decision. Everything narrows.
    2: {
      label:    "the choice",
      beats: [
        {
          id:          "ch2_gun_revealed",
          beatIndex:   0,
          label:       "gun revealed",
          text:        "You find the gun your husband left. Cold. Heavy.",
          tension:     88,
          silenceAfter: 700,
          atmosphere:  "tension_static",
          proximity:   "ear",
          events:      ["sfx:gun_click", "heartbeat:peak"],
        },
        {
          id:          "ch2_daughter_cry",
          beatIndex:   1,
          label:       "daughter cries",
          text:        "Your daughter cries out from her room. She heard.",
          tension:     95,
          silenceAfter: 500,
          atmosphere:  "child_cry",
          proximity:   "close",
          events:      ["sfx:child_cry", "atmosphere:heighten"],
        },
        {
          id:          "ch2_last_chance",
          beatIndex:   2,
          label:       "last chance",
          text:        "\"Last chance.\" The handle is turning.",
          tension:     98,
          silenceAfter: 300,
          silenceType: "anticipation",
          atmosphere:  "silence_before_storm",
          proximity:   "ear",
          events:      ["sfx:door_handle", "timer:final_seconds"],
        },
        {
          id:          "ch2_handle_turns",
          beatIndex:   3,
          label:       "handle turns",
          text:        "The door opens.",
          tension:     100,
          silenceAfter: 200,
          silenceType: "fear",
          atmosphere:  "climax",
          proximity:   "ear",
          events:      ["sfx:door_open", "atmosphere:peak", "timer:expire"],
        },
        {
          id:          "ch2_the_choice",
          beatIndex:   4,
          label:       "the choice",
          text:        "You choose.",
          tension:     100,
          silenceAfter: 1500,
          silenceType: "anticipation",
          atmosphere:  "choice_silence",
          proximity:   "ear",
          events:      ["choice:present", "heartbeat:stop"],
        },
      ],
    },

    // ─── Chapter 3: The Weight ──────────────────────────────────────────────
    // Whatever happened, you carry it now.
    3: {
      label:    "the weight",
      beats: [
        {
          id:          "ch3_aftermath",
          beatIndex:   0,
          label:       "aftermath",
          text:        "The house is quiet again. A different quiet.",
          tension:     42,
          silenceAfter: 1500,
          silenceType: "grief",
          atmosphere:  "aftermath_silence",
          proximity:   "far",
          events:      ["heartbeat:slow_fade", "atmosphere:empty"],
        },
        {
          id:          "ch3_sirens",
          beatIndex:   1,
          label:       "sirens",
          text:        "Sirens. Distant. Someone called.",
          tension:     36,
          silenceAfter: 1200,
          atmosphere:  "siren_distant",
          proximity:   "far",
          events:      ["sfx:sirens", "atmosphere:dissolve"],
        },
        {
          id:          "ch3_james_speaks",
          beatIndex:   2,
          label:       "james speaks",
          text:        "Your son says your name. Just your name.",
          tension:     32,
          silenceAfter: 2000,
          silenceType: "grief",
          atmosphere:  "quiet_grief",
          proximity:   "room",
          events:      ["sfx:child_voice_soft", "atmosphere:still"],
        },
        {
          id:          "ch3_the_weight",
          beatIndex:   3,
          label:       "the weight",
          text:        "Some things you carry. Some things carry you.",
          tension:     30,
          silenceAfter: 3000,
          silenceType: "grief",
          atmosphere:  "resolve_drone",
          proximity:   "far",
          events:      ["atmosphere:final_fade", "heartbeat:gone", "engine:reset_pending"],
        },
      ],
    },

  },
};

/** Convenience — get all beats for a chapter flat array */
export function getChapterBeats(storyId, chapterId) {
  return BEAT_MANIFEST[storyId]?.[chapterId]?.beats ?? [];
}

/** Total beat count across all chapters for a story */
export function getTotalBeats(storyId) {
  const story = BEAT_MANIFEST[storyId];
  if (!story) return 0;
  return Object.values(story).reduce((sum, ch) => sum + (ch.beats?.length ?? 0), 0);
}
