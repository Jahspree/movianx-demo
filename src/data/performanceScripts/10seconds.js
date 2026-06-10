// ===========================================================================
// Performance Script — 10 Seconds (storyId = 3)
//
// 18 beats, hand-authored. Every beat is a separate voice performance.
//
// textWithDirections: the text sent to ElevenLabs eleven_v3.
//   Acting tags: <<whispering>> <<gasping>> <<breathless>> <<panicked>> <<crying>>
//   Pacing:      ... (extended pause)   — (cut/interruption)   fragmented sentences
//
// stability:    0 = maximum emotional variation, 1 = flat/monotone
// style:        0 = neutral delivery,            1 = maximum drama
// speed:        0.7 = very slow,  1.0 = normal,  1.15 = urgent/clipped
// similarity_boost: voice identity fidelity — lower for extreme moments
//
// previousText / nextText: for contextual prosody on eleven_multilingual_v2.
//   NOTE: eleven_v3 does NOT support previous_text/next_text (returns 400).
//         These fields are for reference and fallback generation only.
//
// emotionalDirection: human-readable description of the intended performance.
//   Not sent to ElevenLabs — used as internal documentation.
// ===========================================================================

export const PERFORMANCE_SCRIPT = {

  // ─── Chapter 0: The Quiet Before ──────────────────────────────────────────
  ch0: [
    {
      beatId:    "ch0_sleeping",
      beatIndex: 0,
      textWithDirections: "A family asleep. The house is still.",
      stability:   0.78,
      style:       0.08,
      speed:       0.93,
      similarity_boost: 0.88,
      silenceAfter: 1200,
      emotionalDirection: "Warm, quiet, almost tender. The narrator is a presence watching over a safe house. No threat yet. Voice settles like the house itself.",
      previousText: null,
      nextText: "A sound downstairs. You freeze.",
    },
    {
      beatId:    "ch0_first_creak",
      beatIndex: 1,
      textWithDirections: "A sound... downstairs. <<whispering>> You freeze.",
      stability:   0.38,
      style:       0.58,
      speed:       0.88,
      similarity_boost: 0.86,
      silenceAfter: 900,
      emotionalDirection: "The warmth cuts. Voice drops mid-sentence. 'Downstairs' lands like something falling. Then — a whisper. Not panic. Stillness. The freeze is physical.",
      previousText: "A family asleep. The house is still.",
      nextText: "Glass. Downstairs. Someone is inside.",
    },
    {
      beatId:    "ch0_glass_breaks",
      beatIndex: 2,
      textWithDirections: "<<gasping>> Glass. Downstairs. <<breathless>> Someone... is inside.",
      stability:   0.14,
      style:       0.86,
      speed:       0.84,
      similarity_boost: 0.82,
      silenceAfter: 600,
      emotionalDirection: "A gasp catches the breath before the first word. Three words, three blows. Then the breath gives out. 'Someone... is inside' almost collapses. The ellipsis is a physical stop — she cannot say it in one breath.",
      previousText: "A sound... downstairs. You freeze.",
      nextText: "Your children are in their rooms. You are between them and the stairs.",
    },
    {
      beatId:    "ch0_realization",
      beatIndex: 3,
      textWithDirections: "<<whispering>> Your children are in their rooms. You are between them... and the stairs.",
      stability:   0.18,
      style:       0.80,
      speed:       0.86,
      similarity_boost: 0.84,
      silenceAfter: 800,
      emotionalDirection: "Horrified calculation. Not panic — worse. The terrible clarity of a parent who understands exactly what the geometry means. The pause before 'and the stairs' is a moment of reckoning. Voice stays low, barely above a breath.",
      previousText: "Glass. Downstairs. Someone is inside.",
      nextText: "Ten seconds. That is all you have.",
    },
    {
      beatId:    "ch0_timer_warning",
      beatIndex: 4,
      textWithDirections: "<<breathless>> Ten seconds. That is all you have.",
      stability:   0.12,
      style:       0.90,
      speed:       1.04,
      similarity_boost: 0.80,
      silenceAfter: 400,
      emotionalDirection: "The countdown starts. Breathless — not from running, from holding terror in. Each word lands like a fist. The urgency pushes the speed forward. This is not a warning. It is a command.",
      previousText: "Your children are in their rooms. You are between them and the stairs.",
      nextText: null,
    },
  ],

  // ─── Chapter 1: The Threat Advances ───────────────────────────────────────
  ch1: [
    {
      beatId:    "ch1_ransacking",
      beatIndex: 0,
      textWithDirections: "<<whispering>> Drawers. Cabinets. They are... searching.",
      stability:   0.20,
      style:       0.80,
      speed:       0.90,
      similarity_boost: 0.82,
      silenceAfter: 700,
      emotionalDirection: "Clipped. Fragments. Each word is a sound heard through the floor. The pause before 'searching' is realizing what it means — they are looking for something, or someone. Voice barely makes it through.",
      previousText: null,
      nextText: "Footsteps on the stairs. Slow. Deliberate.",
    },
    {
      beatId:    "ch1_upstairs",
      beatIndex: 1,
      textWithDirections: "<<breathless>> Footsteps... on the stairs. Slow. <<whispering>> Deliberate.",
      stability:   0.12,
      style:       0.90,
      speed:       0.80,
      similarity_boost: 0.80,
      silenceAfter: 600,
      emotionalDirection: "The worst word in this beat is 'deliberate.' They are not rushing. They know they own this. Voice slows to match the footsteps. Breathless at the start — she already stopped breathing. The whisper on 'deliberate' is delivered like she is hearing it for the first time.",
      previousText: "Drawers. Cabinets. They are searching.",
      nextText: "They are on the landing. Inches from your door.",
    },
    {
      beatId:    "ch1_landing",
      beatIndex: 2,
      textWithDirections: "<<whispering>> They are on the landing. <<breathless>> Inches... from your door.",
      stability:   0.08,
      style:       0.94,
      speed:       0.76,
      similarity_boost: 0.78,
      silenceAfter: 500,
      emotionalDirection: "The landing is the same floor. Same air. Voice nearly disappears. 'Inches... from your door' — the breath fails before the sentence ends. The ellipsis is not punctuation. It is a body freezing.",
      previousText: "Footsteps on the stairs. Slow. Deliberate.",
      nextText: "\"Come out. I know you're in there.\"",
    },
    {
      beatId:    "ch1_come_out",
      beatIndex: 3,
      textWithDirections: "<<whispering>> \"Come out. I know you're in there.\"",
      stability:   0.10,
      style:       0.92,
      speed:       0.88,
      similarity_boost: 0.80,
      silenceAfter: 400,
      emotionalDirection: "Sarah is repeating what she just heard through the door. She whispers it in disbelief — the voice of the intruder filtered through her terror. The tone is not confrontational. It is a woman hearing her nightmare confirmed. Deliver it like repeating something that cannot be real.",
      previousText: "They are on the landing. Inches from your door.",
      nextText: null,
    },
  ],

  // ─── Chapter 2: The Choice ─────────────────────────────────────────────────
  ch2: [
    {
      beatId:    "ch2_gun_revealed",
      beatIndex: 0,
      textWithDirections: "<<breathless>> You find the gun your husband left. Cold. <<whispering>> Heavy.",
      stability:   0.14,
      style:       0.86,
      speed:       0.86,
      similarity_boost: 0.82,
      silenceAfter: 700,
      emotionalDirection: "The gun changes everything and nothing. 'Cold' and 'Heavy' are single words because nothing larger will form. Voice is breathless from fear, then drops to a whisper on 'Heavy' — as if the weight of what she is holding just arrived.",
      previousText: null,
      nextText: "Your daughter cries out from her room. She heard.",
    },
    {
      beatId:    "ch2_daughter_cry",
      beatIndex: 1,
      textWithDirections: "<<panicked>> Your daughter cries out from her room. She... heard.",
      stability:   0.06,
      style:       0.96,
      speed:       0.92,
      similarity_boost: 0.76,
      silenceAfter: 500,
      emotionalDirection: "Panic breaks the surface here for the first time. The child's cry breaks something in Sarah. 'She... heard.' — the pause is the moment she processes what her child is about to experience. Voice cracks on 'heard.' This is not description. This is a mother breaking.",
      previousText: "You find the gun your husband left. Cold. Heavy.",
      nextText: "\"Last chance.\" The handle is turning.",
    },
    {
      beatId:    "ch2_last_chance",
      beatIndex: 2,
      textWithDirections: "\"Last chance.\" <<panicked>> The handle is turning.",
      stability:   0.05,
      style:       0.96,
      speed:       1.00,
      similarity_boost: 0.74,
      silenceAfter: 300,
      emotionalDirection: "Two sentences, two different registers. 'Last chance' is the intruder's words — delivered flat, because that is how they sounded. Then panic: 'The handle is turning' — present tense, happening now, no past tense safety. The pace is faster here because time is collapsing.",
      previousText: "Your daughter cries out from her room. She heard.",
      nextText: "The door opens.",
    },
    {
      beatId:    "ch2_handle_turns",
      beatIndex: 3,
      textWithDirections: "<<breathless>> The door... opens.",
      stability:   0.06,
      style:       0.95,
      speed:       0.78,
      similarity_boost: 0.76,
      silenceAfter: 200,
      emotionalDirection: "Three words. The world ending. The pause in 'The door... opens' is not hesitation — it is the door itself. Voice is barely there. Breathless past the point of breathing. Deliver this like the last sound before something irreversible.",
      previousText: "\"Last chance.\" The handle is turning.",
      nextText: "You choose.",
    },
    {
      beatId:    "ch2_the_choice",
      beatIndex: 4,
      textWithDirections: "<<whispering>> You choose.",
      stability:   0.14,
      style:       0.85,
      speed:       0.76,
      similarity_boost: 0.82,
      silenceAfter: 1500,
      emotionalDirection: "Two words. Past panic. This is the suspended moment just before action — almost calm in the way that the eye of a storm is calm. Deliver it like a held breath at maximum capacity. The weight of 'You choose' is not in the words. It is in everything the listener knows comes next.",
      previousText: "The door opens.",
      nextText: null,
    },
  ],

  // ─── Chapter 3: The Weight ────────────────────────────────────────────────
  ch3: [
    {
      beatId:    "ch3_aftermath",
      beatIndex: 0,
      textWithDirections: "The house is quiet again. <<crying>> A different quiet.",
      stability:   0.76,
      style:       0.14,
      speed:       0.86,
      similarity_boost: 0.90,
      silenceAfter: 1500,
      emotionalDirection: "The grief is in the distinction: not the same quiet as the beginning. The first sentence is flat, stated. Then '<<crying>> A different quiet' — the emotion surfaces quietly, not explosively. Think of someone describing something terrible in a calm voice because they no longer have the energy to cry.",
      previousText: null,
      nextText: "Sirens. Distant. Someone called.",
    },
    {
      beatId:    "ch3_sirens",
      beatIndex: 1,
      textWithDirections: "Sirens. Distant. Someone called.",
      stability:   0.72,
      style:       0.12,
      speed:       0.84,
      similarity_boost: 0.90,
      silenceAfter: 1200,
      emotionalDirection: "Dissociated. She hears the sirens like they are on another planet. Three fragments, each one more removed from reality. 'Someone called' — she does not know who. She barely remembers calling herself. Deliver this completely flat, almost mechanical. The absence of emotion IS the emotion.",
      previousText: "The house is quiet again. A different quiet.",
      nextText: "Your son says your name. Just your name.",
    },
    {
      beatId:    "ch3_james_speaks",
      beatIndex: 2,
      textWithDirections: "Your son says your name. <<crying>> Just your name.",
      stability:   0.62,
      style:       0.18,
      speed:       0.80,
      similarity_boost: 0.88,
      silenceAfter: 2000,
      emotionalDirection: "This is the most tender moment in the story. A child calling for a parent. '<<crying>> Just your name' — not asking for anything. Not accusing. Just naming her. The crying here is not sobbing — it is the quiet, contained grief of realizing what her son just witnessed. Let the silence after this beat breathe.",
      previousText: "Sirens. Distant. Someone called.",
      nextText: "Some things you carry. Some things carry you.",
    },
    {
      beatId:    "ch3_the_weight",
      beatIndex: 3,
      textWithDirections: "<<crying>> Some things you carry. Some things... carry you.",
      stability:   0.58,
      style:       0.20,
      speed:       0.76,
      similarity_boost: 0.88,
      silenceAfter: 3000,
      emotionalDirection: "The final line. The pause before 'carry you' is the moment she understands which one this is. Deliver the first half with effort — active, carrying. The second half gives way. '...carry you' is quieter, slower, as if the sentence itself is being borne by something heavier than words. The 3-second silence after is the story's final breath.",
      previousText: "Your son says your name. Just your name.",
      nextText: null,
    },
  ],
};

// Flat array for iteration by beatId
export const ALL_BEATS = [
  ...PERFORMANCE_SCRIPT.ch0,
  ...PERFORMANCE_SCRIPT.ch1,
  ...PERFORMANCE_SCRIPT.ch2,
  ...PERFORMANCE_SCRIPT.ch3,
];

// Lookup by beatId
export const BEAT_BY_ID = Object.fromEntries(ALL_BEATS.map(b => [b.beatId, b]));

// Output filename for each beat
export function beatAudioFile(chapterIdx, beatIndex) {
  return `ch${chapterIdx}_beat${beatIndex}.mp3`;
}
