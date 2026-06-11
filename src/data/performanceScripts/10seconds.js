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
      textWithDirections: "<<whispering>> Hey. Wake up.",
      stability:   0.48,
      style:       0.52,
      speed:       0.86,
      similarity_boost: 0.88,
      silenceAfter: 1200,
      emotionalDirection: "Sarah waking her partner in the dark. Urgent but quiet — not wanting to make noise. The whisper is close, intimate. No threat yet. Just two people in the same bed.",
      previousText: null,
      nextText: "Did you hear that? No. Listen. That wasn't nothing.",
    },
    {
      beatId:    "ch0_first_creak",
      beatIndex: 1,
      textWithDirections: "<<whispering>> Did you hear that?... No. Listen. That wasn't nothing.",
      stability:   0.42,
      style:       0.65,
      speed:       0.86,
      similarity_boost: 0.86,
      silenceAfter: 900,
      emotionalDirection: "First real fear. The question is almost hopeful — maybe she imagined it. Then 'No. Listen.' cuts it. She heard it. 'That wasn't nothing' is the moment she stops pretending.",
      previousText: "Hey. Wake up.",
      nextText: "Someone's in the house. I heard glass downstairs. They're inside.",
    },
    {
      beatId:    "ch0_glass_breaks",
      beatIndex: 2,
      textWithDirections: "<<breathless>> Someone's in the house— I heard glass downstairs. They're inside.",
      stability:   0.42,
      style:       0.86,
      speed:       0.88,
      similarity_boost: 0.82,
      silenceAfter: 600,
      emotionalDirection: "Gasp before the first word — she just confirmed it in her mind. Short direct sentences, no room for more. 'They're inside' lands like a door closing on every safe thing.",
      previousText: "Did you hear that? No. Listen. That wasn't nothing.",
      nextText: "I can hear them moving. More than one. The bat's in the closet. My phone's dead. The kids are down the hall.",
    },
    {
      beatId:    "ch0_realization",
      beatIndex: 3,
      textWithDirections: "<<whispering>> I can hear them moving... More than one. The bat's in the closet— My phone's dead— The kids are down the hall.",
      stability:   0.48,
      style:       0.85,
      speed:       0.92,
      similarity_boost: 0.78,
      silenceAfter: 800,
      emotionalDirection: "Cold inventory under terror. 'More than one' is the blow. Then she's already planning — bat, phone, kids. Each item is a resource check against impossibility. Voice barely holds.",
      previousText: "Someone's in the house. I heard glass downstairs. They're inside.",
      nextText: "What do we do?",
    },
    {
      beatId:    "ch0_timer_warning",
      beatIndex: 4,
      textWithDirections: "<<panicked>> What do we do?",
      stability:   0.40,
      style:       0.94,
      speed:       1.00,
      similarity_boost: 0.80,
      silenceAfter: 400,
      emotionalDirection: "Three words. Everything stripped away. Not a question with an answer — a person at the edge of what they can process alone. Deliver it like the voice breaks on the last word.",
      previousText: "I can hear them moving. More than one. The bat's in the closet. My phone's dead. The kids are down the hall.",
      nextText: null,
    },
  ],

  // ─── Chapter 1: The Threat Advances ───────────────────────────────────────
  ch1: [
    {
      beatId:    "ch1_ransacking",
      beatIndex: 0,
      textWithDirections: "<<whispering>> They're coming up. The stairs... I can hear them.",
      stability:   0.40,
      style:       0.80,
      speed:       0.88,
      similarity_boost: 0.82,
      silenceAfter: 700,
      emotionalDirection: "She's already tracking their movement. 'The stairs' — a beat pause, a confirmation. 'I can hear them' is proof she's not imagining it. Each fragment arrives like a new impact.",
      previousText: null,
      nextText: "One step. Two. Three. They stopped. No. They're moving again.",
    },
    {
      beatId:    "ch1_upstairs",
      beatIndex: 1,
      textWithDirections: "<<panicked>> One step. Two. Three— They stopped... No. They're moving again.",
      stability:   0.42,
      style:       0.95,
      speed:       1.02,
      similarity_boost: 0.72,
      silenceAfter: 600,
      emotionalDirection: "She's counting their footsteps. Each number is a step closer. 'They stopped' — the false hope. Whispered because maybe silence means safety. Then 'No.' shatters it. Voice breaks slightly on 'moving again.'",
      previousText: "They're coming up. The stairs. I can hear them.",
      nextText: "The kids are right there. Three doors down. He said something. He knows we're here.",
    },
    {
      beatId:    "ch1_landing",
      beatIndex: 2,
      textWithDirections: "<<whispering>> The kids are right there. Three doors down— He said something. He knows we're here.",
      stability:   0.40,
      style:       0.94,
      speed:       0.78,
      similarity_boost: 0.78,
      silenceAfter: 500,
      emotionalDirection: "The children are the only thing that matters. 'Three doors down' is the exact distance between safe and gone. Then — he spoke. He knows. Voice nearly disappears on the last four words.",
      previousText: "One step. Two. Three. They stopped. No. They're moving again.",
      nextText: "He's on the landing now. Same floor. Same air. I can't think. What do we do? Please.",
    },
    {
      beatId:    "ch1_come_out",
      beatIndex: 3,
      textWithDirections: "<<whispering>> He's on the landing now. Same floor. Same air... I can't think. What do we do? Please.",
      stability:   0.48,
      style:       0.90,
      speed:       0.88,
      similarity_boost: 0.75,
      silenceAfter: 400,
      emotionalDirection: "The most intimate line in chapter 1. 'Same air' — she can feel his presence through the door. 'I can't think' is the first admission of failure. The 'Please' is the most vulnerable word in the story. She's begging her partner to have an answer she doesn't.",
      previousText: "The kids are right there. Three doors down. He said something. He knows we're here.",
      nextText: null,
    },
  ],

  // ─── Chapter 2: The Choice ─────────────────────────────────────────────────
  ch2: [
    {
      beatId:    "ch2_gun_revealed",
      beatIndex: 0,
      textWithDirections: "<<breathless>> He has a gun. I can see it.",
      stability:   0.40,
      style:       0.90,
      speed:       0.88,
      similarity_boost: 0.80,
      silenceAfter: 700,
      emotionalDirection: "She sees it before she can process it. Two short sentences — no elaboration possible. 'I can see it' makes it irrefutably real. Voice barely carries the words.",
      previousText: null,
      nextText: "Our baby is crying. She can hear us.",
    },
    {
      beatId:    "ch2_daughter_cry",
      beatIndex: 1,
      textWithDirections: "<<panicked>> Our baby is crying. She can hear us.",
      stability:   0.40,
      style:       0.96,
      speed:       0.92,
      similarity_boost: 0.76,
      silenceAfter: 500,
      emotionalDirection: "The child becomes real in this line. 'Our baby' — not 'the baby.' Both parents' child. 'She can hear us' means she can hear them too. Voice cracks on 'hear us.' This is a mother who knows what her child is about to witness.",
      previousText: "He has a gun. I can see it.",
      nextText: "He said last chance. Whatever happens, protect the kids. Promise me. Promise me.",
    },
    {
      beatId:    "ch2_last_chance",
      beatIndex: 2,
      textWithDirections: "<<panicked>> He said last chance. Whatever happens, protect the kids— Promise me. Promise me.",
      stability:   0.42,
      style:       0.96,
      speed:       0.94,
      similarity_boost: 0.74,
      silenceAfter: 300,
      emotionalDirection: "She's making a pact with her partner right now. 'Whatever happens' acknowledges she may not survive. 'Promise me. Promise me.' — the repetition is not emphasis, it is desperation. She needs to hear it twice. Voice breaks on the second 'Promise me.'",
      previousText: "Our baby is crying. She can hear us.",
      nextText: "The handle is turning. Right now.",
    },
    {
      beatId:    "ch2_handle_turns",
      beatIndex: 3,
      textWithDirections: "<<whispering>> The handle is turning... Right now.",
      stability:   0.42,
      style:       1.00,
      speed:       0.78,
      similarity_boost: 0.72,
      silenceAfter: 200,
      emotionalDirection: "Present tense. Happening as she speaks. 'Right now' adds nothing — she says it because she can't believe it. Voice is barely air.",
      previousText: "He said last chance. Whatever happens, protect the kids. Promise me. Promise me.",
      nextText: "Tell me. Please. I can't do this alone.",
    },
    {
      beatId:    "ch2_the_choice",
      beatIndex: 4,
      textWithDirections: "<<crying>> Tell me... Please. I can't do this alone.",
      stability:   0.42,
      style:       0.92,
      speed:       0.80,
      similarity_boost: 0.80,
      silenceAfter: 1500,
      emotionalDirection: "The most exposed line in the story. 'Tell me' — she needs her partner to decide. 'Please' is a single word that holds everything. 'I can't do this alone' is the only honest thing left. The crying tag is not weeping — it is the sound of someone who has reached the absolute edge.",
      previousText: "The handle is turning. Right now.",
      nextText: null,
    },
  ],

  // ─── Chapter 3: The Weight ────────────────────────────────────────────────
  ch3: [
    {
      beatId:    "ch3_aftermath",
      beatIndex: 0,
      textWithDirections: "<<crying>> It's done. There was no right answer. There never was.",
      stability:   0.68,
      style:       0.18,
      speed:       0.84,
      similarity_boost: 0.90,
      silenceAfter: 1500,
      emotionalDirection: "The first word is exhaustion. 'It's done' — not relief, not victory. Then the quiet grief of a person who realizes the weight they're about to carry. 'There never was' is the cruelest truth — she couldn't have done better. Crying tag is contained, not explosive.",
      previousText: null,
      nextText: "I keep hearing it. Over and over. The sound. The choices. The ten seconds.",
    },
    {
      beatId:    "ch3_sirens",
      beatIndex: 1,
      textWithDirections: "I keep hearing it. Over and over. The sound. The choices. The ten seconds.",
      stability:   0.72,
      style:       0.12,
      speed:       0.82,
      similarity_boost: 0.90,
      silenceAfter: 1200,
      emotionalDirection: "Dissociated repetition — she is still inside the event. 'The sound' is the worst word — she won't name what she heard. 'The choices' acknowledges she made one. 'The ten seconds' names the thing the whole story was. Deliver it flat, like someone who has been saying it to themselves for hours.",
      previousText: "It's done. There was no right answer. There never was.",
      nextText: "What did we become?",
    },
    {
      beatId:    "ch3_james_speaks",
      beatIndex: 2,
      textWithDirections: "<<whispering>> What did we become?",
      stability:   0.48,
      style:       0.65,
      speed:       0.76,
      similarity_boost: 0.82,
      silenceAfter: 2000,
      emotionalDirection: "She's asking her partner. Or herself. Or both. Not rhetorical — she genuinely doesn't know who they are after this. The crying here is quiet and contained. Let the silence after breathe.",
      previousText: "I keep hearing it. Over and over. The sound. The choices. The ten seconds.",
      nextText: "What did we become... in ten seconds?",
    },
    {
      beatId:    "ch3_the_weight",
      beatIndex: 3,
      textWithDirections: "<<crying>> What did we become... in ten seconds?",
      stability:   0.58,
      style:       0.20,
      speed:       0.74,
      similarity_boost: 0.88,
      silenceAfter: 3000,
      emotionalDirection: "The final question that has no answer. The pause before 'in ten seconds' is the weight of the full story landing. The same question as the previous beat, but now with time attached — the horror of how fast a person can change. The 3-second silence after is the story's last breath.",
      previousText: "What did we become?",
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
