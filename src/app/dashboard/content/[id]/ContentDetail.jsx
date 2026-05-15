"use client";

import { useEffect, useState } from "react";

export default function ContentDetail({ id }) {
  const [content, setContent] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch(`/api/content/${id}`).then(response => response.json()),
      fetch(`/api/content/${id}/analysis`).then(response => response.json()),
    ])
      .then(([contentBody, analysisBody]) => {
        if (!alive) return;
        setContent(contentBody.content || null);
        setAnalysis(analysisBody.analysis || null);
      })
      .catch(err => {
        if (!alive) return;
        setError(err.message);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  if (error) return <p className="muted">{error}</p>;
  if (!content) return <p className="muted">Loading private title...</p>;

  return (
    <div className="dashboard-grid">
      <div className="panel half">
        <h2>{content.title}</h2>
        <p className="muted">{content.description || "No description yet."}</p>
        <div className="trust-list">
          <div className="trust-item"><span>Status</span><span className="badge pending">{content.status}</span></div>
          <div className="trust-item"><span>Review</span><span className="badge pending">{content.reviewStatus}</span></div>
          <div className="trust-item"><span>Public access</span><span className="badge private">blocked</span></div>
        </div>
      </div>
      <div className="panel half">
        <h2>Assets</h2>
        <div className="asset-list">
          {content.assets.map(asset => (
            <div className="asset-row" key={asset.id}>
              <span>{asset.assetType}</span>
              <span className="badge pending">{asset.status}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <h2>AI analysis placeholder</h2>
        <div className="status-list">
          {(analysis?.tasks || []).map(task => (
            <div className="status-row" key={task.name}>
              <span>{task.name.replaceAll("_", " ")}</span>
              <span className="badge pending">{task.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
