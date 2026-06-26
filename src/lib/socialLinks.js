// Canonical, single-source-of-truth for Movianx public destinations.
// Footer social icons (in the static site bundles AND the React supporting pages) all resolve
// from here. To change a handle, change it once — here. Replace the placeholder URLs/emails below
// with the final accounts when they exist; nothing else needs to move.

export const SOCIAL_LINKS = [
  { key: "instagram", label: "Instagram", url: "https://instagram.com/movianx" },
  { key: "tiktok", label: "TikTok", url: "https://tiktok.com/@movianx" },
  { key: "youtube", label: "YouTube", url: "https://youtube.com/@movianx" },
  { key: "x", label: "X", url: "https://x.com/movianx" },
];

// Public-facing inboxes. Easy to swap for final addresses — used by the Contact page.
export const CONTACT_EMAILS = {
  general: "hello@movianx.com",
  creators: "creators@movianx.com",
  partnerships: "partners@movianx.com",
  press: "press@movianx.com",
  support: "support@movianx.com",
};
