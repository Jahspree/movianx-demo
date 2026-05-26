import test from "node:test";
import assert from "node:assert/strict";
import {
  monitorEcosystemHealth,
  orchestrateEcosystemRails,
  scoreContentEmotion,
} from "../src/lib/ecosystemGovernance.js";

const experiences = [
  {
    id: "fear-1",
    title: "Fear One",
    creator: "Creator A",
    genre: "Horror",
    moodTags: ["fear", "pressure"],
    styleTags: ["survival cinema"],
    discoveryTags: ["After Midnight"],
    factoryIngested: true,
  },
  {
    id: "fear-2",
    title: "Fear Two",
    creator: "Creator A",
    genre: "Thriller",
    moodTags: ["dread"],
    styleTags: ["psychological horror"],
    discoveryTags: ["After Midnight"],
  },
  {
    id: "calm-1",
    title: "Calm One",
    creator: "Creator B",
    genre: "Music",
    moodTags: ["wonder", "calm"],
    styleTags: ["spatial audio"],
    discoveryTags: ["Immersive Soundscapes"],
  },
  {
    id: "rare-1",
    title: "Rare One",
    creator: "Creator C",
    genre: "Drama",
    moodTags: ["memory"],
    styleTags: ["arthouse", "auteur"],
    discoveryTags: ["Atmospheric Worlds"],
    contentFormat: "creator_spotlight",
  },
];

test("emotional scoring captures intensity, pacing, and rarity deterministically", () => {
  const score = scoreContentEmotion(experiences[0]);
  const rareScore = scoreContentEmotion(experiences[3]);

  assert.equal(score.intensity, 3);
  assert.equal(score.pacingCategory, "high tension");
  assert.ok(score.emotionalWeight > 3);
  assert.ok(rareScore.rarityScore > score.rarityScore);
});

test("rail orchestration rotates rails and limits creator repetition", () => {
  const rails = [
    { title: "After Midnight", slug: "after-midnight", ids: ["fear-1", "fear-2", "calm-1", "rare-1"] },
    { title: "Immersive Soundscapes", slug: "soundscapes", ids: ["fear-1", "calm-1", "rare-1"] },
    { title: "Atmospheric Worlds", slug: "atmospheric", ids: ["rare-1", "fear-1", "calm-1"] },
  ];
  const first = orchestrateEcosystemRails(rails, experiences, { seed: 3 });
  const second = orchestrateEcosystemRails(rails, experiences, { seed: 4 });

  assert.notEqual(first.rails[0].slug, second.rails[0].slug);
  assert.ok(first.rails.every(rail => rail.ids.length <= 4));
  assert.ok(first.rails.every(rail => rail.governanceMood));
});

test("ecosystem health reports imbalance without blocking curated rails", () => {
  const rails = [
    { title: "Crowded", ids: ["fear-1", "fear-2", "calm-1", "rare-1", "fear-1", "fear-2", "fear-1"] },
  ];
  const health = monitorEcosystemHealth(rails, new Map(experiences.map(item => [item.id, item])));

  assert.equal(health.status, "watching balance");
  assert.equal(health.overcrowdedRails, 1);
  assert.ok(health.averageIntensity > 0);
});
