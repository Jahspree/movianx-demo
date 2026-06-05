"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { configureSessionReplayForPath, ensurePostHogInitialized } from "../lib/movianx-analytics";

export default function PostHogRouteController() {
  const pathname = usePathname();

  useEffect(() => {
    const client = ensurePostHogInitialized();
    configureSessionReplayForPath(pathname, client);
  }, [pathname]);

  return null;
}

