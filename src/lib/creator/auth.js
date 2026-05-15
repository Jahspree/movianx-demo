export function getCreatorFromRequest(request) {
  const requireAuth = process.env.REQUIRE_CREATOR_AUTH === "true";
  const creatorId = request.headers.get("x-creator-id");
  const creatorEmail = request.headers.get("x-creator-email");

  if (requireAuth && !creatorId) {
    return null;
  }

  return {
    id: creatorId || "dev-creator",
    displayName: request.headers.get("x-creator-name") || "Movianx Creator",
    email: creatorEmail || "creator@example.local",
    role: "creator",
  };
}

export function requireCreator(request) {
  const creator = getCreatorFromRequest(request);
  if (!creator) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }
  return creator;
}
