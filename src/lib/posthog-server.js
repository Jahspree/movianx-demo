import { PostHog } from "posthog-node";

let posthogClient = null;

export function getPostHogClient() {
  if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
    return null;
  }
  if (!posthogClient) {
    posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogClient;
}

export function captureServerEvent(event, properties = {}, distinctId = "movianx-server") {
  const posthog = getPostHogClient();
  if (!posthog) return false;
  posthog.capture({
    distinctId,
    event,
    properties,
  });
  return true;
}
