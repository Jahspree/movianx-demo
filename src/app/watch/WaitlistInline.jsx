"use client";

import { useState } from "react";
import styles from "./watch.module.css";

export default function WaitlistInline() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setStatus("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source: "watch", intent: "early_access" }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error?.message || "Could not join yet");
      setEmail("");
      setStatus("You're on the list. We'll send release notes quietly.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.inlineCapture} onSubmit={submit}>
      <input
        type="email"
        name="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <button type="submit" disabled={busy}>{busy ? "Joining..." : "Join Waitlist"}</button>
      {status ? <span className={styles.captureStatus} role="status" aria-live="polite">{status}</span> : null}
    </form>
  );
}
