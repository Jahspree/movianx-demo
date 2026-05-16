"use client";

import { useState } from "react";

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
  const [files, setFiles] = useState({ movie: null, trailer: null, poster: null });
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);

  function updateField(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateFile(assetType, event) {
    setFiles(current => ({ ...current, [assetType]: event.target.files?.[0] || null }));
  }

  async function submit(submitMode) {
    setBusy(true);
    setResult("");
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
      setResult(JSON.stringify(body, null, 2));
    } catch (error) {
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
        <label htmlFor="movie">Movie/video upload</label>
        <input id="movie" type="file" accept="video/mp4,video/quicktime,video/webm" onChange={event => updateFile("movie", event)} required />
      </div>
      <div className="field">
        <label htmlFor="trailer">Trailer upload</label>
        <input id="trailer" type="file" accept="video/mp4,video/quicktime,video/webm" onChange={event => updateFile("trailer", event)} />
      </div>
      <div className="field">
        <label htmlFor="poster">Poster/thumbnail upload</label>
        <input id="poster" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => updateFile("poster", event)} />
      </div>
      <div className="form-actions">
        <button className="secondary-button" disabled={busy} type="button" onClick={() => submit("draft")}>Submit as draft</button>
        <button className="primary-button" disabled={busy} type="button" onClick={() => submit("review")}>Submit for review</button>
        <span className="muted">Files stay private. This creates signed upload targets only.</span>
      </div>
      {result ? <pre className="api-result">{result}</pre> : null}
    </form>
  );
}
