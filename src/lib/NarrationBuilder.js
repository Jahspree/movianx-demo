import { validateNarrationOutput } from "./SecurityLayer.js";

const FORBIDDEN_PATTERNS = [
  /\byou feel\b/i,
  /\bthe scene\b/i,
  /\bemotion\b/i,
  /\bambience\b/i,
  /\bmusic\b/i,
  /\bscene metadata\b/i,
  /\bsystem label\b/i,
];

const SYSTEM_TOKEN_PATTERN = /\[(?:.*?)]|\((?:breathing|whispering|hesitant|pause|softly|emotion|ambience|music|scene)[^)]*\)/gi;

function normalizeText(text = "") {
  return String(text || "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .replace(SYSTEM_TOKEN_PATTERN, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text = "") {
  return normalizeText(text).match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(sentence => sentence.trim()).filter(Boolean) || [];
}

function containsForbiddenText(text = "") {
  return FORBIDDEN_PATTERNS.some(pattern => pattern.test(text));
}

function hardFilter(text = "") {
  return splitSentences(text)
    .filter(sentence => !containsForbiddenText(sentence))
    .join(" ")
    .replace(/\s+([,.!?])/g, "$1")
    .replace(/\.{3,}/g, "...")
    .replace(/\s+/g, " ")
    .trim();
}

function profileEmotion(sceneProfile = {}) {
  const value = String(sceneProfile.emotionLabel || sceneProfile.emotion || sceneProfile.mood || "").toLowerCase();
  if (value.includes("sad") || value.includes("grief")) return "sadness";
  if (value.includes("joy") || value.includes("warm") || value.includes("relief")) return "joy";
  if (value.includes("anger") || value.includes("rage")) return "anger";
  if (value.includes("suspense") || value.includes("dread")) return "suspense";
  if (value.includes("fear") || value.includes("terror") || value.includes("panic") || value.includes("horror")) return "fear";
  return "neutral";
}

function hasAny(source, words) {
  return words.some(word => source.includes(word));
}

function sceneCues(sceneText = "") {
  const source = normalizeText(sceneText).toLowerCase();
  return {
    glass: hasAny(source, ["glass", "window", "shatter", "break"]),
    footsteps: hasAny(source, ["footstep", "steps", "stairs", "walking", "landing"]),
    door: hasAny(source, ["door", "handle", "knob", "lock"]),
    whisper: hasAny(source, ["whisper", "voice", "said", "listen"]),
    silence: hasAny(source, ["silence", "quiet", "still", "stopped"]),
    threat: hasAny(source, ["gun", "knife", "intruder", "kill", "hurt", "blood", "attack"]),
    loss: hasAny(source, ["lost", "gone", "farewell", "alone", "scar", "crying", "tears", "grief"]),
    warmth: hasAny(source, ["love", "smile", "warm", "relief", "home", "together"]),
    movement: hasAny(source, ["run", "rush", "escape", "move", "grab", "hide"]),
  };
}

function dedupe(lines = []) {
  const seen = new Set();
  return lines.filter(line => {
    const key = line.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function enforceHesitationLimit(lines = []) {
  let hesitationCount = 0;
  return lines.map((line, index) => {
    const hasHesitation = line.includes("...");
    if (!hasHesitation) return line;
    const windowStart = Math.max(0, index - 1);
    const recent = lines.slice(windowStart, index).filter(previous => previous.includes("...")).length;
    if (recent >= 1 || hesitationCount > Math.floor(index / 2)) {
      return line.replace(/^\.\.\.\s*/, "").replace(/\s*\.\.\.\s*/g, " ");
    }
    hesitationCount += 1;
    return line;
  });
}

function selectFearLines(cues, intensity) {
  const lines = [];
  if (cues.silence) lines.push("...it's too quiet.");
  if (cues.glass) lines.push("Did you hear that?");
  if (cues.footsteps) lines.push("Don't move.");
  if (cues.door) lines.push("The door. Stay back.");
  if (cues.threat) lines.push("Stay close to me.");
  if (!lines.length) lines.push("...something's not right.", "Listen.");
  if (intensity >= 3 && cues.movement) lines.push("Now. We have to move.");
  return lines;
}

function selectSuspenseLines(cues) {
  const lines = [];
  if (cues.whisper || cues.silence) lines.push("Wait. Listen.");
  if (cues.footsteps) lines.push("That came from behind us.");
  if (cues.door) lines.push("The door moved.");
  if (!lines.length) lines.push("Something changed.", "Stay with me.");
  return lines;
}

function selectSadLines(cues) {
  if (cues.loss) {
    return ["I know.", "I don't know how to make this easier, but I'm still here with you."];
  }
  return ["Just breathe for a second.", "We can take the next part slowly."];
}

function selectJoyLines(cues) {
  if (cues.warmth) return ["There it is.", "Hold onto that for a second."];
  return ["Okay.", "This part feels lighter."];
}

function selectAngerLines(cues) {
  if (cues.threat) return ["No.", "They don't get to do this again."];
  return ["No.", "I'm not letting that stand."];
}

function selectNeutralLines(cues) {
  if (cues.whisper || cues.silence) return ["Listen.", "Something shifted."];
  return ["Stay close.", "Let's keep going."];
}

function styleLines(lines, emotion, intensity) {
  let next = dedupe(lines).slice(0, intensity >= 3 ? 4 : 3);
  if (emotion === "sadness") {
    next = next.map(line => line.replace(/\s+/g, " ").trim());
  } else if (emotion === "fear" || emotion === "suspense") {
    next = next.map(line => {
      const trimmed = line.trim();
      if (trimmed.length <= 42) return trimmed;
      return trimmed.split(/,\s+|\s+but\s+/i)[0].trim() + ".";
    });
  }
  return enforceHesitationLimit(next);
}

export function buildNarration(sceneText, sceneProfile = {}) {
  const emotion = profileEmotion(sceneProfile);
  const intensity = Math.max(1, Math.min(3, Math.round(Number(sceneProfile.intensity || sceneProfile.intensityLevel || 1))));
  const cues = sceneCues(sceneText);
  let lines;

  if (emotion === "fear") lines = selectFearLines(cues, intensity);
  else if (emotion === "sadness") lines = selectSadLines(cues);
  else if (emotion === "joy") lines = selectJoyLines(cues);
  else if (emotion === "anger") lines = selectAngerLines(cues);
  else if (emotion === "suspense") lines = selectSuspenseLines(cues);
  else lines = selectNeutralLines(cues);

  const spokenText = hardFilter(styleLines(lines, emotion, intensity).join(" "));
  const output = { spokenText };
  if (!validateNarrationOutput(output)) {
    throw new Error("Invalid narration output schema");
  }
  return output;
}

export default buildNarration;
