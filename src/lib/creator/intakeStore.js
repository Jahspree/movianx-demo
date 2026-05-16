const intakeStore = globalThis.__movianxCreatorIntakeStore || {
  emailCaptures: new Map(),
  creatorApplications: new Map(),
};

globalThis.__movianxCreatorIntakeStore = intakeStore;

export function saveEmailCapture(payload) {
  const now = new Date().toISOString();
  const existing = intakeStore.emailCaptures.get(payload.email);
  const entry = {
    id: existing?.id || crypto.randomUUID(),
    email: payload.email,
    source: payload.source,
    intent: payload.intent,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  intakeStore.emailCaptures.set(payload.email, entry);
  return entry;
}

export function saveCreatorApplication(payload) {
  const now = new Date().toISOString();
  const existing = intakeStore.creatorApplications.get(payload.email);
  const entry = {
    id: existing?.id || crypto.randomUUID(),
    ...payload,
    verificationState: "pending_application",
    moderationStatus: "pending_review",
    uploadPermission: "locked_until_verified",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
  intakeStore.creatorApplications.set(payload.email, entry);
  return entry;
}

export function getCreatorVerificationSummary(email = "creator@example.local") {
  const application = intakeStore.creatorApplications.get(String(email).toLowerCase());
  return {
    verificationState: application?.verificationState || "pending_application",
    moderationStatus: application?.moderationStatus || "not_started",
    uploadPermission: application ? application.uploadPermission : "application_required",
    trustBadges: [
      { label: "Application", status: application ? "submitted" : "required" },
      { label: "Basic verification", status: "pending" },
      { label: "Identity verification", status: "not_started" },
      { label: "Trusted creator", status: "locked" },
    ],
  };
}

export function resetIntakeStoreForTests() {
  intakeStore.emailCaptures.clear();
  intakeStore.creatorApplications.clear();
}
