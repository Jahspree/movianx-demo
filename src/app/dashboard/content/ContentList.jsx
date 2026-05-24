"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ContentList() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let alive = true;
    fetch("/api/content")
      .then(response => response.json())
      .then(body => {
        if (!alive) return;
        setItems(body.content || []);
        setStatus("ready");
      })
      .catch(() => {
        if (!alive) return;
        setStatus("error");
      });
    return () => {
      alive = false;
    };
  }, []);

  if (status === "loading") return <p className="muted">Loading private content...</p>;
  if (status === "error") return <p className="muted">Content API unavailable.</p>;
  if (!items.length) {
    return (
      <div className="status-list">
        <div className="status-row">
          <span>No uploaded content yet</span>
          <Link className="button-link" href="/dashboard/upload">Create upload</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="status-list">
      {items.map(item => (
        <Link className="status-row" href={`/dashboard/content/${item.id}`} key={item.id}>
          <span>{item.title}</span>
          <span className="badge gold">{item.status}</span>
        </Link>
      ))}
    </div>
  );
}
