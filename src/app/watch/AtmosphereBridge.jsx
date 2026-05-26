"use client";

import { useEffect } from "react";
import { getAtmosphereState } from "../../lib/atmosphere";

export default function AtmosphereBridge({ zone = "explore" }) {
  useEffect(() => {
    function applyAtmosphere() {
      document.documentElement.dataset.movianxAtmosphere = getAtmosphereState();
      document.documentElement.dataset.movianxZone = zone;
    }

    applyAtmosphere();
    const timer = window.setInterval(applyAtmosphere, 60000);

    return () => {
      window.clearInterval(timer);
      delete document.documentElement.dataset.movianxZone;
    };
  }, [zone]);

  return null;
}
