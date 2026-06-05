"use client";

import { useState } from "react";
import styles from "../ops.module.css";

const REVIEW_ACTIONS = [
  ["approved", "Approve"],
  ["rejected", "Reject"],
  ["flagged", "Flag"],
];

export default function ReviewActions({ id, currentStatus, currentNotes = "" }) {
  const [status, setStatus] = useState(currentStatus);
  const [reviewNotes, setReviewNotes] = useState(currentNotes);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function updateStatus(nextStatus) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/ops/uploads/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: nextStatus, reviewNotes }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Status update failed");
      setStatus(body.upload.status);
      setReviewNotes(body.upload.reviewNotes || "");
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
      <label className={styles.reviewNotesField}>
        <span>Review notes</span>
        <textarea
          maxLength={1200}
          onChange={event => setReviewNotes(event.target.value)}
          placeholder="Add concise moderation context."
          value={reviewNotes}
        />
      </label>
      {REVIEW_ACTIONS.map(([nextStatus, label]) => (
        <button
          className={nextStatus === "rejected" || nextStatus === "flagged" ? styles.dangerButton : styles.actionButton}
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
