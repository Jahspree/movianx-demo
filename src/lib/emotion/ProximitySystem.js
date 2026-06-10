// ===========================================================================
// ProximitySystem — manages Sarah's acoustic position in 3D space
//
// Sarah is not a fixed sound source. Her position changes as the story
// escalates. The BreathingSystem queries here for spatial coordinates.
// Position changes are published to SpatialReactionBus.
//
// Named positions:
//   next_to      — beside the listener, intimate threat (ear)
//   across_room  — other side of the room, still present (close)
//   down_hallway — down the corridor, distant (room)
//   behind       — behind the listener, unnerving (far)
//
// Beat proximity strings map to named positions:
//   "ear"   → next_to
//   "close" → across_room
//   "room"  → down_hallway
//   "far"   → behind
//
// Usage:
//   proximitySystem.setPosition("across_room");
//   proximitySystem.fromBeat(beat);           // reads beat.proximity
//   const coords = proximitySystem.getCoords(); // current {x,y,z}
// ===========================================================================

import { spatialReactionBus } from "./SpatialReactionBus.js";

export const POSITIONS = Object.freeze({
  next_to:     { x:  0.08, y: 0,    z: -0.12 },   // ear — intimate
  across_room: { x: -1.20, y: 0,    z: -2.80 },   // close — present
  down_hallway:{ x:  0.30, y: 0,    z: -6.50 },   // room — distant threat
  behind:      { x:  0.00, y: 0.15, z:  2.20 },   // far — behind listener
});

const PROXIMITY_MAP = {
  ear:   "next_to",
  close: "across_room",
  room:  "down_hallway",
  far:   "behind",
};

class ProximitySystem {
  #current     = "down_hallway";  // start distant — listener doesn't know she's there
  #previous    = null;

  /** Set a named position immediately. Publishes change to SpatialReactionBus. */
  setPosition(name) {
    if (!POSITIONS[name] || name === this.#current) return;
    this.#previous = this.#current;
    this.#current  = name;
    spatialReactionBus.emit("position", {
      label:    name,
      previous: this.#previous,
      coords:   POSITIONS[name],
    });
  }

  /** Map beat.proximity string to a named position and set it. */
  fromBeat(beat) {
    if (!beat?.proximity) return;
    const name = PROXIMITY_MAP[beat.proximity];
    if (name) this.setPosition(name);
  }

  /** Return current 3D coordinates (suitable for playSpatial position arg). */
  getCoords() {
    return { ...POSITIONS[this.#current] };
  }

  /** Return coords for a named position without changing current. */
  getCoordsFor(name) {
    return POSITIONS[name] ? { ...POSITIONS[name] } : null;
  }

  getCurrentName() { return this.#current; }
  getPreviousName() { return this.#previous; }

  reset() {
    this.#current  = "down_hallway";
    this.#previous = null;
  }
}

export const proximitySystem = new ProximitySystem();

if (typeof globalThis !== "undefined") {
  globalThis.__proximitySystem = proximitySystem;
}
