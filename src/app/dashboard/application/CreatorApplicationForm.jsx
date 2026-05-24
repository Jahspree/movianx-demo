"use client";

import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  company: "",
  creatorType: "filmmaker",
  portfolioUrl: "",
  goals: "",
  website: "",
};

export default function CreatorApplicationForm() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);

  function update(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setResult("");
    try {
      const response = await fetch("/api/creator/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error?.message || "Application failed");
      setResult(`Application received. Creator access: ${body.application.verificationState}. Upload permission: ${body.application.uploadPermission}.`);
      setForm(initialForm);
    } catch (error) {
      setResult(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="upload-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="name">Creator name</label>
        <input id="name" name="name" value={form.name} onChange={update} required />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={update} required />
      </div>
      <div className="field">
        <label htmlFor="company">Studio / company</label>
        <input id="company" name="company" value={form.company} onChange={update} />
      </div>
      <div className="field">
        <label htmlFor="creatorType">Creator type</label>
        <select id="creatorType" name="creatorType" value={form.creatorType} onChange={update}>
          <option value="filmmaker">Filmmaker</option>
          <option value="director">Director</option>
          <option value="artist">Artist</option>
          <option value="studio">Studio</option>
          <option value="storyteller">Storyteller</option>
        </select>
      </div>
      <div className="field full">
        <label htmlFor="portfolioUrl">Portfolio URL</label>
        <input id="portfolioUrl" name="portfolioUrl" value={form.portfolioUrl} onChange={update} placeholder="https://..." />
      </div>
      <div className="field full">
        <label htmlFor="goals">What do you want to build with Movianx?</label>
        <textarea id="goals" name="goals" value={form.goals} onChange={update} required />
      </div>
      <div className="hidden-field" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex="-1" value={form.website} onChange={update} />
      </div>
      <div className="form-actions">
        <button className="primary-button" disabled={busy} type="submit">
          {busy ? "Submitting..." : "Submit creator application"}
        </button>
        <span className="muted">Creator access begins privately. Upload permission opens as trust is established.</span>
      </div>
      {result ? <div className="api-result">{result}</div> : null}
    </form>
  );
}
