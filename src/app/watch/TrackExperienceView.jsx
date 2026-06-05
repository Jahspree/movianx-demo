"use client";

import { useEffect } from "react";
import {
  MOVIANX_EVENTS,
  captureMovianxEventOnce,
  creatorMetadata,
} from "../../lib/movianx-analytics";

export default function TrackExperienceView({ experience }) {
  useEffect(() => {
    if (experience?.contentFormat !== "creator_spotlight") return;
    captureMovianxEventOnce(
      MOVIANX_EVENTS.CREATOR_PROFILE_VIEWED,
      creatorMetadata(experience),
      `creator-profile:${experience.id}`,
    );
  }, [experience]);

  return null;
}
