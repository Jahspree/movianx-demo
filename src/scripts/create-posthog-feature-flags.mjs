const FEATURE_FLAGS = [
  "reimagined_experience",
  "watch_party_v2",
  "creator_uploads_beta",
  "premium_experience",
];

const projectId = process.env.POSTHOG_PROJECT_ID || "455926";
const host = (process.env.POSTHOG_API_HOST || "https://us.posthog.com").replace(/\/$/, "");
const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;

if (!apiKey) {
  console.error("POSTHOG_PERSONAL_API_KEY is required to create feature flags.");
  process.exit(1);
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.status === 400 || response.status === 409) {
    const text = await response.text();
    if (text.toLowerCase().includes("already")) return { skipped: true };
    throw new Error(`${response.status} ${text}`);
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${await response.text()}`);
  }

  return response.json();
}

for (const key of FEATURE_FLAGS) {
  const result = await postJson(`${host}/api/projects/${projectId}/feature_flags/`, {
    key,
    name: key.replaceAll("_", " "),
    active: true,
    filters: {
      groups: [
        {
          properties: [],
          rollout_percentage: 0,
        },
      ],
    },
  });
  console.log(result.skipped ? `exists ${key}` : `created ${key}`);
}
