"use client";

import { useState } from "react";
import { captureMovianxEvent, ensurePostHogInitialized } from "../../../lib/movianx-analytics";

const emptyForm = {
  title: "",
  description: "",
  genre: "thriller",
  language: "English",
  maturityRating: "PG-13",
  tags: "",
  discoveryTags: "",
  contentFormat: "standalone_film",
  seriesTitle: "",
  seasonNumber: "",
  episodeNumber: "",
};

export default function UploadForm() {
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState({ video: null, audio: null, cover_art: null });
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("idle");

  function updateField(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateFile(assetType, event) {
    setFiles(current => ({ ...current, [assetType]: event.target.files?.[0] || null }));
  }

  async function submit(submitMode) {
    setBusy(true);
    setResult("");
    setStep("Creating private upload session...");
    try {
      const assets = Object.entries(files)
        .filter(([, file]) => Boolean(file))
        .map(([assetType, file]) => ({
          assetType,
          filename: file.name,
          contentType: file.type,
          size: file.size,
        }));

      const response = await fetch("/api/uploads/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          submitMode,
          tags: form.tags,
          discoveryTags: form.discoveryTags,
          assets,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Upload session failed");

      setStep("Uploading private assets...");
      const uploadedAssets = await Promise.all(body.uploadSession.uploadTargets.map(async target => {
        const file = files[target.assetType];
        if (!file) throw new Error(`Missing selected file for ${target.assetType}`);
        const uploadResponse = await fetch(target.uploadUrl, {
          method: target.method || "PUT",
          headers: target.headers || { "content-type": file.type },
          body: file,
        });
        if (!uploadResponse.ok) {
          throw new Error(`${target.assetType} upload failed with ${uploadResponse.status}`);
        }
        return {
          assetId: target.assetId,
          storagePath: target.storagePath,
          checksum: null,
        };
      }));

      setStep("Finalizing upload record...");
      const completeResponse = await fetch("/api/uploads/complete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contentId: body.content.id,
          uploadedAssets,
        }),
      });
      const completeBody = await completeResponse.json();
      if (!completeResponse.ok) throw new Error(completeBody.error?.message || "Upload completion failed");

      let finalContent = completeBody.content;
      if (submitMode === "review") {
        setStep("Submitting for review...");
        const reviewResponse = await fetch(`/api/content/${body.content.id}/submit-review`, { method: "POST" });
        const reviewBody = await reviewResponse.json();
        if (!reviewResponse.ok) throw new Error(reviewBody.error?.message || "Review submission failed");
        finalContent = reviewBody.content;
      }

      captureMovianxEvent("content_upload_submitted", {
        submit_mode: submitMode,
        genre: form.genre,
        content_format: form.contentFormat,
        asset_count: assets.length,
        maturity_rating: form.maturityRating,
      });
      setStep("Complete");
      setResult(JSON.stringify({
        status: finalContent.status,
        reviewStatus: finalContent.reviewStatus,
        contentId: finalContent.id,
        assets: finalContent.assets.map(asset => ({
          assetType: asset.assetType,
          status: asset.status,
        })),
        persistence: body.uploadSession.persistence,
      }, null, 2));
    } catch (error) {
      ensurePostHogInitialized()?.captureException?.(error);
      setStep("Upload failed");
      setResult(JSON.stringify({ error: error.message }, null, 2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="upload-form" onSubmit={event => event.preventDefault()}>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" value={form.title} onChange={updateField} required />
      </div>
      <div className="field">
        <label htmlFor="genre">Genre</label>
        <select id="genre" name="genre" value={form.genre} onChange={updateField}>
          <option value="thriller">Thriller</option>
          <option value="drama">Drama</option>
          <option value="horror">Horror</option>
          <option value="romance">Romance</option>
          <option value="documentary">Documentary</option>
          <option value="action">Action</option>
        </select>
      </div>
      <div className="field full">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={form.description} onChange={updateField} />
      </div>
      <div className="field">
        <label htmlFor="language">Language</label>
        <input id="language" name="language" value={form.language} onChange={updateField} required />
      </div>
      <div className="field">
        <label htmlFor="maturityRating">Maturity rating</label>
        <select id="maturityRating" name="maturityRating" value={form.maturityRating} onChange={updateField}>
          <option value="G">G</option>
          <option value="PG">PG</option>
          <option value="PG-13">PG-13</option>
          <option value="R">R</option>
          <option value="NC-17">NC-17</option>
          <option value="Unrated">Unrated</option>
        </select>
      </div>
      <div className="field full">
        <label htmlFor="tags">Creator tags</label>
        <input id="tags" name="tags" value={form.tags} onChange={updateField} placeholder="anime, psychological thriller, cyberpunk" />
      </div>
      <div className="field full">
        <label htmlFor="discoveryTags">Discovery tags</label>
        <input id="discoveryTags" name="discoveryTags" value={form.discoveryTags} onChange={updateField} placeholder="moods, themes, aesthetics, fandom categories" />
      </div>
      <div className="field">
        <label htmlFor="contentFormat">Release format</label>
        <select id="contentFormat" name="contentFormat" value={form.contentFormat} onChange={updateField}>
          <option value="standalone_film">Standalone film</option>
          <option value="series">Series</option>
          <option value="franchise">Franchise / creator universe</option>
          <option value="episodic_story">Episodic story</option>
          <option value="documentary_series">Documentary series</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="seriesTitle">Series / universe title</label>
        <input id="seriesTitle" name="seriesTitle" value={form.seriesTitle} onChange={updateField} placeholder="Optional for standalone releases" />
      </div>
      <div className="field">
        <label htmlFor="seasonNumber">Season</label>
        <input id="seasonNumber" name="seasonNumber" type="number" min="1" max="99" value={form.seasonNumber} onChange={updateField} placeholder="1" />
      </div>
      <div className="field">
        <label htmlFor="episodeNumber">Episode order</label>
        <input id="episodeNumber" name="episodeNumber" type="number" min="1" max="999" value={form.episodeNumber} onChange={updateField} placeholder="1" />
      </div>
      <div className="field">
        <label htmlFor="video">Video upload</label>
        <input id="video" type="file" accept="video/mp4,video/quicktime,video/webm" onChange={event => updateFile("video", event)} required />
      </div>
      <div className="field">
        <label htmlFor="audio">Audio upload</label>
        <input id="audio" type="file" accept="audio/mpeg,audio/mp4,audio/wav,audio/webm,audio/ogg" onChange={event => updateFile("audio", event)} />
      </div>
      <div className="field">
        <label htmlFor="cover_art">Cover art upload</label>
        <input id="cover_art" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => updateFile("cover_art", event)} />
      </div>
      <div className="form-actions">
        <button className="secondary-button" disabled={busy} type="button" onClick={() => submit("draft")}>Submit as draft</button>
        <button className="primary-button" disabled={busy} type="button" onClick={() => submit("review")}>Submit for review</button>
        <span className="muted">{busy ? step : "Files stay private. Uploads generate review records before anything can publish."}</span>
      </div>
      {result ? <pre className="api-result">{result}</pre> : null}
    </form>
  );
}
