import test from "node:test";
import assert from "node:assert/strict";
import { POST as createUpload } from "../src/app/api/uploads/create/route.js";
import { PATCH as updateOpsUpload } from "../src/app/api/ops/uploads/[id]/route.js";
import { PUT as mockUpload } from "../src/app/api/uploads/mock-signed/[token]/route.js";
import { resetContentStoreForTests } from "../src/lib/creator/contentStore.js";
import {
  getUploadPersistenceMode,
  listCreatorUploadRecords,
  resetSupabaseUploadFallbackForTests,
} from "../src/lib/creator/supabaseUploadStore.js";
import {
  validateAssetMetadata,
  validateStatusTransition,
  validateUploadRequestHeaders,
} from "../src/lib/creator/validation.js";

const validPayload = {
  title: "Night Hall",
  description: "A contained thriller for immersive review.",
  genre: "thriller",
  language: "English",
  maturityRating: "PG-13",
  tags: "thriller, indie",
  submitMode: "draft",
  assets: [
    {
      assetType: "video",
      filename: "../Night Hall Final.mp4",
      contentType: "video/mp4",
      size: 1024 * 1024,
    },
    {
      assetType: "audio",
      filename: "soundscape.mp3",
      contentType: "audio/mpeg",
      size: 500000,
    },
    {
      assetType: "cover_art",
      filename: "poster.png",
      contentType: "image/png",
      size: 400000,
    },
  ],
};

function jsonRequest(body, headers = {}) {
  return new Request("https://demo.movianx.com/api/uploads/create", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

test("invalid file type is rejected", () => {
  assert.throws(() => validateAssetMetadata({
    assetType: "video",
    filename: "payload.exe",
    contentType: "application/x-msdownload",
    size: 1024,
  }), /Invalid upload asset/);
});

test("oversized file is rejected", () => {
  assert.throws(() => validateAssetMetadata({
    assetType: "poster",
    filename: "poster.png",
    contentType: "image/png",
    size: 20 * 1024 * 1024,
  }), /Invalid upload asset/);
});

test("polyglot-style unsafe filename segments are rejected", () => {
  assert.throws(() => validateAssetMetadata({
    assetType: "poster",
    filename: "poster.svg.png",
    contentType: "image/png",
    size: 1024,
  }), /Invalid upload asset/);
});

test("mock signed uploads require private upload headers and allowed content types", async () => {
  assert.throws(() => validateUploadRequestHeaders(new Headers({
    "content-type": "image/svg+xml",
    "content-length": "100",
    "x-movianx-private-upload": "true",
  })), /Invalid upload request/);

  const response = await mockUpload(new Request("https://demo.movianx.com/api/uploads/mock-signed/token", {
    method: "PUT",
    headers: {
      "content-type": "image/png",
      "content-length": "100",
    },
  }), { params: { token: "token" } });
  assert.equal(response.status, 400);
});

test("content status transitions are constrained", () => {
  assert.equal(validateStatusTransition("uploading", "uploaded"), true);
  assert.throws(() => validateStatusTransition("draft", "published"), /Invalid status transition/);
});

test("upload create endpoint returns private signed upload structure", async () => {
  resetContentStoreForTests();
  const response = await createUpload(jsonRequest(validPayload));
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.content.status, "draft");
  assert.equal(body.uploadSession.privateStorage, true);
  assert.equal(body.uploadSession.directPublicAccess, false);
  assert.equal(body.uploadSession.uploadTargets.length, 3);
  assert.match(body.uploadSession.uploadTargets[0].storagePath, /^creators\/dev-creator\/content\//);
  assert.doesNotMatch(body.uploadSession.uploadTargets[0].storagePath, /Night Hall Final/);
  assert.equal(body.uploadSession.persistence, getUploadPersistenceMode());
});

test("upload create endpoint generates review records for admin intake", async () => {
  resetContentStoreForTests();
  resetSupabaseUploadFallbackForTests();
  const response = await createUpload(jsonRequest(validPayload));
  const body = await response.json();
  const records = await listCreatorUploadRecords({ creatorId: "dev-creator" });

  assert.equal(response.status, 201);
  assert.equal(records.length, 1);
  assert.equal(records[0].id, body.content.id);
  assert.equal(records[0].status, "uploaded");
  assert.deepEqual(records[0].assets.map(asset => asset.assetType), ["video", "audio", "cover_art"]);
});

test("ops upload status updates enforce review workflow", async () => {
  resetContentStoreForTests();
  resetSupabaseUploadFallbackForTests();
  const createResponse = await createUpload(jsonRequest(validPayload));
  const createBody = await createResponse.json();
  const auth = `Basic ${Buffer.from("ops:movianx-ops-dev").toString("base64")}`;

  const badResponse = await updateOpsUpload(new Request(`https://movianx-demo.vercel.app/api/ops/uploads/${createBody.content.id}`, {
    method: "PATCH",
    headers: {
      authorization: auth,
      "content-type": "application/json",
    },
    body: JSON.stringify({ status: "published" }),
  }), { params: { id: createBody.content.id } });
  assert.equal(badResponse.status, 400);

  const goodResponse = await updateOpsUpload(new Request(`https://movianx-demo.vercel.app/api/ops/uploads/${createBody.content.id}`, {
    method: "PATCH",
    headers: {
      authorization: auth,
      "content-type": "application/json",
    },
    body: JSON.stringify({ status: "processing" }),
  }), { params: { id: createBody.content.id } });
  const body = await goodResponse.json();
  assert.equal(goodResponse.status, 200);
  assert.equal(body.upload.status, "processing");
});

test("admin moderation can flag with review notes", async () => {
  resetContentStoreForTests();
  resetSupabaseUploadFallbackForTests();
  const createResponse = await createUpload(jsonRequest(validPayload));
  const createBody = await createResponse.json();
  const auth = `Basic ${Buffer.from("ops:movianx-ops-dev").toString("base64")}`;

  for (const status of ["processing", "under_review", "flagged"]) {
    const response = await updateOpsUpload(new Request(`https://movianx-demo.vercel.app/api/ops/uploads/${createBody.content.id}`, {
      method: "PATCH",
      headers: {
        authorization: auth,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        status,
        reviewNotes: status === "flagged" ? "Audio rights require manual confirmation." : "",
      }),
    }), { params: { id: createBody.content.id } });
    assert.equal(response.status, 200);
  }

  const [record] = await listCreatorUploadRecords({ creatorId: "dev-creator" });
  assert.equal(record.status, "flagged");
  assert.equal(record.reviewNotes, "Audio rights require manual confirmation.");
  assert.ok(record.lastReviewedAt);
});

test("upload create endpoint can require creator auth placeholder", async () => {
  const previous = process.env.REQUIRE_CREATOR_AUTH;
  process.env.REQUIRE_CREATOR_AUTH = "true";
  try {
    const response = await createUpload(jsonRequest(validPayload));
    const body = await response.json();
    assert.equal(response.status, 401);
    assert.equal(body.error.message, "Authentication required");
  } finally {
    if (previous === undefined) {
      delete process.env.REQUIRE_CREATOR_AUTH;
    } else {
      process.env.REQUIRE_CREATOR_AUTH = previous;
    }
  }
});
