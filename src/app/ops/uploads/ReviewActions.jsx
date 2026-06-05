"use client";

import { useState } from "react";
import styles from "../ops.module.css";

const REVIEW_ACTIONS = [
  ["processing", "Mark Processing"],
  ["under_review", "Under Review"],
  ["approved", "Approve"],
  ["published", "Publish"],
  ["rejected", "Reject"],
];

export default function ReviewActions({ id, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function updateStatus(nextStatus) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/ops/uploads/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Status update failed");
      setStatus(body.upload.status);
      setMessage(`Updated to ${formatStatus(body.upload.status)}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.reviewActions}>
      <span className={styles.statusPill}>{formatStatus(status)}</span>
      {REVIEW_ACTIONS.map(([nextStatus, label]) => (
        <button
          className={nextStatus === "rejected" ? styles.dangerButton : styles.actionButton}
          disabled={busy || status === nextStatus}
          key={nextStatus}
          onClick={() => updateStatus(nextStatus)}
          type="button"
        >
          {label}
        </button>
      ))}
      {message ? <small className={styles.muted}>{message}</small> : null}
    </div>
  );
}

function formatStatus(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, char => char.toUpperCase());
}
