import test from "node:test";
import assert from "node:assert/strict";
import { POST as createUpload } from "../src/app/api/uploads/create/route.js";
import { PUT as mockUpload } from "../src/app/api/uploads/mock-signed/[token]/route.js";
import { resetContentStoreForTests } from "../src/lib/creator/contentStore.js";
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
      assetType: "movie",
      filename: "../Night Hall Final.mp4",
      contentType: "video/mp4",
      size: 1024 * 1024,
    },
    {
      assetType: "poster",
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
    assetType: "movie",
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
  assert.equal(body.uploadSession.uploadTargets.length, 2);
  assert.match(body.uploadSession.uploadTargets[0].storagePath, /^creators\/dev-creator\/content\//);
  assert.doesNotMatch(body.uploadSession.uploadTargets[0].storagePath, /Night Hall Final/);
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
