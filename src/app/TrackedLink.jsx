"use client";

import Link from "next/link";
import { captureMovianxEvent } from "../lib/movianx-analytics";

export default function TrackedLink({ event, properties, dedupeKey, onClick, children, ...props }) {
  return (
    <Link
      {...props}
      onClick={(clickEvent) => {
        if (event) captureMovianxEvent(event, properties, { dedupeKey });
        onClick?.(clickEvent);
      }}
    >
      {children}
    </Link>
  );
}

